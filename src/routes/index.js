// routes/index.js - Application routes
const express = require("express");
const router = express.Router();
const { MenuService } = require("../data/menu");
const OrderService = require("../services/orderService");

// Home page
router.get("/", (req, res) => {
  res.render("index");
});

// API Routes
router.get("/api/menu", (req, res) => {
  try {
    const menu = MenuService.getAllItems();
    res.json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/api/menu/:id", (req, res) => {
  try {
    const item = MenuService.getItemById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/api/menu/category/:category", (req, res) => {
  try {
    const items = MenuService.getItemsByCategory(req.params.category);
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order management routes
router.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await OrderService.getOrdersByUserId(req.params.userId);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/api/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(
      req.params.orderId,
      status
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

module.exports = router;
