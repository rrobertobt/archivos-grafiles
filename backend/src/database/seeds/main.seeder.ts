// 0. Conexión a la base de datos
import { MongoClient } from "mongodb";
import { hashSync } from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
);

export async function mainSeeder() {
  await client.connect();
  const db = client.db("testdb");

  // 1. Comprobar si la colección de usuarios está vacía
  const users = db.collection("users");
  const usersCount = await users.countDocuments();
  if (usersCount > 0) {
    console.warn(
      "La colección de usuarios no está vacía. No se insertarán datos.",
    );
    await client.close();
    return;
  } else {
    console.warn("La colección de usuarios está vacía. Se insertarán datos.");
  }

  // 2. Insertar Usuarios
  const usersCollection = db.collection("users");
  const resultUser = await usersCollection.insertOne({
    username: "empleado1",
    name: "Jose Bautista",
    password: hashSync("empleado1password", 10),
    role: "employee",
    created_at: new Date(),
    root_directory: null,
    shared_directory: null,
  });
  console.log("Usuario creado con ID:", resultUser.insertedId);

  const resultUser2 = await usersCollection.insertOne({
    username: "empleado2",
    name: "Roberto Rojas",
    password: hashSync("empleado2password", 10),
    role: "employee",
    created_at: new Date(),
    root_directory: null,
    shared_directory: null,
  });
  console.log("Usuario creado con ID:", resultUser2.insertedId);

  const resultAdmin = await usersCollection.insertOne({
    username: "admin",
    name: "Administrador",
    password: hashSync("adminpassword", 10),
    role: "admin",
    created_at: new Date(),
    root_directory: null,
    shared_directory: null,
  });
  console.log("Usuario creado con ID:", resultAdmin.insertedId);

  // 3. Crear el Directorio Raíz del Usuario
  const directoriesCollection = db.collection("archives");
  const rootDir = await directoriesCollection.insertOne({
    name: "Raiz",
    type: "directory",
    parent_directory: null,
    path: "/root",
    owner: resultUser.insertedId,
    created_at: new Date(),
    shared: false,
    in_trash: false,
    subarchives: [],
    shared_by: null,
  });
  console.log("Directorio raíz creado con ID:", rootDir.insertedId);

  const sharedDir = await directoriesCollection.insertOne({
    name: "Compartido",
    type: "directory",
    parent_directory: null,
    path: "/shared",
    owner: resultUser.insertedId,
    created_at: new Date(),
    shared: true,
    in_trash: false,
    subarchives: [],
    shared_by: null,
  });
  console.log("Directorio compartido creado con ID:", sharedDir.insertedId);

  const rootDir2 = await directoriesCollection.insertOne({
    name: "Raíz",
    type: "directory",
    parent_directory: null,
    path: "/root",
    owner: resultUser2.insertedId,
    created_at: new Date(),
    shared: false,
    in_trash: false,
    subarchives: [],
    shared_by: null,
  });
  console.log("Directorio raíz creado con ID:", rootDir2.insertedId);

  const sharedDir2 = await directoriesCollection.insertOne({
    name: "Compartido",
    type: "directory",
    parent_directory: null,
    path: "/shared",
    owner: resultUser2.insertedId,
    created_at: new Date(),
    shared: true,
    in_trash: false,
    subarchives: [],
    shared_by: null,
  });
  console.log("Directorio compartido creado con ID:", sharedDir2.insertedId);

  const rootDirAdmin = await directoriesCollection.insertOne({
    name: "Raíz",
    type: "directory",
    parent_directory: null,
    path: "/root",
    owner: resultAdmin.insertedId,
    created_at: new Date(),
    shared: false,
    in_trash: false,
    subarchives: [],
    shared_by: null,
  });
  console.log("Directorio raíz creado con ID:", rootDirAdmin.insertedId);

  const sharedDirAdmin = await directoriesCollection.insertOne({
    name: "Compartido",
    type: "directory",
    parent_directory: null,
    path: "/shared",
    owner: resultAdmin.insertedId,
    created_at: new Date(),
    shared: true,
    in_trash: false,
    subarchives: [],
    shared_by: null,
  });
  console.log(
    "Directorio compartido creado con ID:",
    sharedDirAdmin.insertedId,
  );

  // 4. Actualizar el campo root_directory del usuario
  await usersCollection.updateOne(
    { _id: resultUser.insertedId },
    { $set: { root_directory: rootDir.insertedId } },
  );
  console.log("Directorio raíz asignado al usuario.");

  await usersCollection.updateOne(
    { _id: resultUser.insertedId },
    { $set: { shared_directory: sharedDir.insertedId } },
  );
  console.log("Directorio compartido asignado al usuario.");

  await usersCollection.updateOne(
    { _id: resultUser2.insertedId },
    { $set: { root_directory: rootDir2.insertedId } },
  );
  console.log("Directorio raíz asignado al usuario.");

  await usersCollection.updateOne(
    { _id: resultUser2.insertedId },
    { $set: { shared_directory: sharedDir2.insertedId } },
  );
  console.log("Directorio compartido asignado al usuario.");

  await usersCollection.updateOne(
    { _id: resultAdmin.insertedId },
    { $set: { root_directory: rootDirAdmin.insertedId } },
  );
  console.log("Directorio raíz asignado al usuario admin.");

  await usersCollection.updateOne(
    { _id: resultAdmin.insertedId },
    { $set: { shared_directory: sharedDirAdmin.insertedId } },
  );
  console.log("Directorio compartido asignado al usuario admin.");

  await client.close();
}
