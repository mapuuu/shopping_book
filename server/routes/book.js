import express from "express";
import { 
    addReview,
    createBook, 
    deleteBook, 
    getBook, 
    getBookAdmin, 
    getByCategory, 
    getOneBook, 
    searchBook, 
    seeBook, 
    updateBook
} from "../controllers/book.js";
import { isAdmin, isAuth } from "../utils/utils.js";
const router = express.Router();

router.get("/", getBook);
router.post("/", isAuth, isAdmin, createBook);
router.put("/:id", isAuth, isAdmin, updateBook);
router.delete("/:id", isAuth, isAdmin, deleteBook);
router.post("/:id/reviews", isAuth, addReview);
router.get("/admin", isAuth, isAdmin, getBookAdmin);
router.get("/search", searchBook);
router.get("/categories", getByCategory);
router.get("/title/:title", seeBook);
router.get("/:id", getOneBook);

export default router;