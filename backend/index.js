import dotenv from "dotenv"


import { app } from "./app.js";
import {connectDB} from "./db/index.js"

dotenv.config({
    path: './.env',
    quiet: true,
})


app.get("/" , (req, res) => {
     res.send("<h1> Your blog app database is ready now.</h1>")
})

connectDB()
.then(() => {

       
      app.listen(process.env.PORT || 8000, () => {
          console.log(`Server is running at port: ${process.env.PORT}`);
      })
     
})
.catch(err => {
    console.log("MongoDb connection failed !! ", err);
})