import { daoFactory } from "../../Dao/index.js";
import {Loggers} from "../../loggers/loggers.js";
import {
  JWT_UTILS,
  DATE_UTILS,
  EMAIL_UTILS,
  BCRYPT_VALIDATION,
} from "../../utils/index.js";


const userDao = daoFactory.getSelectedDao("users");
const cartDao = daoFactory.getSelectedDao("cart");

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
    const { name, lastname, age, phone, adress, email, password } = req.body;
    if (
      !name ||
      !lastname ||
      !age ||
      !phone ||
      !adress ||
      !email ||
      !password
    ) {
      return res.send({ success: false });
    }

    const existUser = await userDao.getOne({ email });

    if (existUser && existUser.password) {
      return res.redirect("/api/auth/signup-error");
    }
    if (existUser && !existUser.password) {
      const updateUser = await userDao.updateById(existUser._id, {
        ...existUser,
        password,
      });

      return res.redirect("login");
    }
    const UserCart = { timestamp: DATE_UTILS.getTimestamp(), products: [] };
    const cart = await cartDao.save(UserCart);

    await userDao.save({
      name,
      lastname,
      age,
      phone,
      adress,
      email,
      password: BCRYPT_VALIDATION.hashPassword(password),
      cart: cart.id,
    });

    let subject = "Nuevo usuario";
    let mailTo = "martinetjuliana@gmail.com";
    let html = `
                    <h4>Nuevo registro en Ecommerce!</h4>
                    <p> Datos:</p>
                    <ul>
                    <li> Nombre y apellido: ${name} ${lastname}</li>
                    <li> Email: ${email}</li>
                    <li> Teléfono: ${phone}</li>
                    <li> Edad: ${age}</li>
                    <li> Direccion: ${adress}</li>
                    </ul>
        `;
    await EMAIL_UTILS.sendEmail(mailTo, subject, html);

    return res.redirect("login");
  } catch (error) {
    res.render("/api/auth/signup-error");
    Loggers.logError(`error from signUp`);
    res.send({ success: false });
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
