import express from 'express'
import { addToCart, removeFromCart, getCart } from '../controller/cartController.js';
import isAuthenticated from '../middleWare/Authenticated.js';


const cartRouter = express.Router()


cartRouter.post("/add", isAuthenticated, addToCart);
cartRouter.post("/remove", isAuthenticated, removeFromCart);
cartRouter.get("/getcart", isAuthenticated, getCart);


export default cartRouter;