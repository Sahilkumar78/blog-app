import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // origin:"http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))






export {app}