import { Router } from "express";
import passport from "passport";
import { AuthController } from "../../controllers/index.js";
import { JWT_UTILS} from "../../utils/index.js";
import { isValidAuthToken} from "../../middlewares/index.js";

const router = Router();

router.get('/inicio',isValidAuthToken, AuthController.home)

// LOGIN
router.get('/login', AuthController.logInView)
router.post('/login', passport.authenticate('login', { failureRedirect: "/api/auth/login-error" }), AuthController.logIn)
router.get('/login-error', AuthController.logInErr)

// SIGNUP
router.get('/signup', AuthController.signUpView)
router.post("/signup", AuthController.signUp)
router.get('/signup-error', AuthController.signUpErr)

// GITHUB
router.get("/github-login", passport.authenticate("github"));
router.get("/github", passport.authenticate("github"), (req, res) => {
  const { user } = req;

  const token = JWT_UTILS.createToken(user, "secret");

  res.cookie("tokenCookie", token, { maxAge: 1000 * 60 * 60 });
  
  res.redirect("/");
});

// LOGOUT
router.post("/logout", AuthController.logOut)
  
export { router as AuthRouter };
