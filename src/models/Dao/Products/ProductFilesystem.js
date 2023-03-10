import { ContainerFilesystem } from "../../../Containers/index.js";
import { config } from "../../../config/index.js";

export class ProductsFilesystem extends ContainerFilesystem {
  constructor() {
    super(config.DATABASES.filesystem.PRODUCTS_FILENAME);
  }
}
