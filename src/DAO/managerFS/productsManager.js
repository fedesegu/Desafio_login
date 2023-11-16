import { existsSync, promises } from "fs";
const path = "products.json";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts(queryObj) {
    const { limit } = queryObj;
    try {
      if (existsSync(path)) {
        const productsFile = await promises.readFile(this.path, "utf8");
        const productData = JSON.parse(productsFile);
        return limit ? productData.splice(0, +limit) : productData;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProduct(newProduct) {
    try {
      const { title, description, price, thumbnail, stock, code } = newProduct;
      if (!title || !description || !price || !thumbnail || !stock || !code) {
        return console.log(
          "Faltan datos obligatorios para agregar un producto."
        );
      }
      const products = await this.getProducts({});
      const isCodeRepeat = products.some((product) => product.code === code);
      if (isCodeRepeat) {
        return console.log("El código esta repetido");
      }
      let id;
      if (!products.length) {
        id = 1;
      } else {
        id = products[products.length - 1].id + 1;
      }
      const product = {
        id,
        ...newProduct,
      };

      products.push({ id, ...product });
      await promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts({});
      const product = products.find((u) => u.id === id);
      if (!product) {
        return "no existe producto";
      } else {
        return product;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts({});
      const product = products.find((u) => u.id === id);
      if (product) {
        const newArrayProduct = products.filter((u) => u.id !== id);
        await promises.writeFile(this.path, JSON.stringify(newArrayProduct));
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts({});
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        return null;
      }
      const updatedProduct = { ...products[index], ...updatedFields };
      products.splice(index, 1, updatedProduct);
      await promises.writeFile(this.path, JSON.stringify(products));
      return updatedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const manager = new ProductManager("products.json");