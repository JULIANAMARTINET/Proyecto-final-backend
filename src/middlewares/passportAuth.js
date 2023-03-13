import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { BCRYPT_VALIDATION, } from "../utils/index.js";
import { daoFactory } from "../models/Dao/index.js";
import {Loggers} from "../loggers/loggers.js"

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

          const user = await userDao.getOne( email );
    
          if (!user) {
            Loggers.logWarn(`user not valid user`);
            return done(null, false)
        }

        if (BCRYPT_VALIDATION.isValidPassword(password, user) != true) {
          Loggers.logWarn(`Password not valid pass`);
          return done(null, false)
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

  // passport.use(
  //   "github",
  //   new GithubStrategy(
  //     {
  //       // deben poner el clientID y clientSecret generado por github
  //       // Pueden verlo en la grabacion
  //       clientID: "",
  //       clientSecret: "",
  //       callbackURL: "http://localhost:8080/api/auth/github",
  //       scope: ["user:email"],
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         const githubEmail = profile.emails?.[0].value;

  //         if (!githubEmail) return done(null, false);

  //         const user = await UserDao.getOne({ email: githubEmail });

  //         if (user) {
  //           const userResponse = {
  //             id: user._id,
  //             email: user.email,
  //             cart: user.cart,
  //           };

  //           return done(null, userResponse);
  //         }

  //         const newUser = {
  //           email: githubEmail,
  //           name: profile._json.name,
  //           lastname: "-",
  //           // no guardar contraseña
  //         };

  //         const createdUser = await UserDao.save(newUser);

  //         const userResponse = {
  //           id: createdUser._id,
  //           email: createdUser.email,
  //           cart: createdUser.cart,
  //         };

  //         done(null, userResponse);
  //       } catch (error) {
  //         console.log(error);
  //         done(error);
  //       }
  //     }
  //   )
  // );
};

export const PassportAuth = {
  init,
};
