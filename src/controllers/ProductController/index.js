import { ProductDao } from "../../Dao/index.js";
import {
  DATE_UTILS,
  ERRORS_UTILS,
  JOI_VALIDATOR,
  LOGGER_UTILS,
} from "../../utils/index.js";

// /api/products
const getAll = async (req, res) => {
  try {
    const product = await ProductDao.getAll();

    if (!product) {
      return res.send({ error: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
    }

    res.render("products-table", { product });
   
  } catch (error) {
    res.send({ error: "Internal server error" });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  const product = await ProductDao.getById(id);

  res.send(product);
};

const createProductView = async (req, res) => {
  res.render("add-products")
}

const createProduct = async (req, res) => {
  try {
    const { title, description, code, thumbnail, price, stock } = req.body;

    // con el validador que creamos en el archivo joi validator, podemos invocar al método validateAsync y pasarle las propiedades que creemos seran nuestro producto, y si están bien, nos devolvera el objeto que guardamos en product
    // si no, saltará al catch
    const product = await JOI_VALIDATOR.product.validateAsync({
      title,
      description,
      code,
      thumbnail,
      price,
      stock,
      timestamp: DATE_UTILS.getTimestamp(),
    });

    const createdProduct = await ProductDao.save(product);
    console.log("newproduct", createdProduct);
    res.redirect("/api/products");
  } catch (error) {
    // no seria recomendable guardar logs de errores de input de usuario, que genera joi
    // normalmente guardariamos errores propios e internos del servidor
    await LOGGER_UTILS.addLog(error);
    res.send(error);
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    await ProductDao.deleteById(id);

    res.redirect("/api/products");
  } catch (error) {
    console.error(error);
    res.send({ error: "Ocurrio un error" });
  }
};

export const ProductController = {
  getAll,
  getById,
  createProduct,
  createProductView,
  deleteById,
};
