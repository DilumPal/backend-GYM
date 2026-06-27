import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import jwt from "jsonwebtoken";
import orderRouter from "./routes/orderRoute.js";
import reviewrouter from "./routes/reviewRoutes.js";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// 1. FIXED CORS CONFIGURATION FOR CREDENTIALS
app.use(cors({
    origin: 'https://frontend-gym-phi.vercel.app', // Allow your React Vite frontend origin
    credentials: true,                // Allow authorization headers/cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// 2. CLEANED UP JWT AUTHENTICATION MIDDLEWARE
app.use((req, res, next) => {
    const tokenString = req.header("Authorization");

    if (tokenString != null) {
        const token = tokenString.replace("Bearer ", "");
        console.log(token);

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (decoded != null) {
                req.user = decoded;
                next(); // Token valid, proceed
            } else {
                console.log("Invalid token");
                return res.status(401).json({ // Added 'return' to halt execution here
                    message: "Invalid token"
                });
            }
        });
    } else {
        next(); // No token provided, proceed anonymously
    }
});

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to database");
    }).catch((err) => {
        console.log("Database connection failed");
        console.log(err);
    });

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewrouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

export default app;