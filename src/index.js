import express from "express";
import { config } from "./config/index.js";
import router from "./routers/index.js";
import cors from "cors";
import methodOverride from "method-override";
import { PassportAuth } from "./middlewares/index.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import { Server as HttpServer } from 'http'
import {Server as IOServer} from 'socket.io'
import { startSockets } from './sockets/index.js'
import { MongoDBService } from "./services/index.js";

export const app = express()

MongoDBService.init();

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

// socket
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
startSockets(io)

app.use(cors({ credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(router);;

const server = httpServer.listen(config.SERVER.PORT, () =>
  console.log(`Server running on port ${server.address().port}`)
);
