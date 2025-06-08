import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateProps {
  url: string;
  email: string;
  name?: string;
}

export const sendVerificationEmail = async ({ url, email, name }: EmailTemplateProps) => {
  const { data, error } = await resend.emails.send({
    from: 'ThumbAI <no-reply@thumbai.dev>',
    to: email,
    subject: 'Sign in to ThumbAI',
    html: `
      <!DOCTYPE html>
<html lang="en">
        <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in to ThumbAI</title>
          <style>
            body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f3f4f6; /* Light gray background like Apple/OpenAI pages */
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .email-container {
      max-width: 480px; /* Narrower for a sleek feel */
      margin: 40px auto;
      padding: 32px;
      background-color: #ffffff;
      border-radius: 16px; /* Softer, more modern radius */
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); /* Subtle shadow */
              text-align: center;
            }
            .logo {
      /* Replace with your actual logo if it's an image */
      /* For text logo as in the example: */
      font-size: 24px; /* Adjusted for sleekness */
      font-weight: 600; /* Semi-bold */
      color: #1f2937; /* Dark gray, almost black */
              text-decoration: none;
      margin-bottom: 28px; /* Refined Spacing */
      display: block;
            }
    .header-text {
      font-size: 28px; /* Prominent but not overly large */
      font-weight: 700; /* Bold */
      color: #111827; /* Very dark gray */
      margin-bottom: 12px;
    }
    .body-text {
      font-size: 16px;
      color: #374151; /* Refined Color: Darker Gray (was gray-600) */
      line-height: 1.6;
      margin-bottom: 8px;
    }
    .body-text-small {
      font-size: 14px;
      color: #4b5563; /* Refined Color: Medium Gray (was gray-500) */
      margin-bottom: 28px; /* Refined Spacing */
    }
    .login-button {
              display: inline-block;
      background-color: #4f46e5; /* A vibrant Indigo, similar to example's primaryColor */
      color: #ffffff;
      padding: 14px 32px;
              text-decoration: none;
      border-radius: 10px; /* Refined BorderRadius */
      font-size: 16px;
      font-weight: 500; /* Medium */
      margin-top: 0;    /* Refined Spacing (space above defined by .body-text-small) */
      margin-bottom: 28px; /* Refined Spacing */
      border: none;
      cursor: pointer;
            }
    .info-text {
      font-size: 14px;
      color: #374151; /* Darker gray for info */
      margin-bottom: 28px; /* Refined Spacing */
      line-height: 1.5;
    }
    .info-text strong {
      color: #111827; /* Emphasize email */
      font-weight: 500;
    }
    .footer-text {
              font-size: 12px;
      color: #9ca3af; /* Lightest gray for footer */
      margin-top: 28px; /* Refined Spacing */
            }
          </style>
        </head>
        <body>
  <div class="email-container">
    <!-- LOGO: Replace with your img tag if you have a base64 or URL logo -->
    <!-- For a text logo similar to example (Transmit): -->
    <div class="logo" style="font-size: 24px; font-weight: 600; color: #1f2937; text-decoration: none; margin-bottom: 28px; display: block;">ThumbAI</div>

    <h1 class="header-text" style="font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 12px;">Let's log you in</h1>
    
    <p class="body-text" style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 8px;">Click the button below to login to ThumbAI.</p>
    <p class="body-text-small" style="font-size: 14px; color: #4b5563; margin-bottom: 28px;">This button will expire in 24 hours.</p>

    <div>
      <a href="${url}" class="login-button" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-size: 16px; font-weight: 500; margin-top: 0; margin-bottom: 28px; border: none; cursor: pointer;">Login</a>
          </div>

    <p class="info-text" style="font-size: 14px; color: #374151; margin-bottom: 28px; line-height: 1.5;">
      Confirming this request will securely<br>log you in using <strong style="color: #111827; font-weight: 500;">${email}</strong>
    </p>

    <p class="footer-text" style="font-size: 12px; color: #9ca3af; margin-top: 28px;">
      If you didn't request this email, you can safely ignore it.
    </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
};

export const sendPasswordResetEmail = async ({ url, email, name }: EmailTemplateProps) => {
  const { data, error } = await resend.emails.send({
    from: 'ThumbAI <no-reply@thumbai.dev>',
    to: email,
    subject: 'Reset Your ThumbAI Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #7C3AED;
              font-size: 24px;
              font-weight: bold;
              text-decoration: none;
            }
            .button {
              display: inline-block;
              background-color: #7C3AED;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <a href="https://thumbai.dev" class="logo">ThumbAI</a>
          </div>
          <h1>Reset Your Password</h1>
          <p>Hi${name ? ` ${name}` : ''},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center;">
            <a href="${url}" class="button">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ThumbAI. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }

  return data;
}; 