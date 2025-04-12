import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { config } from "dotenv"
import cookieParser from "cookie-parser"

//utilities
import authRoutes from "./routes/authRoutes.js"
import mainRoutes from "./routes/mainRoutes.js"

const app = express();

config(); // is used to load environment variables from a .env file into process.env in your Node.js application

app.use(
    cors({ // allow users to hit backend with the given origins
      origin: "http://localhost:5173", // Frontend URL
      credentials: true, // Allow cookies
    })
);
app.use(express.json()) // is a middleware that parses incoming requests with JSON payloads.
app.use(cookieParser()) // is a middleware that parses the cookies attached to the request and makes them accessible in req.cookies

//Middleware
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

//Routes 
app.use("/api/auth", authRoutes);
app.use("/api/main", mainRoutes);

const PORT = process.env.PORT || 5000; //some productions changes the PORT so if the PORT is not found run on 5000 port
app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`))