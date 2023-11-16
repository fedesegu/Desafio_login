import {cartsModel} from "../../db/models/carts.model.js";

class CartsManager {
  async findAll() {
    const result = await cartsModel.find();
    return result;
  }
  async findById(idCart) {
    const result = await cartsModel.findById(idCart).populate("products.product");
    return result;
  }
  async createOne() {
    const newCart = { products: [] };
    const result = await cartsModel.create(newCart);
    return result;
  }

  async addProductToCart(idCart, idProduct) {
    const cart = await cartsModel.findById(idCart);
    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(idProduct)
    );
    if (productIndex === -1) {
      cart.products.push({ product: idProduct, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await cart.save();
  }

  async deleteAll(idCart) {
    const selectedCart = await cartsModel.findById(idCart);
    if (selectedCart) {
      selectedCart.products = [];
    } else {
      res.status(200).json({ message: "Cart not found" });
    }
    return selectedCart.save();
  }

  async deleteOne(idCart, idProduct) {
    const findCart = await cartsModel.findById(idCart);

    if (findCart) {
      const productIndex = findCart.products.findIndex((p) =>
        p.product.equals(idProduct)
      );
      if (productIndex !== -1) {
        if (findCart.products[productIndex].quantity > 1) {
          findCart.products[productIndex].quantity -= 1;
        } else {
          findCart.products.splice(productIndex, 1);
        }
        return findCart.save();
      }
    }
  }

  async updateOne(idCart, idProduct, quantity) {
    const selectedCart = await cartsModel.findById(idCart);
    if (selectedCart) {
      const productIndex = selectedCart.products.findIndex((p) =>
        p.product.equals(idProduct)
      );
      console.log(productIndex);
      if (productIndex !== -1) {
        selectedCart.products[productIndex].quantity = quantity;
      } else {
        selectedCart.products.push({ product: idProduct, quantity: quantity });
      }
      return selectedCart.save();
    }
  }
}

export const cartsManager = new CartsManager();