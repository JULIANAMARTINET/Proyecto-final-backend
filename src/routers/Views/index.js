import { Router } from "express";
import { isValidAuthToken, verifyRole } from "../../middlewares/index.js";
import { AuthController, ProductController, CartController } from "../../controllers/index.js";

const viewRouter = Router();

viewRouter.get("/", (req, res) => {
  res.render("home");
});

// LOGIN
viewRouter.get("/inicio", isValidAuthToken, AuthController.home);
viewRouter.get("/login", AuthController.logInView);
viewRouter.get("/login-error", AuthController.logInErr);
// SIGNUP
viewRouter.get("/signup", AuthController.signUpView);
viewRouter.get("/signup-error", AuthController.signUpErr);

// LOGOUT
viewRouter.post("/logout", AuthController.logOut);

// PRODUCTS
viewRouter.get("/productos", isValidAuthToken,ProductController.getAll({isApi: false}));
viewRouter.get("/productos/:id", ProductController.getById({isApi: false}));
viewRouter.get("/agregarProducto", verifyRole, ProductController.createProductView);
viewRouter.get("/modificarProducto/:id", verifyRole, ProductController.updateProductView);

// CARTS
viewRouter.get("/carrito", isValidAuthToken, CartController.getById({isApi: false}));
viewRouter.get("/checkout",isValidAuthToken, CartController.payCart({isApi: false}));


export { viewRouter };
