import { Router } from "express";
import passport from "passport";
import { UserDao, CartDao } from "../../Dao/index.js";
import logger from "../../loggers/loggers.js";
import { JWT_UTILS, DATE_UTILS , EMAIL_UTILS, BCRYPT_VALIDATION  } from "../../utils/index.js";
import { isValidAuthToken} from "../../middlewares/index.js";

const router = Router();

router.get('/inicio',isValidAuthToken, (req, res) => {
  const email = req.user.email
  res.render('inicio', {email})
})

// LOGIN

router.get('/login',(req, res) => {
  res.render('login')
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/auth/login-error" }), async (req, res) => {
  const { user } = req;
  const email = user.email
  const token = JWT_UTILS.createToken(user, "secret");
  res.cookie("tokenCookie", token, { maxAge: 1000 * 60 * 60 });

  res.render('inicio', { email })
});

router.get('/login-error', (req, res) => {
  logger.error('Credenciales incorrectas')
  res.render('err-login.hbs')
})

// SIGNUP

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post("/signup", async (req, res) => {
  try {
    const { name, lastname, age, phone, adress, email, password } = req.body;
    if (!name || !lastname || !age || !phone ||  !adress || !email || !password ){
      return res.send({ success: false });}

    const existUser = await UserDao.getOne({ email });

    if (existUser && existUser.password) {
      return res.redirect("/api/auth/signup-error"); 
    }

    if (existUser && !existUser.password) {
      const updateUser = await UserDao.updateById(existUser._id, {
        ...existUser,
        password,
      });

      return res.redirect('login')
    }


    const UserCart = { timestamp: DATE_UTILS.getTimestamp(), products: [] };
    const cart = await CartDao.save(UserCart);

    await UserDao.save({ name, lastname, age, phone, adress, email, password: BCRYPT_VALIDATION.hashPassword(password), cart: cart.id });
    
    let subject = 'Nuevo usuario'
    let mailTo = 'martinetjuliana@gmail.com'
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
    `
    await EMAIL_UTILS.sendEmail(mailTo, subject, html)
   
  
    return res.redirect('login')
 
  } catch (error) {
    console.log("error")
    res.send({ success: false });
  }
});

router.get('/signup-error', (req, res) => {
  res.render('err-signup.hbs')
})

// GITHUB
router.get("/github-login", passport.authenticate("github"));

router.get("/github", passport.authenticate("github"), (req, res) => {
  const { user } = req;

  const token = JWT_UTILS.createToken(user, "secret");

  res.cookie("tokenCookie", token, { maxAge: 1000 * 60 * 60 });

  // res.send({ user, token });
  res.redirect("/");
});


// LOGOUT

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("tokenCookie");
  res.render('logout' );
});


export { router as AuthRouter };
