import { Router } from "express";
import { isValidAuthToken} from "../../middlewares/index.js";
import { AuthController } from "../../controllers/index.js";

const viewRouter = Router();


viewRouter.get('/', (req, res) => {
    res.render('home')
  })
  viewRouter.get("/add", (req, res) => {
    res.render("add-products")})


    // LOGIN
    viewRouter.get('/inicio',isValidAuthToken, AuthController.home)
    viewRouter.get('/login', AuthController.logInView)
    // SIGNUP
    viewRouter.get('/signup', AuthController.signUpView)
 // LOGOUT
    viewRouter.post("/logout", AuthController.logOut)

    // ERROR
    viewRouter.get('/signup-error', AuthController.signUpErr)



    export {viewRouter}