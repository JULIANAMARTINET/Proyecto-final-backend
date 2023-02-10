import express from "express";
import { config } from "./config/index.js";
import {
  ProductRouter,
  CartRouter,
  AuthRouter,
} from "./routers/index.js";
import cors from "cors";
import methodOverride from "method-override";
import { PassportAuth } from "./middlewares/index.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";

const app = express();

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

PassportAuth.init();

app.use(cookieParser());

app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// esto es para poder habilitar cors para un cliente externo, ejemplo cuando levantamos la app de react
// bien podriamos convertirlo a un middleware en su archivo correspondiente y tener las propiedades que deseemos
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('home')
})

app.get("/add", (req, res) => {
  res.render("add-products")})

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);

const server = app.listen(config.SERVER.PORT, () =>
  console.log(`Server running on port ${server.address().port}`)
);
