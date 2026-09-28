import express from "express"
import cors from "cors"
import User from "./src/data/user.data.js";
import { connectDB } from "./db.js";
import userRoute from './src/routes/user.route.js'
import "dotenv/config.js";


const port = process.env.PORT || 3000;
const app = express()
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "https://www.freecodecamp.org" }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(import.meta.dirname + '/views/index.html')
});

// app.post("/api/users",

app.use('/api/users',userRoute)


app.listen(port, "0.0.0.0", function () {
  console.log(`Listening on port ${port}`);
});
