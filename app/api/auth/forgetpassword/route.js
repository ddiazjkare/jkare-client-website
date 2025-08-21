import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
// import { getBaseURL } from '../../utils'

export const POST = async (req) => {
  try {
    const { email } = await req.json();
    let user = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/info/${email}`
    );
    user = await user.json();

    if (user && user.message)
      return NextResponse.json(
        { error: "no such user exists" },
        { status: 400 }
      );

    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    // const baseURL = getBaseURL(req)
    const baseURL = process.env.NEXTAUTH_URL;
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
  <style>
    body { font-family: sans-serif; }
    .container { width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
    .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div className="container">
    <h2>Password Reset</h2>

    <p>Hi ${user.fullName || user.email},</p>

    <p>We received a request to reset the password for your account associated with this email address.</p>

    <p>To reset your password, please click the button below:</p>

    <a href="${baseURL}/password-reset?token=${token}" class="button" style=" color : white">Reset Password</a>

    <p>This link will expire in 2 hours.</p>

    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

    <p>Thanks,</p>
    <p>The Medical Team</p>
  </div>
</body>
</html>
`;
    await fetch(
      "https://vq4lz0otri.execute-api.ap-south-1.amazonaws.com/send/mail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: `🌟 Password Reset Request - JKARE`,
          mailBody: html,
        }),
      }
    );
    return new Response("Email sent successfully! Please check Your registered Email", { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
