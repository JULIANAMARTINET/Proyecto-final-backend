import { CartDao, ProductDao } from "../../Dao/index.js";
import { config } from "../../config/index.js";
import {
  DATE_UTILS,
  ERRORS_UTILS,
  JOI_VALIDATOR,
  LOGGER_UTILS,
  EMAIL_UTILS,
} from "../../utils/index.js";

// /api/carts
const CreateCart = async (req, res) => {
  const baseCart = { timestamp: DATE_UTILS.getTimestamp(), products: [] };
  const cart = await CartDao.save(baseCart);

  res.send({ success: true, cartId: cart.id });
};

const getById = async (req, res) => {
  const id = req.user.cart;
  try {
    const cart = await CartDao.getById(id);
    const cartProducts = cart.products;
    if (!cart) {
      return res.send({ error: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
    }
    res.render("carts", { cartProducts });
  } catch (error) {
    res.send({ error: "Internal server error" });
  }
};

const addInCart = async (req, res) => {
  const { productId } = req.params;
  const cartId = req.user.cart;

  const cart = await CartDao.getById(cartId);

  if (!cart)
    return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });

  const product = await ProductDao.getById(productId);
  if (!product)
    return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT });

  cart.products.push(product);
  await CartDao.updateById(cartId, cart);

  res.redirect("/api/products");
};

const deleteCartProduct = async (req, res) => {
  try {
    const idProduct = req.params;
    const cartId = req.user.cart;

    const cart = await CartDao.getById(cartId);

    if (!cart) {
      res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });
    }

    const foundElementIndex = cart.products.findIndex(
      (element) => element.id == idProduct.id
    );

    if (foundElementIndex === -1)
      return res.send({
        error: true,
        message: ERRORS_UTILS.MESSAGES.NO_PRODUCT,
      });

    cart.products.splice(foundElementIndex, 1);
    await CartDao.updateById(cartId, cart);
    res.redirect("/api/cart");
  } catch (error) {
    console.log(error, `error from deleteProductFromCart`);
    logger.error("error desde el deleteProductFromCart");
    res.send({
      success: false,
      data: undefined,
      message: ERRORS_UTILS.MESSAGES.NO_CART,
    });
  }
};

const payCart = async (req, res) => {
  try {

    const id = req.user.cart;
    const email = req.user.email;
    const cart = await CartDao.getById(id);
    if (!cart)
      return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });

    let subject = "Nueva compra ingresada!";
    let mailTo = config.MAIL.USER;
    let listado = cart.products
      .map(
        ({ title, price }) =>
          `
            <li>
            ${title} : $${price}
            </li>
          
            `
      )
      .join("");

    let html = `
                        <h3>Pago realizado por el usuario ${email} </h3>
                        <p> Detalle de compra:</p>
                        <ul>
                            ${listado}
                        </ul>
                    `;

    await EMAIL_UTILS.sendEmail(mailTo, subject, html);

    cart.products = [];
    await CartDao.updateById(id, cart);

    res.render("checkout");
  } catch (error) {
    console.log(error, `error from cartById`);
    logger.error("error desde el cartById");
    res.send({
      success: false,
      data: undefined,
      message: ERRORS_UTILS.MESSAGES.NO_CART,
    });
  }
};

export const CartController = {
  CreateCart,
  addInCart,
  getById,
  deleteCartProduct,
  payCart,
};
