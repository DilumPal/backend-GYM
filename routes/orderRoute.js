import express from "express";
import { createOrder, getOrders, updateOrderStatus, getBestSellers }from '../controllers/orderController.js'

const orderRouter = express.Router();

orderRouter.get("/best-sellers", getBestSellers);
orderRouter.post("/", createOrder)
orderRouter.get("/", getOrders)
orderRouter.put("/:orderId/:status",updateOrderStatus)

export default orderRouter;