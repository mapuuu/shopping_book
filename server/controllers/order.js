import User from "../models/user.js";
import Product from "../models/book.js";
import Order from "../models/order.js";
import expressAsyncHandler from 'express-async-handler';

//Get orders --Admin
export const getOders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
});

//Create oder
export const createOder = expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
});

//Summuary order --Admin
export const sumOrder = expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
            },
        },
    ]);
    const users = await User.aggregate([
        {
            $group: {
            _id: null,
            numUsers: { $sum: 1 },
            },
        },
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
            },
        },{ $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
        {
            $group: {
            _id: '$category',
            count: { $sum: 1 },
            },
        },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
});

//Get my orders
export const mineOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
});

//Get order by id
export const getOrderById = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
});

//Update order
export const updateOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();
        res.send({ message: 'Order Delivered' });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
});

//Pay order
export const payOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'email name'
    );
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
});

//Delete order --Admin
export const deleteOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        await order.remove();
        res.send({ message: 'Order Deleted' });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
});

