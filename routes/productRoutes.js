import express from 'express';
import { getProduct, saveProduct, deleteProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get("/", getProduct);
productRouter.post("/", saveProduct);
productRouter.delete("/:productId", deleteProduct);

export default productRouter;