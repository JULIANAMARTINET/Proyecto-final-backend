import { Router } from "express";
import passport from "passport";
import { AuthController } from "../../../controllers/index.js";

const router = Router();

router.post('/login', passport.authenticate('login', { failureRedirect: "/login-error" }), AuthController.logIn)
router.get('/:id',  AuthController.getById)
router.get('/login-error', AuthController.logInErr)
router.post("/signup", AuthController.signUp)

export { router as AuthRouter };
