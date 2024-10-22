// 0. Conexión a la base de datos
import { MongoClient } from 'mongodb';
import { hashSync } from 'bcrypt';
const uri = 'mongodb://localhost:27017'; // URL de conexión a MongoDB
const client = new MongoClient(uri, {
  auth: {
    password: 'example',
    username: 'root',
  },
});

export async function mainSeeder() {
  await client.connect();
  const db = client.db('testdb');

  // 1. Comprobar si la colección de usuarios está vacía
  const users = db.collection('users');
  const usersCount = await users.countDocuments();
  if (usersCount > 0) {
    console.warn(
      'La colección de usuarios no está vacía. No se insertarán datos.',
    );
    await client.close();
    return;
  } else {
    console.warn('La colección de usuarios está vacía. Se insertarán datos.');
  }

  // 2. Insertar Usuarios
  const usersCollection = db.collection('users');
  const resultUser = await usersCollection.insertOne({
    username: 'empleado1',
    name: 'Empleado 1',
    password: hashSync('empleado1password', 10),
    role: 'employee',
    created_at: new Date(),
    root_directory: null, // Se actualizará después de crear el directorio
    shared_directory: null,
  });
  console.log('Usuario creado con ID:', resultUser.insertedId);

  const resultAdmin = await usersCollection.insertOne({
    username: 'admin',
    name: 'Administrador',
    password: hashSync('adminpassword', 10),
    role: 'admin',
    created_at: new Date(),
    root_directory: null, // Se actualizará después de crear el directorio
    shared_directory: null,
  });
  console.log('Usuario creado con ID:', resultAdmin.insertedId);

  // 3. Crear el Directorio Raíz del Usuario
  const directoriesCollection = db.collection('directories');
  const rootDir = await directoriesCollection.insertOne({
    name: 'Raíz',
    owner: resultUser.insertedId,
    parent_directory: null, // Directorio raíz no tiene padre
    created_at: new Date(),
    is_shared: false,
    files: [],
    subdirectories: [],
  });
  console.log('Directorio raíz creado con ID:', rootDir.insertedId);

  const rootDirAdmin = await directoriesCollection.insertOne({
    name: 'Raíz',
    owner: resultAdmin.insertedId,
    parent_directory: null, // Directorio raíz no tiene padre
    created_at: new Date(),
    is_shared: false,
    files: [],
    subdirectories: [],
  });
  console.log('Directorio raíz creado con ID:', rootDirAdmin.insertedId);

  // 4. Actualizar el campo root_directory del usuario
  await usersCollection.updateOne(
    { _id: resultUser.insertedId },
    { $set: { root_directory: rootDir.insertedId } },
  );
  console.log('Directorio raíz asignado al usuario.');

  await usersCollection.updateOne(
    { _id: resultAdmin.insertedId },
    { $set: { root_directory: rootDirAdmin.insertedId } },
  );
  console.log('Directorio raíz asignado al usuario admin.');

  await client.close();
}
