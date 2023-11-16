import express from "express";
import cookieParser from "cookie-parser";
import { __dirname } from "./utils.js";
import handlebars from 'express-handlebars';
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import cookieRouter from "./routes/cookie.router.js";
import sessionsRouter from "./routes/session.router.js";
import session from "express-session";
import fileStore from "session-file-store";
import MongoStore from "connect-mongo";
import "./passport.js";
import passport from "passport";
import "./db/configDB.js"

const FileStore = fileStore(session);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"));

const URI = "mongodb+srv://federicosegu:Abeyp231@cluster0.gjwkb4d.mongodb.net/Desafio_login?retryWrites=true&w=majority";
 app.use(
    session({
      store: new MongoStore({
        mongoUrl: URI,
      }),
      secret: "secretSession",
      cookie: { maxAge: 60000 },
    })
  );


app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter );
app.use("/api/sessions", sessionsRouter)


app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
  });