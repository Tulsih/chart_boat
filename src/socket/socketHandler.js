// handlers/socketHandler.js - Socket.io event handler
const moment = require("moment");
const ChatbotService = require("../services/chatbotService");
const OrderService = require("../services/orderService");

function socketHandler(socket, io) {
  console.log("User connected:", socket.id);

  // Initialize order session
  let currentOrder = OrderService.createOrderSession(socket.id);

  // Send initial greeting
  setTimeout(() => {
    socket.emit("bot_message", {
      message: "Hello! 👋",
      timestamp: moment().format("HH:mm"),
    });
  }, 1000);

  // Handle user messages
  socket.on("user_message", async (data) => {
    const timestamp = moment().format("HH:mm");

    // Echo user message
    socket.emit("user_message_echo", {
      message: data.message,
      timestamp: timestamp,
    });

    // Process bot response
    setTimeout(async () => {
      try {
        const botResponse = await ChatbotService.processBotResponse(
          data.message,
          currentOrder
        );

        socket.emit("bot_message", {
          message: botResponse.message,
          timestamp: moment().format("HH:mm"),
          buttons: botResponse.buttons || null,
          showQuantityInput: botResponse.showQuantityInput || false,
          selectedItems: botResponse.selectedItems || null,
        });
      } catch (error) {
        console.error("Error processing bot response:", error);
        socket.emit("bot_message", {
          message: "Sorry, something went wrong. Please try again.",
          timestamp: moment().format("HH:mm"),
        });
      }
    }, 1500);
  });

  // Handle menu selection
  socket.on("menu_selection", (data) => {
    const selectedItems = data.selectedItems;
    currentOrder.items = selectedItems.map((item) => ({
      ...item,
      quantity: 1,
    }));
    currentOrder.step = "quantity";

    socket.emit("bot_message", {
      message: "Great choice! 🍽️ Please specify the quantity for each item:",
      timestamp: moment().format("HH:mm"),
      showQuantityInput: true,
      selectedItems: currentOrder.items,
    });
  });

  // Handle quantity updates
  socket.on("quantity_update", (data) => {
    currentOrder.items = data.items;
    currentOrder.step = "confirmation";

    const orderSummary = OrderService.formatOrderSummary(currentOrder.items);

    socket.emit("bot_message", {
      message: orderSummary,
      timestamp: moment().format("HH:mm"),
      buttons: [
        { text: "Confirm Order ✅", value: "confirm_order" },
        { text: "Show Menu Again 🔄", value: "show_menu" },
      ],
    });
  });

  // Handle order status requests
  socket.on("order_status", async (data) => {
    try {
      const orders = await OrderService.getOrdersByUserId(socket.id);
      socket.emit("order_history", { orders });
    } catch (error) {
      console.error("Error fetching order history:", error);
      socket.emit("bot_message", {
        message: "Sorry, couldn't fetch your order history.",
        timestamp: moment().format("HH:mm"),
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}

module.exports = socketHandler;
