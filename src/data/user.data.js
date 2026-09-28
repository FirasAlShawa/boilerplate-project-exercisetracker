import mongoose, { Mongoose } from "mongoose";

const User = mongoose.model("User", new mongoose.Schema({
    username: String
}))

export default User;