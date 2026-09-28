import express from "express"
import cors from "cors"
import User from "./src/data/user.data.js";
import { connectDB } from "./db.js";
import userRoute from './src/routes/user.route.js'

const app = express()
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(import.meta.dirname + '/views/index.html')
});

// app.post("/api/users",

app.use('/api/users',userRoute)


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
