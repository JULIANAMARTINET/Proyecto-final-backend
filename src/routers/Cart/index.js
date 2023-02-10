import { Router } from "express";
import { CartController } from "../../controllers/index.js";
import { isValidAuthToken} from "../../middlewares/index.js";

const router = Router();

router.get("/", isValidAuthToken, CartController.getById);

router.post("/", CartController.CreateCart)

router.post("/:productId", isValidAuthToken, CartController.addInCart)

router.delete("/:id", isValidAuthToken, CartController.deleteCartProduct);

router.get("/pay", isValidAuthToken, CartController.payCart);

export { router as CartRouter };
