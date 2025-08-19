import { NextResponse } from "next/server";
import Order from "../../../../models/Order";

function generateOrderString() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateMailHtml(order, user) {
  const tableRows = order.items
    .map((item) => {
      const subtotal = (item.price * item.quantity).toFixed(2);
      return `
        <tr>
          <td style="border: 1px solid #e2e8f0; padding: 12px; color: #374151;">${item.product_name}</td>
          <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">
            <img 
              src="${item.image}" 
              alt="${item.product_name}" 
              style="height: 50px; width: auto; border-radius: 8px;" 
            />
          </td>
          <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-weight: 600;">
            ${item.quantity}
          </td>
          <td style="border: 1px solid #e2e8f0; padding: 12px; color: #059669;">$${item.price}</td>
          <td style="border: 1px solid #e2e8f0; padding: 12px; color: #059669; font-weight: 600;">$${subtotal}</td>
        </tr>
      `;
    })
    .join("");

  const productsTable = `
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <thead>
        <tr style="background: #f1f5f9; color: #475569;">
          <th style="padding: 16px 12px; font-weight: 600; text-align: left;">Product</th>
          <th style="padding: 16px 12px; font-weight: 600; text-align: center;">Image</th>
          <th style="padding: 16px 12px; font-weight: 600; text-align: center;">Quantity</th>
          <th style="padding: 16px 12px; font-weight: 600; text-align: left;">Unit Price</th>
          <th style="padding: 16px 12px; font-weight: 600; text-align: left;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
     <div style="background: #f1f5f9; color: #475569; padding: 16px; border-radius: 12px; margin-top: 20px;">
      <p style="margin: 0; font-size: 18px; font-weight: 600;">
        Shipping Amount: $${order.shipping_amount}
      </p>
    </div>
    <div style="background: #f1f5f9; color: #475569; padding: 16px; border-radius: 12px; margin-top: 20px;">
      <p style="margin: 0; font-size: 18px; font-weight: 600;">
        Total Order Value: $${order.total_amount}
      </p>
    </div>
  `;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 30px; border-radius: 16px;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e293b; font-size: 28px; margin: 0 0 10px 0;">JKARE Health Services</h1>
          <div style="height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 2px; margin: 0 auto; width: 80px;"></div>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear <strong>${order.customer_name}</strong>,</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          We received your order on <strong style="color: #059669;">${order.order_date}</strong> 
          and wanted to provide you with the complete details:
        </p>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; color: #475569;"><strong>Order ID:</strong> <span style="color: #059669;">${order.order_id}</span></p>
          <p style="margin: 0; color: #475569;"><strong>Email:</strong> ${order.customer_email}</p>
        </div>

        <h3 style="color: #1e293b; font-size: 18px; margin: 30px 0 15px 0;">📦 Products in Your Order:</h3>
        ${productsTable}

        <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 20px; margin: 30px 0; border-radius: 0 12px 12px 0;">
          <p style="margin: 0; color: #01579b; font-size: 16px; line-height: 1.6;">
            Thank you for choosing Jkare for your medical equipment needs. Your order has been successfully created and we will contact you soon to arrange payment and delivery details.
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          If you have any questions, please feel free to reach out to our support team at support@jkare.com 
          or call us at 305-248-1003.
        </p>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
          <p style="margin: 0; color: #374151; font-size: 16px;">
            Thank you for choosing us,<br />
            <strong style="color: #1e293b; font-size: 18px;">TEAM - JKARE</strong>
          </p>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
            4101 SW 73rd Ave Suite C, Miami, FL 33155, USA
          </p>
        </div>
      </div>
    </div>
  `;
}

export const POST = async (req) => {
  try {
    const { selectedRate, products, prescription_items, ...body } =
      await req.json();
    const orderNumber = `ORD-${generateOrderString()}`;
    const shippingAmount = parseFloat(selectedRate.amount);
    const date = new Date();

    const orderParams = {
      order_id: orderNumber,
      ...body,
      amount_paid: 0,
      comment: "",
      order_status: "Pending",
      shipping_amount: selectedRate.isFree ? 0 : shippingAmount.toFixed(2),
      order_date: date.toLocaleString(),
      items: [],
    };

    for (const item of products) {
      const prodResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${item.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            quantity: Number(item.quantity),
          }),
        }
      );

      const product = await prodResp.json();

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

    const rx_K = orderParams.items
      .map((item) => item.prescription_required)
      .some((v) => v);
    orderParams.prescription_required = rx_K;
    orderParams.prescription_status = Object.values(prescription_items).every(
      (v) => v != ""
    )
      ? "Received"
      : "Pending";

    await Order.create(orderParams);

    // Use the generateMailHtml function with proper data mapping
    const emailHtml = generateMailHtml(orderParams, {
      message: "Thank you for your order! We will process it shortly.",
    });

    const emailResponse = await fetch(
      "https://vq4lz0otri.execute-api.ap-south-1.amazonaws.com/send/mail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: body.customer_email,
          subject: "Order Confirmation - Jkare",
          mailBody: emailHtml,
        }),
      }
    );

    if (!emailResponse.ok) {
      throw new Error(
        `Failed to send order confirmation email: ${emailResponse.statusText}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
