import mongoose from "mongoose";

const Exercise = mongoose.model("Exercise",new mongoose.Schema({
    description:String,
    duration:Number,
    date:String,
    userId: {type : mongoose.Schema.Types.ObjectId , ref:"User"}
}))


export default Exercise;