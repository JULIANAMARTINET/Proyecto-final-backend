import { daoFactory } from "../../models/Dao/index.js";
import { config } from "../../config/index.js";
import {Loggers} from '../../loggers/loggers.js'
import {
  DATE_UTILS,
  ERRORS_UTILS,
  EMAIL_UTILS,
} from "../../utils/index.js";

const cartDao = daoFactory.getSelectedDao("cart");
const productDao = daoFactory.getSelectedDao("product");
  
// /api/carts
const CreateCart = async (req, res) => {
  try{
  const baseCart = { timestamp: DATE_UTILS.getTimestamp(), products: [] };
  const cart = await cartDao.save(baseCart);

  res.send({ success: true, cartId: cart.id });
} catch (error) {
  console.log(error, `error from CreateCart`);
  Loggers.logError('error desde el CreateCart')
  res.send({ success: false, data: undefined, message: ERRORS_UTILS.MESSAGES.NO_CART })
};
}

const getById = async (req, res) => {
  const id = req.user.cart;
  try {
    const cart = await cartDao.getById(id);
    const cartProducts = cart.products;
    console.log(cartProducts)
    if (!cart) {
      return res.send({ error: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
    }
    res.render("carts", { cartProducts });
  } catch (error) {
    console.log(error, `error from getById`);
    Loggers.logError('error desde el getById')
    res.send({ success: false, data: undefined, message: ERRORS_UTILS.MESSAGES.NO_CART })
  }
};

const addInCart = async (req, res) => {
  try{
  const { productId } = req.params;
  const cartId = req.user.cart;

  const cart = await cartDao.getById(cartId);

  if (!cart)
    return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });

  const productCard = await productDao.getById(productId);

  if (!productCard)
    return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT });

  const findProduct = cart.products.find(e => e.product.id == productCard.id)

  if (!findProduct){
    cart.products.push({product: productCard, quantity: 1 });
    await cartDao.updateById(cartId, cart);
    return res.redirect("/api/products");
  }
  const productoIndex = cart.products.indexOf(findProduct);
  cart.products[productoIndex].quantity = (cart.products[productoIndex].quantity+1)
  
  await cartDao.updateById(cartId, cart);
  res.redirect("/api/products");

} catch (error) {
  console.log(error, `error from addInCart`);
  Loggers.logError('error desde el addInCart')
  res.send({ success: false, data: undefined, message: ERRORS_UTILS.MESSAGES.NO_CART })
}
}

const deleteCartProduct = async (req, res) => {
  try {
    const idProduct = req.params;
    const cartId = req.user.cart;

    const cart = await cartDao.getById(cartId);

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

   if (cart.products[foundElementIndex].quantity === 1){
    cart.products.splice(foundElementIndex, 1);
    await cartDao.updateById(cartId, cart);
    return res.redirect("/api/cart");}

    cart.products[foundElementIndex].quantity = (cart.products[foundElementIndex].quantity-1)
    await cartDao.updateById(cartId, cart);
    res.redirect("/api/cart")
  } catch (error) {
    console.log(error, `error from deleteCartProduct`);
    Loggers.logError("error desde el deleteCartProduct");
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
    const cart = await cartDao.getById(id);
    const productCart = cart.products

    if (!cart)
      return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });

      const order = []

       await Promise.all(productCart.map(async e => {
         order.push({title: e.product.title, cant: e.quantity , price: e.product.price*e.quantity }) }))

            
     let subject = "Nueva compra ingresada!";
     let mailTo = config.MAIL.USER;
     let total = order.reduce((acumulador, actual) => acumulador + actual.price, 0);
     let listado = order
       .map(
         ({ title, cant, price,  }) =>
           `<li>
           ${cant} ${title} : $${price}
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
                         <p>Total $${total}<p>

                     `
   await EMAIL_UTILS.sendEmail(mailTo, subject, html);

    cart.products = [];
    await cartDao.updateById(id, cart);

    res.render("checkout");
  } catch (error) {
    console.log(error, `error from payCart`);
    Loggers.logError("error desde el payCart");
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
