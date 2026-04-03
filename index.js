import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());
app.use(
    (req, res, next) => {
        const tokenString = req.header("Authorization");
        if (tokenString != null) {
            const token = tokenString.replace("Bearer ", "");
            console.log(token);

            jwt.verify(token, "secretkey",
                (err, decoded) => {
                    if(decoded != null){
                        req.user = decoded;
                        next();
                    }else{
                        console.log("Invalid token");
                        res.status(401).json({
                            message : "Invalid token"
                        })
                    }
                })
        }else{
            next();
        }
        //next();
    })

mongoose.connect("mongodb+srv://admin:123@cluster0.oigmmnt.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log("Connected to database");
    }).catch(() => {
        console.log("Database connection failed");
    })

app.use("/products", productRouter)
app.use("/users", userRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});