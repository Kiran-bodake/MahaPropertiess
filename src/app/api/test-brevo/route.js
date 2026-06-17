import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request) {
  console.log('Test Brevo endpoint called');
  
  // Get SMTP configuration from environment variables
  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  console.log('SMTP Host:', smtpConfig.host);
  console.log('SMTP User:', smtpConfig.auth.user);
  console.log('SMTP Port:', smtpConfig.port);

  const transporter = nodemailer.createTransport(smtpConfig);

  try {
    // Test the connection
    console.log('Testing connection to Brevo...');
    await transporter.verify();
    console.log('✅ Brevo connection successful!');

    // Send a test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'rautraynikhil6@gmail.com', // Change this to your email
      subject: '✅ Brevo Test Email - MahaProps Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #4F46E5; border-radius: 10px;">
          <div style="background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px;">
            <h2 style="margin: 0;">✅ Email System Working!</h2>
          </div>
          <div style="padding: 20px;">
            <p>Your Brevo SMTP configuration is correct!</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Provider:</strong> Brevo (Sendinblue)</p>
            <hr />
            <p style="color: #666; font-size: 12px;">MahaProps Lead Management System</p>
          </div>
        </div>
      `,
    });

    console.log('Email sent! Message ID:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      messageId: info.messageId,
      details: {
        from: process.env.SMTP_FROM,
        to: 'rautraynikhil6@gmail.com',
        provider: 'Brevo'
      }
    });

  } catch (error) {
    console.error('Brevo Error:', error);
    
    // Provide helpful error messages
    let errorMessage = error.message;
    let solution = '';
    
    if (errorMessage.includes('sender')) {
      solution = 'Verify your sender email in Brevo dashboard → Senders section';
    } else if (errorMessage.includes('auth')) {
      solution = 'Check your SMTP key in Brevo dashboard → SMTP & API section';
    } else if (errorMessage.includes('ECONNREFUSED')) {
      solution = 'Check your internet connection and firewall settings (port 587)';
    } else if (errorMessage.includes('getaddrinfo')) {
      solution = 'DNS error - check if smtp-relay.brevo.com is correct';
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      solution: solution,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? '***hidden***' : 'missing',
        from: process.env.SMTP_FROM
      }
    }, { status: 500 });
  }
}