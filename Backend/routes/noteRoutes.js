import express from "express";
import tokenVerification from "../middlewares/tokenVerifications.js";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteControllers.js";

const router = express.Router();


router.post("/", tokenVerification, createNote);       
router.get("/", tokenVerification, getNotes);         
router.patch("/:id", tokenVerification, updateNote);  
router.delete("/:id", tokenVerification, deleteNote); 

export default router;
