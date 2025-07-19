import express from 'express'
import { addContact, getAllContact } from '../controller/contactController.js';

const contactRouter = express.Router();

contactRouter.post("/add-contact", addContact)
contactRouter.get("/get-contact", getAllContact)

export default contactRouter