import { Router } from "express";
import { verifyRole } from "../../middlewares/verifyRole.js";
import { ProductController } from "../../controllers/index.js";
import { isValidAuthToken } from "../../middlewares/index.js";

const router = Router();

// /api/products

router.get("/", ProductController.getAll);

router.get("/:id", ProductController.getById);

router.post("/",  ProductController.createProduct);

router.delete("/:id", ProductController.deleteById);


export { router as ProductRouter };
