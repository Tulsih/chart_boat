// constants/index.js - Application constants
const ORDER_STEPS = {
  GREETING: "greeting",
  TIME_GREETING: "time_greeting",
  MENU_OFFER: "menu_offer",
  MENU_SELECTION: "menu_selection",
  QUANTITY: "quantity",
  CONFIRMATION: "confirmation",
  USER_NAME: "user_name",
  USER_PHONE: "user_phone",
  USER_EMAIL: "user_email",
  ORDER_COMPLETE: "order_complete",
  FINISHED: "finished",
};

const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  USER_MESSAGE: "user_message",
  BOT_MESSAGE: "bot_message",
  USER_MESSAGE_ECHO: "user_message_echo",
  MENU_SELECTION: "menu_selection",
  QUANTITY_UPDATE: "quantity_update",
  ORDER_STATUS: "order_status",
  ORDER_HISTORY: "order_history",
};

const BOT_MESSAGES = {
  INITIAL_GREETING: "Hello! 👋",
  REQUEST_GREETING: "Please say hello to start ordering! 😊",
  MENU_OFFER:
    "You can order some delicious food! 🍕🍔 I'll send you our menu. Would you like to see it?",
  MENU_DISPLAY:
    "🍽️ **Our Delicious Menu:**\n\nSelect multiple items you'd like to order (you can choose more than one):",
  QUANTITY_REQUEST:
    "Great choice! 🍽️ Please specify the quantity for each item:",
  ORDER_INFO_REQUEST:
    "Perfect! 👍 To complete your order, I need some information.\n\nFirst, what's your name?",
  PHONE_REQUEST: "Got it! 📱\n\nLastly, what's your phone number?",
  EMAIL_REQUEST: "What's your email address? (We'll send your bill here)",
  ORDER_CONFIRMATION:
    "Thank you! 🎉 We have sent the bill to your email.\n\nYour order has been confirmed and you'll receive it soon!",
  FINAL_MESSAGE: "Thank you! 🙏 Enjoy your food and have a nice day! 😊🍽️✨",
  ERROR_MESSAGE: "Sorry, something went wrong. Please try again.",
  ORDER_ERROR:
    "Sorry, there was an error processing your order. Please try again.",
};

const TIME_GREETINGS = {
  MORNING: "Good morning! ☀️",
  AFTERNOON: "Good afternoon! 🌤️",
  EVENING: "Good evening! 🌙",
};

const RESPONSE_DELAY = {
  INITIAL_GREETING: 1000,
  BOT_RESPONSE: 1500,
};

module.exports = {
  ORDER_STEPS,
  ORDER_STATUS,
  SOCKET_EVENTS,
  BOT_MESSAGES,
  TIME_GREETINGS,
  RESPONSE_DELAY,
};
