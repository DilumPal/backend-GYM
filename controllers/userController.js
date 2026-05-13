import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

export function createUser(req, res) {

    if(req.body.role == "admin"){
        if(req.user != null){
            if(req.user != "admin"){
                res.status(403).json({
                    message: "You need to be an admin to create an admin"
                })
                return;
            }
        }else{
            res.status(403).json({
                message: "You are not authorized to create an admin, Pleae login first"
            })
            return;
        }
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    })

    user.save().then(() => {
        res.json({
            message: "User data saved successfully"
        })
    }).catch(() => {
        res.json({
            message: "Failed to save user data"
        })
    })
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(
        (user) => {
            if (user == null) {
                res.status(404).json({
                    message: "User not found"
                })
            }
            else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id,
                        role: user.role,
                        img: user.img
                    },
                        process.env.JWT_KEY,
                    )
                    res.json({
                        message: "Login successful",
                        token: token,
                        role: user.role
                    })
                } else {
                    res.status(401).json({
                        message: "Incorrect password"
                    })
                }
            }
        })
}

export async function loginWithGoogle(req, res){
    const token = req.body.accessToken;
    if(token == null){
        res.status(400).json({
            message: "Access token is required"
        });
        return;
    }
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response.data)
}

export function isAdmin(req){
    if (req.user == null) {
            return false;
        }
    
        if(req.user.role != "admin"){
            return false;
        }
        return true;
}
