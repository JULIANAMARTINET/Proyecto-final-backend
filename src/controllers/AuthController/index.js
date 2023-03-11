import {Loggers} from "../../loggers/loggers.js";
import {
  JWT_UTILS
} from "../../utils/index.js";
import {userService} from "../../models/Service/index.js"
import { MessageController } from '../MessageController/index.js'


// HOME
const home = async (req, res) => {
  const email = req.user.email;
  res.render("inicio", { email });
};

// SIGN UP
const signUpView = async (req, res) => {
  res.render("signup");
};

const signUp = async (req, res) => {
  try {
    const newUser = req.body;
    console.log("user", newUser)

    const data = await userService.registerUser(newUser);

    res.redirect("login");
  } catch (error) {
    res.render("err.hbs");
    Loggers.logError(`error from signUp`);
  }
};

const signUpErr = async (req, res) => {
  res.render("err-signup.hbs");
};

// LOGIN

const logInView = async (req, res) => {
  res.render("login");
};

const logIn = async (req, res) => {
  try {
    const { user } = req;
    const email = user.email;
    const token = JWT_UTILS.createToken(user, "secret");
    res.cookie("tokenCookie", token, { maxAge: 1000 * 60 * 60 });

    res.render("inicio", { email });
  } catch (error) {
    res.render("/api/auth/login-error");
    Loggers.logError(`error from middlewares/passportAuth - LocalStrategy`, error);
    done(error);
  }
};

const logInErr = async (req, res) => {
  Loggers.logError("Credenciales incorrectas");
  res.render("err-login.hbs");
};

// LOGOUT

const logOut = async (req, res) => {
  await MessageController.deleteMessages()

  req.session.destroy();
  res.clearCookie("tokenCookie");
  res.render("logout");
};

export const AuthController = {
  home,
  signUp,
  logIn,
  logOut,
  logInView,
  signUpView,
  signUpErr,
  logInErr,
};
