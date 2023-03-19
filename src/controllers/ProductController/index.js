import { daoFactory } from "../../models/Dao/index.js";
import { Loggers } from "../../loggers/loggers.js";
import {
  DATE_UTILS,
  ERRORS_UTILS,
  JOI_VALIDATOR,
  LOGGER_UTILS,
} from "../../utils/index.js";

const productDao = daoFactory.getSelectedDao("product");

// /api/products
const getAll =
  ({ isApi }) =>
  async (req, res) => {
    try {
      const product = await productDao.getAll();

      if (!product) {
        return res.send({ error: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
      }
      isApi ? res.send({ product }) : res.render("products-table", { product });
    } catch (error) {
      console.log(error, `error from getAll`);
      Loggers.logError("error desde el getAll: " + error);
      res.send({
        success: false,
        message: ERRORS_UTILS.MESSAGES.NO_PRODUCT,
      });
    }
  };

const getById =
  ({ isApi }) =>
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productDao.getById(id);

      isApi ? res.send({ product }) : res.render("product-Id", { product });
    } catch (error) {
      Loggers.logError(error, `error from getById`);
      console.log(error, `error from getById`);
      res.send({
        success: false,
        message: ERRORS_UTILS.MESSAGES.NO_PRODUCT,
      });
    }
  };

const createProductView = async (req, res) => {
  res.render("add-products");
};
const updateProductView = async (req, res) => {
  const { id } = req.params;
  const product = await productDao.getById(id);
  res.render("updateProduct", { product });
};

const createProduct = async (req, res) => {
  try {
    const { title, description, code, thumbnail, price, stock } = req.body;
    const newProduct = await JOI_VALIDATOR.product.validateAsync({
      title,
      description,
      code,
      thumbnail,
      price,
      stock,
      timestamp: DATE_UTILS.getTimestamp(),
    });

    await productDao.save(newProduct);
    const product = await productDao.getAll();

    res.redirect("/productos");
  } catch (error) {
    await LOGGER_UTILS.addLog(error);
    res.render("err.hbs");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, code, thumbnail, price, stock } = req.body;
    console.log("body", req.body);
    const updateProduct = await JOI_VALIDATOR.product.validateAsync({
      title,
      description,
      code,
      thumbnail,
      price,
      stock,
      timestamp: DATE_UTILS.getTimestamp(),
    });

    await productDao.updateById(id, updateProduct);
    const product = await productDao.getAll();

    res.redirect("/productos");
  } catch (error) {
    await LOGGER_UTILS.addLog(error);
    res.render("err.hbs");
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await productDao.deleteById(id);
    res.redirect("/productos");
  } catch (error) {
    Loggers.logError(error, `error from deleteById`);
    console.log(error, `error from deleteById`);
    res.send({
      success: false,
      data: undefined,
      message: ERRORS_UTILS.MESSAGES.NO_PRODUCT,
    });
  }
};

export const ProductController = {
  getAll,
  getById,
  createProduct,
  updateProduct,
  updateProductView,
  createProductView,
  deleteById,
};
