const { MongoClient } = require("mongodb");

// URI: reemplaza con tu conexión local o de Atlas
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db("ejemploDB");
    const collection = db.collection("usuarios");

    // CREATE
    await collection.insertOne({ nombre: "Juan", edad: 25, ciudad: "Coquimbo" });
    console.log("Usuario insertado");

    // READ, leer los usuarios
    const usuarios = await collection.find().toArray();
    console.log("Usuarios:", usuarios);

    // UPDATE
    await collection.updateOne(
      { nombre: "Juan" },
      { $set: { edad: 25 } }
    );
    console.log("Usuario actualizado");

    // DELETE
    await collection.deleteOne({ nombre: "Juan" });
    console.log("Usuario eliminado");

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
