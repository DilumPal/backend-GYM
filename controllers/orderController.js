import Order from "../models/order.js"
import Product from "../models/product.js"

export async function createOrder(req, res) {
    //get user info
    //add current user name if not provided
    //orderId generate
    //create order

    if (req.user == null) {
        res.status(403).json({
            message: "Please login and try again"
        })
        return
    }

    const orderInfo = req.body

    if (orderInfo.name == null) {
        orderInfo.name = req.user.firstName + " " + req.user.lastName
    }

    let orderId = "GYM00001"

    const lastOrder = await Order.find().sort({ date: -1 }).limit(1)

    if (lastOrder.length > 0) {
        const lastOrderId = lastOrder[0].orderId //GYM00551
        const lastOrderNumberString = lastOrderId.replace("GYM", "") //00551
        const lastOrderNumber = parseInt(lastOrderNumberString) //551
        const newOrderNumber = lastOrderNumber + 1 //552
        const newOrderNumberString = String(newOrderNumber).padStart(5, '0');
        orderId = "GYM" + newOrderNumberString //GYM00552
    }

    try {
        let total = 0;
        let labelledTotal = 0;
        const products = []

        for(let i = 0; i<orderInfo.products.length; i++){
            const item = await Product.findOne({productID : orderInfo.products[i].productId})
            if(item == null){
                res.status(404).json({
                    message : "Product with ProductId " + orderInfo.products[i].productId + " not found"
                })
                return
            }
            if(item.isAvailable == false){
                res.status(404).json({
                    message : "Product with productId " + orderInfo.products[i].productId + " is not available right now"
                })
                return
            }

            products[i] = {
                productInfo : {
                    productId : item.productID,
                    name : item.name,
                    altNames : item.altNames,
                    description : item.description,
                    images : item.images,
                    labelledPrice : item.labelledPrice,
                    price : item.price
                },
                quantity : orderInfo.products[i].qty
            }
            total += (item.price* orderInfo.products[i].qty)
            labelledTotal += (item.labelledPrice * orderInfo.products[i].qty)
        }

        const order = new Order({
            orderId: orderId,
            email: req.user.email,
            name: orderInfo.name,
            address: orderInfo.address,
            total: 0,
            phone: orderInfo.phone,
            products: products,
            labelledTotal : labelledTotal,
            total : total
        })
        const createdOrder = await order.save()
        res.json({
            message: "Order created succesfully",
            order: createdOrder
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to create order",
            error: err
        })
    }

}