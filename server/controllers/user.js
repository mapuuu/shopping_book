import User from "../models/user.js";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils/utils.js";

//Get all users --Admin
export const getAllUser = expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

//Get user by id --Admin
export const getUserById = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
});

//Update profile user
export const updateProfileUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
        });
        } else {
        res.status(404).send({ message: "User not found" });
        }
});

//Update role user --Admin
export const updateRole = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.send({ message: "User Updated", user: updatedUser });
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
});

//Delete user --Admin
export const deleteUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.email === "admin@example.com") {
            res.status(400).send({ message: "Can Not Delete Admin User" });
            return;
        }
        await user.remove();
        res.send({ message: "User Deleted" });
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
});

//Sign in 
export const signIn = expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
            });
            return;
        }
    }
    res.status(401).send({ message: "Invalid email or password" });
});

//Sign up
export const signUp = expressAsyncHandler(async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
    });
});

