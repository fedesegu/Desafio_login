import mongoose from "mongoose";

const URI =
 "mongodb+srv://federicosegu:Abeyp231@cluster0.gjwkb4d.mongodb.net/Desafio_login?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error));