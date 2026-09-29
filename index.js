import express from "express"
import cors from "cors"
import { connectDB } from "./db.js";
import userRoute from './src/routes/user.route.js'
import "dotenv/config.js";


const port = process.env.PORT || 3000;
const app = express()
connectDB();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(import.meta.dirname + '/views/index.html')
});

app.use('/api/users',userRoute)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});


app.listen(port, "0.0.0.0", function () {
  console.log(`Listening on port ${port}`);
});
