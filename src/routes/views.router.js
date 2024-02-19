import { Router } from "express";
import { productsManager } from '../dao/mongoDB/productsManagerDB.js'
import { cartsManager } from '../dao/mongoDB/cartsManagerDB.js'

const router = Router();

router.get("/home", async (req, res) => {

    if (!req.session.passport) {
        return res.redirect("/api/views/login");
    }
    try {
        const products = await productsManager.findAll(req.query);
        const productsFinal = products.info.results;
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const paginate = products.info.pages;
        const sort = req.query.orders;
        const cart = await cartsManager.createOne()

        console.log(req.user.name);
        res.render("home",  { user: req.user, name: req.user.name, email : req.user.email, cart: cart._Id, products: result, paginate: paginate, sort: sort, style:"product"} );
    } catch (error) {
        console.error(error);
        res.status(500).send("Server internal error");
    }
});

router.get("/login", (req, res) => {
        if (req.session.user) {
            return res.redirect("/home", {style:"product"});}
    res.render("login", {style:"product"});
});

router.get("/signup", (req, res) => {
    if (req.session.user) {
        return res.redirect("/login", {style:"product"});
    }
    res.render("signup", {style:"product"})
});

router.get("/restaurar", (req, res) => {
    res.render("restaurar", {style:"product"});
});

router.get("/error", (req, res) => {
    res.render("error", {style:"product"});
});


router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    
    try {
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        const cartProducts = cart.products.map(doc => doc.toObject());

        
        console.log(cartProducts);
        res.render('carts', { products:cartProducts, style:"product" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server internal error');
    }
});


router.get("/changeproducts", async (req, res) => {
    try {
    res.render("changeproducts");
    } catch {
        error
    }
});



router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await Manager.findAll({});
        res.render("realTimeProducts", { products:products, style: "product"});
    } catch {
        error
    }
});
router.get("/chat", async (req, res) => {
    try {
    res.render("chats");
    } catch {
        error
    }
});

export default router;