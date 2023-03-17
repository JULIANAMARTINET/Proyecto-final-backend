import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDATION } from "../utils/index.js";
import { daoFactory } from "../models/Dao/index.js";
import { Loggers } from "../loggers/loggers.js";

const userDao = daoFactory.getSelectedDao("users");

const init = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userDao.getById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          if (!email || !password) return done(null, false);

          const user = await userDao.getOne(email);

          if (!user) {
            Loggers.logWarn(`user not valid user`);
            return done(null, false);
          }

          if (BCRYPT_VALIDATION.isValidPassword(password, user) != true) {
            Loggers.logWarn(`Password not valid pass`);
            return done(null, false);
          }

          const userResponse = {
            id: user._id,
            email: user.email,
            cart: user.cart,
          };

          done(null, userResponse);
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};

export const PassportAuth = {
  init,
};
