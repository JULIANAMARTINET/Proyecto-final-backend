import dotenv from "dotenv";
import path from 'path'

const NODE_ENV = process.env.NODE_ENV
const configDotenv=path.join(process.cwd() + '/.env')

if(NODE_ENV==='prod')
    configDotenv.path.join(process.cwd() + '/.env.prod')

dotenv.config(configDotenv);

const PRODUCTS_FILENAME = "products";
const CARTS_FILENAME = "carts";

const config = {
  SERVER: {
    PORT: process.env.PORT || 8080,
    SELECTED_DATABASE: process.env.SELECTED_DB ?? "memory",
  },
  DATABASES: {
    filesystem: {
      PRODUCTS_FILENAME,
      CARTS_FILENAME,
    },
    mongo: {
      url: process.env.MONGO_DB_URL,
      dbName: process.env.MONGO_DB_NAME,
    },
  },
  MAIL: {
    USER: process.env.NODEMAILER_USER,
    PASS: process.env.NODEMAILER_PASS,
},
};

export { config };
