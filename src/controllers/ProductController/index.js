import { daoFactory } from "../../models/Dao/index.js";
import {Loggers} from '../../loggers/loggers.js'
import {
  DATE_UTILS,
  ERRORS_UTILS,
  JOI_VALIDATOR,
  LOGGER_UTILS,
} from "../../utils/index.js";

const productDao = daoFactory.getSelectedDao("product");

// /api/products
const getAll = async (req, res) => {
  try {
    const product = await productDao.getAll();

    if (!product) {
      return res.send({ error: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
    }

    res.render("products-table", { product });
   
  } catch (error) {
    console.log(error, `error from getAll`);
    Loggers.logError('error desde el getAll: ' + error)
    res.send({ success: false, data: undefined, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT })
  }
};

const getById = async (req, res) => {
  try{
  const { id } = req.params;
  const product = await productDao.getById(id);

  res.send(product)
} catch (error) {
  Loggers.logError(error, `error from getById`)
  console.log(error, `error from getById`);
  res.send({ success: false, data: undefined, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT })
}
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

    const createdProduct = await productDao.save(product);
    console.log("newproduct", createdProduct);
    res.send(createdProduct.id)
    res.redirect("/api/products");
  } catch (error) {
    // no seria recomendable guardar logs de errores de input de usuario, que genera joi
    // normalmente guardariamos errores propios e internos del servidor
    await LOGGER_UTILS.addLog(error);
    res.redirect('/api/products/')
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    await productDao.deleteById(id);

    res.redirect("/api/products");
  } catch (error) {
    Loggers.logError(error, `error from deleteById`)
    console.log(error, `error from deleteById`);
    res.send({ success: false, data: undefined, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT })
}
};

export const ProductController = {
  getAll,
  getById,
  createProduct,
  createProductView,
  deleteById,
};
