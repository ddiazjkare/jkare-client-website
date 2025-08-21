import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// import sendMail from "../../../../lib/sendMail"; // Removed
// import { getBaseURL } from "../../utils";
import bcrypt from "bcrypt";
import Users from "../../../../models/Users";

export const POST = async (req) => {
  try {
    const userData = await req.json();

    const exUser = await Users.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });
    // console.log("exUser : ", exUser)
    if (exUser)
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 400 }
      );

    const password = await bcrypt.hash(userData.password, 10);
    const { username, phone, email } = userData;

    await Users.create({
      username,
      phone,
      email,
      password,
      verified: false,
    });

    const token = jwt.sign(
      { username: userData.username, email: userData.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    // const baseURL = getBaseURL(req);
    const baseURL = process.env.NEXTAUTH_URL;
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Email Verification</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="text-align: center; padding: 20px; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #333;">Verify Your Email Address</h1>
    
    <p style="color: #555; line-height: 1.5;">Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
    
    <a href="${baseURL}/api/auth/verify?for=email&token=${token}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
      Verify Now
    </a>
    
    <p style="color: #555; line-height: 1.5; margin-top: 20px;">If the button doesn't work, you can copy and paste the following link into your browser:</p>
    
    <p style="word-break: break-all;"><a href="${baseURL}/api/auth/verify?for=email&token=${token}" style="color: #007bff;">${baseURL}/api/auth/verify?for=email&token=${token}</a></p>
    
    <p style="color: #555; line-height: 1.5;">This link will expire in 24 hours.</p>
    
    <p style="color: #555; line-height: 1.5;">If you did not sign up for an account, you can ignore this email.</p>
  </div>
</body>
</html>`;

    // Replace sendMail with API call
    const emailResponse = await fetch(
      "https://vq4lz0otri.execute-api.ap-south-1.amazonaws.com/send/mail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userData.email,
          subject: "Email Verification - Please Verify Your Account",
          mailBody: html,
        }),
      }
    );

    // Check if email API call was successful
    if (!emailResponse.ok) {
      throw new Error(`Failed to send verification email: ${emailResponse.statusText}`);
    }

    return NextResponse.json(
      {
        message: "Success",
        email: userData.email,
        username: userData.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};