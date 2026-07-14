const express = require("express");
const user = require('../models/user.js');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function signup(req,res){
    console.log(req.body);
        const { email, password, name } = req.body;
        //here i need to hash the password first 
        const duplicate_email =await user.findOne({ email: email })
        console.log("duplicate_email:", duplicate_email);
        if (duplicate_email) {
            return res.status(409).json("User Already registered"
            );
        }
        const hashed_password = await bcrypt.hash(password, 8);//passwrod hashed
        const data = new user({
            name,
            email,
            password: hashed_password,
        })
        await data.save();
        res.json({ success: true });
}

async function login(req,res){
    const { email, Password } = req.body;
        const FindUser = await user.findOne({ email });
        if (!FindUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    
        console.log(req.body);
        console.log("Password from frontend:", Password);
        console.log("Password from DB:", FindUser.password);
        const isUserMatched = await bcrypt.compare(Password, FindUser.password);
        if (!isUserMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ userId: FindUser._id }, process.env.Key, { expiresIn: '10m' });
        console.log(FindUser);
        res.json({ success: true, token });
}
module.exports={
    signup,login
};