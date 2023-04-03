import express from "express";
import { 
    deleteUser,
    getAllUser, 
    getUserById, 
    signIn, 
    signUp, 
    updateProfileUser,
    updateRole
} from "../controllers/user.js";
import { isAdmin, isAuth } from "../utils/utils.js";
const router = express.Router();

router.get("/", isAuth, isAdmin, getAllUser);
router.get("/:id", isAuth, isAdmin, getUserById);
router.put("/profile", isAuth, updateProfileUser);
router.put("/:id", isAuth, isAdmin, updateRole);
router.delete("/:id", isAuth, isAdmin, deleteUser);
router.post("/signin", signIn);
router.post("/signup", signUp);

export default router;