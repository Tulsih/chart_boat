const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be your Gmail App Password
  },
  // Add these settings for better reliability
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOrderConfirmation = async (email, order) => {
  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let itemsList = "";
  order.items.forEach((item) => {
    itemsList += `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>`;
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">🍽️ Order Confirmation</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>Hi ${order.userInfo.name}!</h3>
        <p>Thank you for your order. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #333; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="background: #f0f0f0; font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right;">Grand Total:</td>
              <td style="padding: 12px; text-align: right;">₹${total.toFixed(
                2
              )}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin: 20px 0;">
          <h4>Delivery Information:</h4>
          <p><strong>Name:</strong> ${order.userInfo.name}</p>
          <p><strong>Phone:</strong> ${order.userInfo.phone}</p>
          <p><strong>Email:</strong> ${order.userInfo.email}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #2d5a2d;">
            <strong>✅ Your order has been confirmed!</strong><br>
            Estimated delivery time: 30-45 minutes
          </p>
        </div>
      </div>
      
      <p style="text-align: center; color: #666; font-size: 14px;">
        Thank you for choosing our service! 🙏
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🍽️ Order Confirmation - Your Delicious Food is on the Way!",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation,
};
