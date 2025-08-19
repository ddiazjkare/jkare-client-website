import { NextResponse } from "next/server";
import { getBaseURL } from "../../utils";
import bcrypt from "bcrypt";
import Users from "../../../../models/Users";

export const POST = async (req) => {
  try {
    const customerDetails = await req.json();

    if (customerDetails.tax_exempt) delete customerDetails.tax_exempt;
    if (customerDetails.tax_ids) delete customerDetails.tax_ids;

    const username = customerDetails.email.split("@")[0];
    const passwordFormed = `${username}@${customerDetails.phone.slice(-6)}`;
    const password = await bcrypt.hash(passwordFormed, 10);
        
    const user = new Users({
        verified: false,
        username,
       ...customerDetails,
        password,
      });
      await user.save();

    const baseURL = getBaseURL(req);
    const html = `<!DOCTYPE html>
    <html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
      <div class="container mx-auto p-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Your Account Details</h2>
      <p class="mb-4">Thank you for checking out! Here are your login credentials:</p>
      <div class="mb-4">
        <p class="font-bold">Username:</p>
        <p class="text-gray-700">${username}</p>
      </div>
      <div class="mb-4">
        <p class="font-bold">Password:</p>
        <p class="text-gray-700">${passwordFormed}</p>
      </div>
      <p class="mb-4">You can now login to your account using these credentials at <a href="${baseURL}/login" class="text-blue-500 hover:underline">${baseURL}/login</a>.</p>
      <p class="text-sm text-gray-600">If you have any questions, please don't hesitate to contact us.</p>
    </div>
  </div>
</body>
</html>`;

    const emailResponse = await fetch(
      "https://vq4lz0otri.execute-api.ap-south-1.amazonaws.com/send/mail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerDetails.email,
          subject: "Account Creation - Your Login Credentials",
          mailBody: html,
        }),
      }
    );
    if (!emailResponse.ok) {
      throw new Error(`Failed to send account creation email: ${emailResponse.statusText}`);
    }

    return NextResponse.json({ message: "user created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};