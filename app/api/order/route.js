import { NextResponse } from "next/server";
import Order from "../../../models/Order";
import Stripe from "stripe";
// import { transaction } from "../../../lib/shippo";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
    </table>`;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 30px; border-radius: 16px;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e293b; font-size: 28px; margin: 0 0 10px 0;">JKARE Health Services</h1>
          <div style="height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 2px; margin: 0 auto; width: 80px;"></div>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear <strong>${
          order.customer_name
        }</strong>,</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          We received your order on <strong style="color: #059669;">${
            order.order_date
          }</strong> 
          and your payment has been processed successfully. Here are the complete details:
        </p>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; color: #475569;"><strong>Order ID:</strong> <span style="color: #059669;">${
            order.order_id
          }</span></p>
          <p style="margin: 0 0 8px 0; color: #475569;"><strong>Email:</strong> ${
            order.customer_email
          }</p>
          <p style="margin: 0 0 8px 0; color: #475569;"><strong>Phone:</strong> ${
            order.customer_phone || "N/A"
          }</p>
          <p style="margin: 0; color: #475569;"><strong>Order Status:</strong> <span style="color: #059669;">${
            order.order_status
          }</span></p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h4 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">📍 Delivery Information</h4>
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 8px 0; color: #475569; font-weight: 600;">Shipping Address:</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
              ${order.shipping_address.line1}${
    order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""
  }<br/>
              ${order.shipping_address.city}, ${order.shipping_address.state} ${
    order.shipping_address.postal_code
  }<br/>
              ${order.shipping_address.country}
            </p>
          </div>
          <div>
            <p style="margin: 0 0 8px 0; color: #475569; font-weight: 600;">Billing Address:</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
              ${order.billing_address.line1}${
    order.billing_address.line2 ? `, ${order.billing_address.line2}` : ""
  }<br/>
              ${order.billing_address.city}, ${order.billing_address.state} ${
    order.billing_address.postal_code
  }<br/>
              ${order.billing_address.country}
            </p>
          </div>
        </div>

        ${
          order.prescription_required
            ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 12px 12px 0;">
          <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📋 Prescription Status</h4>
          <p style="margin: 0; color: #92400e;">
            <strong>Status:</strong> ${order.prescription_status}<br/>
            ${
              order.prescription_status === "Pending"
                ? "Please upload your prescription documents to complete your order."
                : "Prescription documents received and verified."
            }
          </p>
        </div>`
            : ""
        }

        ${
          order.insurance_company
            ? `
        <div style="background: #e0f7fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h4 style="color: #006064; margin: 0 0 10px 0; font-size: 16px;">🏥 Insurance Information</h4>
          <p style="margin: 0; color: #006064;">
            <strong>Insurance Company:</strong> ${order.insurance_company}
          </p>
        </div>`
            : ""
        }

        <h3 style="color: #1e293b; font-size: 18px; margin: 30px 0 15px 0;">📦 Products in Your Order:</h3>
        ${productsTable}

        <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin-top: 20px;">
          <h4 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">💰 Order Summary</h4>
          <div style="margin-bottom: 8px;">
            <span style="color: #475569;">Subtotal: </span>
            <span style="color: #475569; font-weight: 600;">$${
              order.sub_amount
            }</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: #475569;">Shipping: </span>
            <span style="color: #475569; font-weight: 600;">$${
              order.shipping_amount
            }</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: #475569;">Tax: </span>
            <span style="color: #475569; font-weight: 600;">$${
              order.tax_amount
            }</span>
          </div>
          ${
            order.discount_amount > 0
              ? `
          <div style="margin-bottom: 8px;">
            <span style="color: #dc2626;">Discount: </span>
            <span style="color: #dc2626; font-weight: 600;">-$${order.discount_amount}</span>
          </div>`
              : ""
          }
          <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 15px 0;">
          <div>
            <span style="color: #1e293b; font-size: 18px; font-weight: 700;">Total: </span>
            <span style="color: #059669; font-size: 18px; font-weight: 700;">$${
              order.total_amount
            }</span>
          </div>
        </div>

        <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 20px; margin: 30px 0; border-radius: 0 12px 12px 0;">
          <p style="margin: 0; color: #01579b; font-size: 16px; line-height: 1.6;">
            Thank you for choosing Jkare for your medical equipment needs. Your payment has been processed and we will contact you soon to arrange delivery details.
           
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
    const body = await req.json();

    const checkout_session = await stripe.checkout.sessions.retrieve(
      body.sessionID,
      {
        expand: ["line_items"],
      }
    );
    const customer = checkout_session.customer_details;
    let user_info = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/info/${customer.email}`
    );
    const user = await user_info.json();

    const paymentIntent = await stripe.paymentIntents.retrieve(
      checkout_session.payment_intent
    );

    if (user.message == "Not Found") {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
        method: "POST",
        body: JSON.stringify(customer),
      });
    }
    const productItems = checkout_session.line_items.data;
    const date = new Date();

    const orderNumber = `ORD-${generateOrderString()}`;
    const orderParams = {
      order_id: orderNumber,
      checkout_session: body.sessionID,
      shipping_rate: checkout_session.metadata.shipping_rate,
      order_status: JSON.parse(checkout_session.metadata.prescription_required)
        ? "Pending"
        : "Completed",
      carrier: checkout_session.metadata.carrier,
      comment: "",
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone,
      order_date: date.toLocaleString(),
      // shipping_address: checkout_session.shipping_details.address,
      shipping_address: paymentIntent.shipping.address,
      billing_address: customer.address,
      total_amount: parseFloat(
        (checkout_session.amount_total / 100).toFixed(2)
      ),
      amount_paid: parseFloat((checkout_session.amount_total / 100).toFixed(2)),
      sub_amount: parseFloat(
        (checkout_session.amount_subtotal / 100).toFixed(2)
      ),
      discount_amount: parseFloat(
        (checkout_session.total_details.amount_discount / 100).toFixed(2)
      ),
      shipping_amount: parseFloat(
        (checkout_session.total_details.amount_shipping / 100).toFixed(2)
      ),
      tax_amount: parseFloat(
        (checkout_session.total_details.amount_tax / 100).toFixed(2)
      ),
      insurance_pdf: checkout_session.metadata.insurance_file ?? "",
      insurance_company: checkout_session.metadata.insurance_company ?? "",
      prescription_required: JSON.parse(
        checkout_session.metadata.prescription_required
      ),
      prescription_status: checkout_session.metadata.prescription_status,
      items: [],
    };

    let presItems = {};
    if (checkout_session.metadata.prescription_items)
      presItems = JSON.parse(checkout_session.metadata.prescription_items);

    const parsedProdList = JSON.parse(checkout_session.metadata.products);
    for (const item of productItems) {
      const prodResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${
          parsedProdList[item.description]
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
        price: (item.amount_total / 100).toFixed(2),
        prescription_required:
          product.product._id in presItems ||
          presItems[product.product._id] == "",
        prescription_file: presItems[product.product._id] ?? "",
      });
    }

    await Order.create(orderParams);

    const emailHtml = generateMailHtml(orderParams, {
      message:
        "Thank you for your order! Your payment has been processed successfully.",
    });

    const emailResponse = await fetch(
      "https://vq4lz0otri.execute-api.ap-south-1.amazonaws.com/send/mail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customer.email,
          subject: "Order Confirmation - Jkare",
          mailBody: emailHtml,
        }),
      }
    );

    // Check if email API call was successful
    if (!emailResponse.ok) {
      throw new Error(
        `Failed to send order confirmation email: ${emailResponse.statusText}`
      );
    }
    return NextResponse.json({ message: "order created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
