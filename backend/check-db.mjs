import mongoose from './node_modules/mongoose/index.js';
const uri = "mongodb+srv://mentorlive555_db_user:OcTVz6tvS9wGU3SQ@cluster0.kint7hz.mongodb.net/mentor-live";
await mongoose.connect(uri);
const db = mongoose.connection.db;
const faculties = await db.collection("faculties").find({}).project({ name: 1, price: 1 }).limit(2).toArray();
console.log(JSON.stringify(faculties, null, 2));
await mongoose.disconnect();
