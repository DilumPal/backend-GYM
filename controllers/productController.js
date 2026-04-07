import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProduct(req, res) {

    try {

        if (isAdmin(req)) {
            const product = await Product.find();
            res.json(product);
        } else {
            const product = await Product.find({ isAvailable: true });
            res.json(product);
        }
    } catch (err) {
        res.json({
            message: "Failed to fetch product data",
            error: err
        })
    }
}

export function saveProduct(req, res) {

    if (!isAdmin(req, res)) {
        res.status(403).json({
            message: "You are not authorized to add a product, Please login as admin first"
        })
        return;
    }

    const product = new Product(
        req.body
    )

    product.save().then(() => {
        res.json({
            message: "Product data saved successfully"
        })
    }).catch(() => {
        res.json({
            message: "Failed to save product data"
        })
    })
}

export async function deleteProduct(req, res) {
    if (!isAdmin(req, res)) {
        res.status(403).json({
            message: "You are not authorized to delete a product, Please login as admin first"
        })
        return;
    }
    try {
        await Product.deleteOne({ productId: req.params.productId })

        res.json({
            message: "Product deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete product",
            error: err
        })
    }
}

export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to update a product"
        })
        return;
    }

    const productId = req.params.productId
    const updatingData = req.body

    try {
        await Product.updateOne(
            { productID: productId },
            updatingData
        );

        res.json({
            message: "Product updated successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: "internal server error",
            error: err
        })
    }
}

export async function getProductById() {
    const productId = req.params.productId

    try {
        const product = await product.findeOne({
            productID: productId
        })

        if (product == null) {
            res.status(404).json({
                message: "Product not found"
            })
            return
        }

        if (product.isAvailable) {
            res.json(product)
        } else {
            if (!isAdmin(req)) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }else{
                res.json(product)
            }
        }

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        })
    }
}