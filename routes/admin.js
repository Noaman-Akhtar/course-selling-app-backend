const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");

const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    await adminModel.create({
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname
    });
    res.json({
        message: "user has signed up"
    })
})
adminRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email,
        password: password
    });
    if (admin) {
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);
        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrent credentials"
        })
    }

})
adminRouter.post("/course",adminMiddleware,async (req, res) => {
    const adminId = req.userId;
    const {title,description,imageUrl,price} = req.body;

    const course= await courseModel.create({
        title:title,
        description:description,
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })
    res.json({
        message:"course created",
        courseId:course._id
    })
})
adminRouter.put("/course",adminMiddleware,async (req, res) => {
    const adminId = req.userId;
    const {title,description,imageUrl,price,courseId}=req.body;
    const course = await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price
    
    })
    res.json({
        message:"course updated",
        courseId:course._id
    })
})
adminRouter.get("/course/bulk",adminMiddleware,async (req, res) => {
const adminId = req.userId;
const courses = await courseModel.find({
    creatorId:adminId
});

res.json({
    message:"course updated",
    courses
})
})

module.exports = {
    adminRouter: adminRouter
}