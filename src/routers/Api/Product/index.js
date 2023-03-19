import { Router } from "express";
import { verifyRole } from "../../../middlewares/verifyRole.js";
import { ProductController } from "../../../controllers/index.js";
import { isValidAuthToken } from "../../../middlewares/index.js";

const router = Router();

// /api/products

router.get("/",isValidAuthToken, ProductController.getAll({isApi: true}));
router.get("/:id", ProductController.getById({isApi: true}));
router.post("/", verifyRole, ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteById);


export { router as ProductRouter };
