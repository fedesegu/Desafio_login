import  express  from 'express';
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import chatsRouter from './routes/chat.router.js'
import sessionRouter from './routes/session.router.js'
import viewsRouter from "./routes/views.router.js";
import cookieRouter from './routes/views.router.js'
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { productsManager } from './dao/mongoDB/productsManagerDB.js'
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import { messagesManager } from "./dao/mongoDB/messageManagerDB.js";
import "./DB/configDB.js";
import "./passport.js";
import passport from "passport";
import fileStore from "session-file-store";
const FileStore = fileStore(session);


const app = express();
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"));
app.use('/public', express.static('public'));
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/views', viewsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/session", sessionRouter);
app.use('/api/chat', chatsRouter);

const httpServer = app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("newUser", (user) => {
        socket.broadcast.emit("userConnected", user);
        socket.emit("connected");
    });

    socket.on("message", async (infoMessage) => {
        await messagesManager.createOne(infoMessage);
        const allMessages = await messagesManager.findAll();
        socketServer.emit("chat", allMessages);
    });

    try {
        const productosActualizados = await productsManager.findAll(objeto);
        console.log(productosActualizados);
        socketServer.emit('productosActualizados', productosActualizados);

        socket.on('agregado', async (nuevoProducto) => {
            try {
                const products = await productsManager.createOne(nuevoProducto);
                const productosActualizados = await productsManager.findAll();
                socketServer.emit('productosActualizados', productosActualizados);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });

        socket.on('eliminar', async (id) => {
            try {
                const products = await productsManager.deleteOne(id);
                const productosActualizados = await productsManager.findAll();
                socketServer.emit('productosActualizados', productosActualizados);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        })
    } catch (error) {
        console.error("Conexion error");
    }

    socket.on('disconnect', () => {
        console.log('A client has been disconnect.');
    });
});