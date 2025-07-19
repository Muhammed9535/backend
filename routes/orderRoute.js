import express from 'express'
import { addOrder, allOrder, CancelOrder, getCancelOrder, updateStatus, userOrder, verifyOrder } from '../controller/orderController.js';
import isAuthenticated from '../middleWare/Authenticated.js';

const orderRouter = express.Router();

orderRouter.post("/add", isAuthenticated, addOrder)
orderRouter.get("/all-orders", allOrder)
orderRouter.post("/order-status", updateStatus)
orderRouter.post("/verify", verifyOrder)
orderRouter.get("/user-order", userOrder)
orderRouter.post("/cancel-order", isAuthenticated, CancelOrder)
orderRouter.get("/get-cancel-order", getCancelOrder)


export default orderRouter