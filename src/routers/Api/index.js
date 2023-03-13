import { Router } from "express";
import { ProductRouter } from "./Product/index.js";
import  { CartRouter } from "./Cart/index.js";
import  { AuthRouter } from "./Auth/index.js";

const apiRouter = Router();

apiRouter.use("/auth", AuthRouter);
apiRouter.use("/products", ProductRouter);
apiRouter.use("/cart", CartRouter);


export { apiRouter}