import { Router } from "express";
import { messagesManager } from "../DAO/managerDB/messageManager.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const message = await messagesManager.findAll();
    res.status(200).json({ message: "Message", message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const createdMessage = await messagesManager.createOne(req.body);
    res.status(200).json({ message: "Message created", createdMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    await messagesManager.deleteAll();
    res.status(200).json({ message: "Messages deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;