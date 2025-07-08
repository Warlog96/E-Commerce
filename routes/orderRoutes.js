const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

// POST /api/orders
router.post("/", async(req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            totalPrice,
            status
        } = req.body;

        // Basic validations
        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items provided" });
        }

        if (!shippingAddress || typeof shippingAddress !== "object") {
            return res.status(400).json({ message: "Shipping address is missing" });
        }

        if (!paymentMethod || !itemsPrice || !taxPrice || !totalPrice || !status) {
            return res.status(400).json({ message: "Missing order metadata fields" });
        }

        const newOrder = new Order({
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            totalPrice,
            status
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);

    } catch (error) {
        console.error("Order saving error:", error);
        res.status(500).json({ message: "Server error while saving order" });
    }
});

module.exports = router;