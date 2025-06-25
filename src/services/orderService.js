// services/orderService.js - Order management service
const Order = require("../models/Order");
const User = require("../models/User");
const emailService = require("../utils/emailService");

class OrderService {
  static createOrderSession(userId) {
    return {
      userId: userId,
      items: [],
      userInfo: {},
      step: "greeting",
    };
  }

  static calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  static formatOrderSummary(items) {
    const total = this.calculateTotal(items);
    let orderSummary = "📋 **Order Summary:**\n\n";

    items.forEach((item) => {
      orderSummary += `• ${item.name} x${item.quantity} - ₹${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    orderSummary += `\n**Total: ₹${total.toFixed(
      2
    )}**\n\nWould you like to confirm this order?`;
    return orderSummary;
  }

  static async saveOrder(orderData) {
    try {
      const newOrder = new Order({
        userId: orderData.userId,
        items: orderData.items,
        userInfo: orderData.userInfo,
        total: this.calculateTotal(orderData.items),
        status: "confirmed",
        orderDate: new Date(),
      });

      await newOrder.save();

      // Send confirmation email
      await emailService.sendOrderConfirmation(
        orderData.userInfo.email,
        orderData
      );

      return { success: true, order: newOrder };
    } catch (error) {
      console.error("Error saving order:", error);
      return { success: false, error: error.message };
    }
  }

  static async getOrdersByUserId(userId) {
    try {
      return await Order.find({ userId }).sort({ orderDate: -1 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  }
}

module.exports = OrderService;
