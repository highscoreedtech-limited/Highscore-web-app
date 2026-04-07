import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Generate a unique token
  const otp = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes, UTC ISO string

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?email=${encodeURIComponent(email)}&token=${otp}`;

  // Save OTP to Supabase
  const { error: supabaseError } = await supabaseAdmin!
    .from("otps")
    .insert([{ email, otp, expires_at: expiresAt }]);

  if (supabaseError) {
    return NextResponse.json({ error: supabaseError.message }, { status: 500 });
  }

  // Convert logo to Base64 safely
  let logoBase64 = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      logoBase64 = fs.readFileSync(logoPath).toString("base64");
    }
  } catch (error) {
    console.warn("Could not load logo.png for email template");
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Your Verification Code</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="background-color:#001A33;padding:24px;">
                  ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Highscore Logo" width="120" style="display:block;margin:0 auto;" />` : `<h2 style="color:white;margin:0;">Highscore</h2>`}
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px 20px;color:#333333;">
                  <h2 style="margin:0 0 10px;font-size:24px;font-weight:bold;text-align:center;">Verify Your Email</h2>
                  <p style="font-size:16px;line-height:1.6;text-align:center;margin:0 0 25px;">
                    Hi there 👋, please click the button below to verify your email address and complete your signup. This link expires in 10 minutes.
                  </p>
                  <div style="text-align:center;margin-bottom:40px;">
                    <a href="${verifyUrl}" style="
                      display:inline-block;
                      padding:15px 30px;
                      background:linear-gradient(180deg,#FF9053 0%,#DB5206 100%);
                      color:#fff;
                      font-weight:bold;
                      font-size:18px;
                      border-radius:10px;
                      text-decoration:none;
                    ">
                      Verify Email
                    </a>
                  </div>
                  <p style="font-size:14px;line-height:1.6;text-align:center;color:#666;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#f9f9f9;padding:20px;text-align:center;color:#999;font-size:12px;">
                  © ${new Date().getFullYear()} Highscore. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Highscore" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify your email - Highscore",
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: "OTP sent!" });
  } catch (err: any) {
    console.error("Error sending email via Gmail:", err);
    return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
  }
}
