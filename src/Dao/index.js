import { config } from "../config/index.js";
import { UsersMongo } from "./Users/index.js";
import { ProductsMongo,ProductsFilesystem,ProductsMemory } from "./Products/index.js";
import { CartsMongo, CartsFilesystem, CartsMemory } from "./Carts/index.js";
import { MessagesMongo } from "./Messages/index.js";

class DaoFactory {
  
  #ProductDao;
  #CartDao;
  #UserDao;
  #MessageDao;
  constructor() {
  
    this.#setSelectedDaos();
  }

  async #setSelectedDaos() {
    switch (config.SERVER.SELECTED_DATABASE) {
      case "mongo": {

          this.#ProductDao = new ProductsMongo(),
          this.#CartDao = new CartsMongo(),
          this.#UserDao = new UsersMongo(),
          this.#MessageDao = new MessagesMongo();
      }
      case "filesystem": {
  
        this.#ProductDao = new ProductsFilesystem(),
        this.#CartDao = new CartsFilesystem(),
        this.#UserDao = new UsersMongo();
      }
      case "default": {
         this.#ProductDao = new ProductsMemory(),
          this.#CartDao = new CartsMemory(),
          this.#UserDao = new UsersMongo();
      }
    }
  }

  getSelectedDao(dao) {
    const daos = {
      product: this.#ProductDao,
      cart: this.#CartDao,
      users: this.#UserDao,
      message: this.#MessageDao,
    };
    return daos[dao];
  }
}

export const daoFactory = new DaoFactory();

