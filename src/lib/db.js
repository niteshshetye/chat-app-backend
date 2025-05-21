import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // mongo url = > mongodb://<username>:<password>@localhost:<port>/<databasename>?authSource=admin
    const URL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST_NAME}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`;

    await mongoose.connect(URL);
    console.log("Database connected...!");
  } catch (error) {
    console.error("Failed to connect Db");
  }
};
