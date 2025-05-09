// // // In a real application, you would use a proper email service like SendGrid, Mailgun, etc.
// // // This is a mock implementation for demonstration purposes

// // export async function sendVerificationEmail(email: string, otp: string) {
// //   console.log(`Sending verification email to ${email} with OTP: ${otp}`)

// //   // In a real application, you would use something like:
// //   /*
// //   const msg = {
// //     to: email,
// //     from: 'noreply@yourdomain.com',
// //     subject: 'Verify your email address',
// //     text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
// //     html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
// //   };
  
// //   await sgMail.send(msg);
// //   */

// //   // For now, we'll just return a resolved promise
// //   return Promise.resolve()
// // }

// // export async function sendPasswordResetEmail(email: string, resetToken: string) {
// //   console.log(`Sending password reset email to ${email} with token: ${resetToken}`)

// //   // In a real application, you would send an actual email
// //   return Promise.resolve()
// // }

// import { Resend } from 'resend';

// // Initialize Resend with your API key
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(email: string, otp: string) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Verification <onboarding@resend.dev>', // You can change this later to your domain
//       to: email,
//       subject: 'Verify your email address',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>Thank you for registering. To complete your account setup, please use the verification code below:</p>
//           <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
//             <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
//           </div>
//           <p>This code will expire in 10 minutes.</p>
//           <p>If you didn't request this verification, please ignore this email.</p>
//           <p style="margin-top: 30px; font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
//         </div>
//       `,
//     });

//     if (error) {
//       console.error('Failed to send verification email:', error);
//       throw new Error(`Email sending failed: ${error.message}`);
//     }

//     console.log('Verification email sent successfully:', data?.id);
//     return data;
//   } catch (error) {
//     console.error('Error in sendVerificationEmail:', error);
//     throw error;
//   }
// }

// export async function sendPasswordResetEmail(email: string, resetToken: string) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Password Reset <onboarding@resend.dev>',
//       to: email,
//       subject: 'Reset your password',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #333;">Password Reset</h2>
//           <p>You requested to reset your password. Click the button below to create a new password:</p>
//           <div style="text-align: center; margin: 30px 0;">
//             <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}" 
//                style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
//               Reset Password
//             </a>
//           </div>
//           <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
//           <p style="margin-top: 30px; font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
//         </div>
//       `,
//     });

//     if (error) {
//       console.error('Failed to send password reset email:', error);
//       throw new Error(`Email sending failed: ${error.message}`);
//     }

//     console.log('Password reset email sent successfully:', data?.id);
//     return data;
//   } catch (error) {
//     console.error('Error in sendPasswordResetEmail:', error);
//     throw error;
//   }
// }
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'hotmail', 'yahoo', or custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // e.g., your Gmail address
    pass: process.env.EMAIL_PASS, // App password if using Gmail
  },
  tls: {
    rejectUnauthorized: false, // 👈 add this to allow self-signed certs
  },
});

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      // from: `"Verification" <${process.env.EMAIL_USER}>`,
      from: `"Verification" onboardin@authsystem.com`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for registering. To complete your account setup, please use the verification code below:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });

    console.log('Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    const info = await transporter.sendMail({
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });

    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw error;
  }
}
