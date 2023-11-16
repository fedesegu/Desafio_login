import { messagesModel } from "../../db/models/message.model.js";

class MessagesManager {
  async createOne(obj) {
    console.log("Object created", obj);
    const response = await messagesModel.create(obj);
    return response;
  }
  async findAll() {
    const response = await messagesModel.find();
    return response;
  }

  async deleteAll() {
    const response = await messagesModel.deleteMany({});
    return response;
  }
}

export const messagesManager = new MessagesManager();