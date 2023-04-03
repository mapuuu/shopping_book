import express from "express";
import { 
    createOder, 
    deleteOrder, 
    getOders, 
    getOrderById, 
    mineOrders, 
    payOrder, 
    sumOrder, 
    updateOrder
} from "../controllers/order.js";
import { isAdmin, isAuth } from "../utils/utils.js";
const router = express.Router();

router.get("/", isAuth, isAdmin, getOders);
router.post("/", isAuth, createOder);
router.get("/summary", isAuth, isAdmin, sumOrder);
router.get("/mine", isAuth, mineOrders);
router.get("/:id", isAuth, getOrderById);
router.put("/:id/deliver", isAuth, updateOrder);
router.put("/:id/pay", isAuth, payOrder);
router.delete("/:id", isAuth, isAdmin, deleteOrder);

export default router;