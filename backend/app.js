import express, { urlencoded } from "express"

const app = express();


// it will let your req.body stuff in your backend from frontend
app.use(express.json());
app.use(express.urlencoded({extended: true}));




export {app};