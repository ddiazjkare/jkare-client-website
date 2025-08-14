import { NextResponse } from "next/server";
import Order from "../../../../models/Order";
import sendMail from "../../../../lib/sendMail";
function generateOrderString() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
export const POST = async (req) => {
    try {
        const { selectedRate, products, prescription_items, ...body } = await req.json();
        const orderNumber = `ORD-${generateOrderString()}`;
        const shippingAmount = Math.round(parseFloat(selectedRate.amount) * 100);

        const orderParams = {
            order_id: orderNumber,
            ...body,
            amount_paid: 0,
            comment: "",
            order_status: "Pending",
            comment: "",
            shipping_amount: selectedRate.isFree ? 0 : (shippingAmount).toFixed(2),
            items: [],
        };

        for (const item of products) {
            const prodResp = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/product/${item.id
                }`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        quantity: Number(item.quantity),
                    }),
                }
            );

            const product = await prodResp.json();
            // console.log("product", product);
            orderParams.items.push({
                product_id: product.product._id,
                product_name: product.product.prod_name,
                description: product.product.prod_desc,
                image: product.product.prod_images[0],
                quantity: item.quantity,
                price: parseFloat(product.product.prod_value),
                prescription_required: product.product.key_features.rx_required,
                prescription_file: prescription_items[product.product._id] ?? "",
            });
        }

        const rx_K = orderParams.items.map(item => item.prescription_required).some(v => v);
        orderParams.prescription_required = rx_K;
        orderParams.prescription_status = Object.values(prescription_items).every(v => v != "");

        await Order.create(orderParams);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Jkare</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #007bff;
      margin: 0;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 10px 0;
    }
    .order-details {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .order-details h3 {
      margin-top: 0;
      color: #333;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Jkare Medical Equipment</h1>
      <p>Order Confirmation</p>
    </div>
    <div class="content">
      <p>Dear ${body.customer_name},</p>
      <p>Thank you for choosing Jkare for your medical equipment needs. We are pleased to confirm that your order has been successfully created offline.</p>
      <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderNumber}</p>
        <p><strong>Date:</strong> ${(new Date()).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> $${body.total_amount} (To be paid later)</p>
      </div>
      <p>We will contact you soon to arrange payment and delivery details. If you have any questions, please feel free to reach out to our support team at support@jkare.com or call us at (123) 456-7890.</p>
      <p>Thank you for trusting Jkare!</p>
      <p>Best regards,<br>The Jkare Team</p>
    </div>
    <div class="footer">
      <p>Jkare Medical Equipment | 123 Health St, Wellness City | support@jkare.com</p>
      <p>&copy; 2025 Jkare. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`

        await sendMail(body.customer_email, "Order Booked", html);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
};
