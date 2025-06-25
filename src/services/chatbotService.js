// services/chatbotService.js - Chatbot logic service
const moment = require("moment");
const { MenuService } = require("../data/menu");
const OrderService = require("./orderService");

class ChatbotService {
  static getTimeGreeting() {
    const hour = moment().hour();
    if (hour < 12) {
      return "Good morning! ☀️";
    } else if (hour < 18) {
      return "Good afternoon! 🌤️";
    } else {
      return "Good evening! 🌙";
    }
  }

  static isCorrectTimeResponse(userMessage, currentHour) {
    return (
      (currentHour < 12 && userMessage.includes("morning")) ||
      (currentHour >= 12 &&
        currentHour < 18 &&
        userMessage.includes("afternoon")) ||
      (currentHour >= 18 && userMessage.includes("evening"))
    );
  }

  static async processBotResponse(userMessage, order) {
    const cleanMessage = userMessage.toLowerCase().trim();

    switch (order.step) {
      case "greeting":
        return this.handleGreeting(cleanMessage, order);

      case "time_greeting":
        return this.handleTimeGreeting(cleanMessage, order);

      case "menu_offer":
        return this.handleMenuOffer(cleanMessage, order);

      case "confirmation":
        return this.handleOrderConfirmation(cleanMessage, order);

      case "user_name":
        return this.handleUserName(cleanMessage, order);

      case "user_phone":
        return this.handleUserPhone(cleanMessage, order);

      case "user_email":
        return this.handleUserEmail(cleanMessage, order);

      case "order_complete":
        return this.handleOrderComplete(cleanMessage, order);

      default:
        return { message: "I didn't understand that. Please try again!" };
    }
  }

  static handleGreeting(userMessage, order) {
    if (userMessage.includes("hello") || userMessage.includes("hi")) {
      order.step = "time_greeting";
      return { message: this.getTimeGreeting() };
    }
    return { message: "Please say hello to start ordering! 😊" };
  }

  static handleTimeGreeting(userMessage, order) {
    const hour = moment().hour();

    if (this.isCorrectTimeResponse(userMessage, hour)) {
      order.step = "menu_offer";
      return {
        message:
          "You can order some delicious food! 🍕🍔 I'll send you our menu. Would you like to see it?",
        buttons: [
          { text: "Yes, show menu! 📋", value: "show_menu" },
          { text: "Maybe later 🤔", value: "later" },
        ],
      };
    }

    return {
      message:
        this.getTimeGreeting() +
        " Please respond with the appropriate greeting!",
    };
  }

  static handleMenuOffer(userMessage, order) {
    if (userMessage.includes("yes") || userMessage === "show_menu") {
      order.step = "menu_selection";
      return {
        message:
          "🍽️ **Our Delicious Menu:**\n\nSelect multiple items you'd like to order (you can choose more than one):",
        buttons: MenuService.getMenuButtons(),
      };
    } else if (userMessage.includes("later")) {
      return {
        message: "No problem! Feel free to come back when you're hungry! 😊",
      };
    }
    return { message: "Would you like to see our menu?" };
  }

  static handleOrderConfirmation(userMessage, order) {
    if (userMessage === "confirm_order") {
      order.step = "user_name";
      return {
        message:
          "Perfect! 👍 To complete your order, I need some information.\n\nFirst, what's your name?",
      };
    } else if (userMessage === "show_menu") {
      order.step = "menu_selection";
      order.items = [];
      return {
        message:
          "🍽️ **Our Delicious Menu:**\n\nSelect multiple items you'd like to order:",
        buttons: MenuService.getMenuButtons(),
      };
    }
    return {
      message: "Please choose to confirm your order or see the menu again.",
    };
  }

  static handleUserName(userMessage, order) {
    order.userInfo.name = userMessage;
    order.step = "user_phone";
    return {
      message: `Nice to meet you, ${userMessage}! 😊\n\nWhat's your phone number?`,
    };
  }

  static handleUserPhone(userMessage, order) {
    order.userInfo.phone = userMessage;
    order.step = "user_email";
    return {
      message:
        "Got it! 📱\n\nLastly, what's your email address? (We'll send your bill here)",
    };
  }

  static async handleUserEmail(userMessage, order) {
    order.userInfo.email = userMessage;
    order.step = "order_complete";

    const result = await OrderService.saveOrder(order);

    if (result.success) {
      return {
        message: `Thank you! 🎉 We have sent the bill to ${userMessage}.\n\nYour order has been confirmed and you'll receive it soon!`,
      };
    } else {
      return {
        message:
          "Sorry, there was an error processing your order. Please try again.",
      };
    }
  }

  static handleOrderComplete(userMessage, order) {
    if (
      userMessage.includes("ok") ||
      userMessage.includes("okay") ||
      userMessage.includes("thanks")
    ) {
      order.step = "finished";
      return {
        message: "Thank you! 🙏 Enjoy your food and have a nice day! 😊🍽️✨",
      };
    }
    return { message: "Is there anything else I can help you with?" };
  }
}

module.exports = ChatbotService;
