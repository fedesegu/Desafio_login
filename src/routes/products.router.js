import { Router } from "express";
import { productsManager } from "../DAO/managerDB/productsManagerDB.js";
const router = Router();

router.get("/agg", async (req, res) => {
  try {
    const product = await productsManager.findAggre();
    res.status(200).json({ message: "Product", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const product = await productsManager.findAll(req.query);
    res.status(200).json({ message: "Product", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    const product = await productsManager.findById(idProduct);
    res.status(200).json({ message: "Product", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, price, description, category, code } = req.body;
  if (!name || !price || !description || !category || !code) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  try {
    const createdProduct = await productsManager.createOne(req.body);
    res
      .status(200)
      .json({ message: "Product Created", product: createdProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    await productsManager.deleteOne(idProduct);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    const productUpdated = await productsManager.updateOne(
      idProduct,
      req.body
    );
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;