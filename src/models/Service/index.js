import {
    DATE_UTILS,
    EMAIL_UTILS,
    BCRYPT_VALIDATION,
  } from "../../utils/index.js"
  import { daoFactory } from "../Dao/index.js";
  import UserDTO from "../Dto/index.js";

const userDao = daoFactory.getSelectedDao("users");
const cartDao = daoFactory.getSelectedDao("cart");

const registerUser = async (user)=>{
    try {  
      const existUser = await userDao.getOne( user.email );

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

      user.password = BCRYPT_VALIDATION.hashPassword(user.password)
      user["cart"] = cart.id

      const saveUser = await userDao.save(user);
      if (!saveUser) throw {message: "se ha producido un error", status: 403};
  
      let subject = "Nuevo usuario";
      let mailTo = "martinetjuliana@gmail.com";
      let html = `
                      <h4>Nuevo registro en Ecommerce!</h4>
                      <p> Datos:</p>
                      <ul>
                      <li> Nombre y apellido: ${user.name} ${user.lastname}</li>
                      <li> Email: ${user.email}</li>
                      <li> Teléfono: ${user.phone}</li>
                      <li> Edad: ${user.age}</li>
                      <li> Direccion: ${user.adress}</li>
                      </ul>
          `;
      await EMAIL_UTILS.sendEmail(mailTo, subject, html);
  
      return new UserDTO(saveUser);

    } catch (error) {
      res.render("err.hbs");
      Loggers.logError(`error from signUp`);
    }
  };

  export const userService = {
    registerUser
}