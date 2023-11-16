import { Router } from "express";
import { manager } from "../DAO/managerFS/productsManager.js";
import { productsManager } from "../DAO/managerDB/productsManagerDB.js";
import { usersManager } from "../DAO/managerDB/usersManagerDB.js";
import { cartsManager } from "../DAO/managerDB/cartsManagerDB.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts({});
    res.render("home", { response: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    throw new Error(error.message);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await productsManager.findAll(req.query);
    console.log("products", products);
    res.render("products", { response: products, style: "product" });
  } catch (error) {
    throw new Error(error.message);
  }
});
router.get("/homeuser/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const user = await usersManager.findById(idUser);
  const { first_name, last_name } = user;
  res.render("homeuser", { first_name, last_name });
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/chat/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const user = await usersManager.findById(idUser);
    const { first_name, last_name } = user;
    res.render("chat", { first_name, last_name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/carts/:idCart", async (req, res) => {
  const { idCart } = req.params;
  try {
    const cart = await cartsManager.findById(idCart);
    if (!cart) {
      return res.status(404).send("Cart not founded");
    }
    const cartProducts = cart.products.map((doc) => doc.toObject());

    console.log(cartProducts);
    res.render("cart", { response: cartProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});
router.get("/cart/", async (req, res) => {
  try {
    const cart = await cartsManager.findAll();
    console.log("cart", cart);
    res.render("cart", { response: cart });
  } catch (error) {
    throw new Error(error.message);
  }
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/views/products")
    }
  res.render("login")
});


router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/views/products")
  }
  res.render("sign up")
});

export default router;