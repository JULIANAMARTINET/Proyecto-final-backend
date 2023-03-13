import {apiRouter} from "./Api/index.js";
import {viewRouter} from "./Views/index.js";
import { Router } from "express";

const router = Router();

router.use("/api", apiRouter);
router.use("/", viewRouter);

// router 


export default router