const socket = io();
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const quantityModal = document.getElementById("quantityModal");
const quantityInputs = document.getElementById("quantityInputs");
const confirmQuantitiesBtn = document.getElementById("confirmQuantities");
const closeModal = document.querySelector(".close");

let selectedMenuItems = [];
let isWaitingForResponse = false;

// Event listeners
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

confirmQuantitiesBtn.addEventListener("click", confirmQuantities);
closeModal.addEventListener("click", () => {
  quantityModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === quantityModal) {
    quantityModal.style.display = "none";
  }
});

// Socket event listeners
socket.on("bot_message", (data) => {
  isWaitingForResponse = false;
  addMessage(
    data.message,
    "bot",
    data.timestamp,
    data.buttons,
    data.showQuantityInput,
    data.selectedItems
  );
});

socket.on("user_message_echo", (data) => {
  addMessage(data.message, "user", data.timestamp);
});

// Functions
function sendMessage() {
  const message = messageInput.value.trim();
  if (message && !isWaitingForResponse) {
    isWaitingForResponse = true;
    socket.emit("user_message", { message });
    messageInput.value = "";
  }
}

function addMessage(
  message,
  sender,
  timestamp,
  buttons = null,
  showQuantityInput = false,
  selectedItems = null
) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  // Format message with markdown-like styling
  const formattedMessage = formatMessage(message);
  contentDiv.innerHTML = formattedMessage;

  const timeDiv = document.createElement("div");
  timeDiv.className = "message-time";
  timeDiv.textContent = timestamp;

  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);

  // Add buttons if provided
  if (buttons && buttons.length > 0) {
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "message-buttons";

    buttons.forEach((button) => {
      const btn = document.createElement("button");
      btn.className =
        button.value && button.value.toString().match(/^\d+$/)
          ? "btn btn-menu"
          : "btn btn-primary";
      btn.textContent = button.text;
      btn.onclick = () => handleButtonClick(button, buttons, btn);
      buttonsDiv.appendChild(btn);
    });

    messageDiv.appendChild(buttonsDiv);
  }

  // Show quantity input modal if needed
  if (showQuantityInput && selectedItems) {
    setTimeout(() => {
      showQuantityModal(selectedItems);
    }, 500);
  }

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(message) {
  return message
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>")
    .replace(/• /g, "• ")
    .replace(/(\d+\.\s)/g, "<strong>$1</strong>");
}

function handleButtonClick(button, allButtons, btnElement) {
  if (button.value && button.value.toString().match(/^\d+$/)) {
    // Menu item selection
    btnElement.classList.toggle("selected");

    const itemId = parseInt(button.value);
    const existingIndex = selectedMenuItems.findIndex(
      (item) => item.id === itemId
    );

    if (existingIndex > -1) {
      selectedMenuItems.splice(existingIndex, 1);
    } else {
      selectedMenuItems.push({
        id: itemId,
        name: button.name,
        price: button.price,
      });
    }

    // Add "Order Selected Items" button if items are selected
    updateOrderButton(allButtons, btnElement.parentElement);
  } else if (button.value === "order_selected") {
    if (selectedMenuItems.length > 0) {
      socket.emit("menu_selection", { selectedItems: selectedMenuItems });
      // Disable all menu buttons
      const menuButtons =
        btnElement.parentElement.querySelectorAll(".btn-menu");
      menuButtons.forEach((btn) => (btn.disabled = true));
      btnElement.style.display = "none";
    }
  } else {
    // Regular button click
    isWaitingForResponse = true;
    socket.emit("user_message", { message: button.value });

    // Disable all buttons in this message
    const buttons = btnElement.parentElement.querySelectorAll(".btn");
    buttons.forEach((btn) => (btn.disabled = true));
  }
}

function updateOrderButton(allButtons, buttonsContainer) {
  let orderButton = buttonsContainer.querySelector(".btn-order");

  if (selectedMenuItems.length > 0) {
    if (!orderButton) {
      orderButton = document.createElement("button");
      orderButton.className = "btn btn-primary btn-order";
      orderButton.onclick = () =>
        handleButtonClick({ value: "order_selected" }, allButtons, orderButton);
      buttonsContainer.appendChild(orderButton);
    }
    orderButton.textContent = `Order Selected Items (${selectedMenuItems.length}) 🛒`;
    orderButton.style.display = "block";
  } else if (orderButton) {
    orderButton.style.display = "none";
  }
}

function showQuantityModal(items) {
  quantityInputs.innerHTML = "";

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "quantity-item";

    itemDiv.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="changeQuantity(${
                  item.id
                }, -1)">-</button>
                <input type="number" class="quantity-input" id="qty-${
                  item.id
                }" value="1" min="1" max="99">
                <button class="quantity-btn" onclick="changeQuantity(${
                  item.id
                }, 1)">+</button>
            </div>
        `;

    quantityInputs.appendChild(itemDiv);
  });

  quantityModal.style.display = "block";
}

function changeQuantity(itemId, change) {
  const input = document.getElementById(`qty-${itemId}`);
  let currentValue = parseInt(input.value) || 1;
  let newValue = currentValue + change;

  if (newValue < 1) newValue = 1;
  if (newValue > 99) newValue = 99;

  input.value = newValue;
}

function confirmQuantities() {
  const updatedItems = selectedMenuItems.map((item) => {
    const quantityInput = document.getElementById(`qty-${item.id}`);
    const quantity = parseInt(quantityInput.value) || 1;

    return {
      ...item,
      quantity: quantity,
    };
  });

  socket.emit("quantity_update", { items: updatedItems });
  quantityModal.style.display = "none";
  selectedMenuItems = [];
}

// Add some initial styling and animations
document.addEventListener("DOMContentLoaded", () => {
  // Add typing indicator functionality
  let typingTimer;

  messageInput.addEventListener("input", () => {
    clearTimeout(typingTimer);
    // You can add typing indicator here if needed

    typingTimer = setTimeout(() => {
      // Stop typing indicator
    }, 1000);
  });

  // Add connection status indicator
  socket.on("connect", () => {
    console.log("Connected to server");
    document.querySelector(".status").textContent = "Online";
    document.querySelector(".status").style.color = "#2ecc71";
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
    document.querySelector(".status").textContent = "Offline";
    document.querySelector(".status").style.color = "#e74c3c";
  });

  socket.on("reconnect", () => {
    console.log("Reconnected to server");
    document.querySelector(".status").textContent = "Online";
    document.querySelector(".status").style.color = "#2ecc71";
  });
});

// Add some utility functions for better UX
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing-indicator";
  typingDiv.id = "typing-indicator";

  typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Add CSS for typing indicator
const style = document.createElement("style");
style.textContent = `
    .typing-indicator .message-content {
        background: white !important;
        border: 1px solid #e1e5e9 !important;
        padding: 16px 20px !important;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #999;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .btn-order {
        background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
        color: white !important;
        font-weight: bold;
        margin-top: 10px;
        width: 100%;
        padding: 10px 16px;
    }
    
    .btn-order:hover {
        background: linear-gradient(135deg, #27ae60, #2ecc71) !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
    }
`;

document.head.appendChild(style);
