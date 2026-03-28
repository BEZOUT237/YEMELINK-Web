import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  from: string = process.env.SMTP_FROM || 'noreply@yemelink.com'
) => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html
    });

    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};

export const sendQuoteRequestEmail = async (data: any) => {
  const html = `
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    <p><strong>Service:</strong> ${data.service_type}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
    <hr />
    <p>Received at: ${new Date().toLocaleString()}</p>
  `;

  return sendEmail(
    process.env.CONTACT_EMAIL || 'yemelink@gmail.com',
    `New Quote Request from ${data.name}`,
    html
  );
};

export const sendContactEmail = async (data: any) => {
  const html = `
    <h2>New Contact Message</h2>
    <p><strong>From:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
    <hr />
    <p>Received at: ${new Date().toLocaleString()}</p>
  `;

  return sendEmail(
    process.env.CONTACT_EMAIL || 'yemelink@gmail.com',
    `New Contact: ${data.subject}`,
    html
  );
};

export const sendPaymentConfirmation = async (email: string, data: any) => {
  const html = `
    <h2>Payment Confirmation</h2>
    <p>Thank you for your payment!</p>
    <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
    <p><strong>Subscription:</strong> ${data.subscription_type}</p>
    <p><strong>Status:</strong> ${data.status}</p>
    <hr />
    <p>Received at: ${new Date().toLocaleString()}</p>
  `;

  return sendEmail(email, 'Payment Confirmation', html);
};
