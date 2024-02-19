import {Router} from 'express'
import { __dirname } from "../utils.js"
import { productsManager } from '../dao/mongoDB/productsManagerDB.js'

const router = Router();

router.get("/", async (req, res) => {
    
    try {
        const products = await productsManager.findAll(req.query); 
        res.status(200).json({ message: "Product found", products });   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsManager.findById(pid);
        if (!product) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product found", product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
""
router.post("/", async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !description || !price || !code || !stock || ! category) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const response = await productsManager.createOne(req.body);
        res.status(200).json({ message: "Product created", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productsManager.deleteOne(pid);
        if (!response) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product deleted" });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    });
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productsManager.updateOne(pid, req.body);
        if (!response) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product updated", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/change", async (req, res) => {
    const accion = req.body.accion;
    const id = req.body.id;

    try {
        if (accion === "AGREGAR") {
            const productNew = productsManager.createOne(req.body);
        } 
        else {
            productsManager.deleteOne(+id);
        }
        res.status(200).send("Succesfull operation");

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server internal error");
    }
});


export default router