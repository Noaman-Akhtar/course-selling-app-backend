//const express = require("express");
//const Router = express.Router;
//or
const {Router}= require("express");
const {userModel,purchaseModel,courseModel} = require ("../db");

const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");
const {userMiddleware} = require("../middleware/user");

const userRouter= Router();

userRouter.post("/signup",async(req,res)=>{
const {email,password,firstname,lastname}= req.body;
await userModel.create({
    email:email,
    password:password,
    firstname:firstname,
    lastname:lastname
})
    res.json({
        message:"user has signed up"
    })
})
userRouter.post("/signin",async (req,res)=>{
    const {email,password} = req.body;
    const user = await user.findOne({
        email:email,
        password:password
    });
    if(user){
        const token= jwt.sign({
            id:user._id,
        },JWT_USER_PASSWORD
        );
        res.json({
            token:token
        })
    } else {
        res.status(403).json({
            message:"Incorrect credentials "
        })
    }
   
});
userRouter.get("/purchases",userMiddleware,async(req,res)=>{
const userId = req.userId;
const purchases = await purchasesModel.find({
    userId
});
let purchasedCourseIds = [];
for(let i=0;i<purchases.length;i++){
    purchasedCourseIds.push(purchases[i].courseId)
}

const courseData = await courseModel.find({
    _id:{$in: purchasedCourseIds}
})
    res.json({
   purchases,
   courseData
})
})

module.exports={
    userRouter:userRouter
}