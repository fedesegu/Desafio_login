import { Router } from "express";
import { cartsManager } from "../DAO/managerDB/cartsManagerDB.js";

const router = Router();

router.get("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  const cart = await cartsManager.findById(idCart);
  res.json({cart});
});

router.get("/", async (req, res) => {
  const cart = await cartsManager.findAll();
  res.json({cart});
});

router.post("/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  const cart = cartsManager.addProductToCart(idCart, idProduct);
  res.json({cart});
});

router.post("/", async (req, res) => {
  const cart = await cartsManager.createOne();
  res.json({cart});
});

router.delete("/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;

  try {
    const result = await cartsManager.deleteOne(idCart, idProduct);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idCart", async (req, res) => {
  try {
    const { idCart } = req.params;
    const response = await cartsManager.deleteAll(idCart);
    res.status(200).json({ message: "Cart delete", cart: response });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error });
  }
});

router.put("/:idCart", async (req, res) => {
  const { idProduct, quantity } = req.body;
  const { idCart } = req.params;
  try {
    const response = await cartsManager.updateOne(idCart, idProduct, quantity);
    console.log(response);
    res.status(200).json({ message: "Cart update", cart: response });
  } catch (error) {
    res.status(500).json({ message: "Error"});
  }
});
export default router;