import mongoose from "mongoose";
import "dotenv/config.js";

export async function connectDB(){
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log("Connected to MongoDB")
}