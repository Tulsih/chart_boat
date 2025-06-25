const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false, // Set to true if using port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOrderBill(order) {
    try {
      const billHTML = this.generateBillHTML(order);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.customerEmail,
        subject: `Order Confirmation - Order #${order._id}`,
        html: billHTML,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Bill sent successfully to:", order.customerEmail);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }

  generateBillHTML(order) {
    const itemsHTML = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${item.total}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .bill-container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 18px; }
          .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="header">
            <h2>🍽️ Restaurant Order Bill</h2>
            <p>Order ID: #${order._id}</p>
            <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
          
          <div class="customer-info">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr class="total">
                <td colspan="3">Total Amount:</td>
                <td>₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            <p>Thank you for your order! 🙏</p>
            <p>Your food will be prepared shortly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
