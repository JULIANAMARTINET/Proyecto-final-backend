import { config } from "../config/index.js";
import { MongoDBService } from "../services/index.js";
import { CartsMongo, CartsFilesystem, CartsMemory } from "./Carts/index.js";
import {
  ProductsMongo,
  ProductsFilesystem,
  ProductsMemory,
} from "./Products/index.js";
import { UsersMongo } from "./Users/index.js";
import { MessagesMongo } from "./Messages/index.js";

const getSelectedDaos = () => {
  switch (config.SERVER.SELECTED_DATABASE) {
    case "mongo": {
      MongoDBService.init();
      return {
        ProductDao: new ProductsMongo(),
        CartDao: new CartsMongo(),
        UserDao: new UsersMongo(),
        MessageDao: new MessagesMongo(),
      };
    }
    case "filesystem": {
      return {
        ProductDao: new ProductsFilesystem(),
        CartDao: new CartsFilesystem(),
      };
    }
    case "memory": {
      return {
        ProductDao: new ProductsMemory(),
        CartDao: new CartsMemory(),
      };
    }
  }
};

const { ProductDao, CartDao, UserDao, MessageDao } = getSelectedDaos();

export { ProductDao, CartDao, UserDao, MessageDao };