require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailSMTP() {
  console.log('📧 Testing Gmail SMTP Configuration...');
  console.log('========================================');
  console.log(`📤 SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`📤 SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`📤 SMTP User: ${process.env.SMTP_USER}`);
  console.log(`📤 SMTP From: ${process.env.SMTP_FROM}`);
  console.log('========================================\n');

  // Create transporter with Gmail settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // 1. Verify SMTP Connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully!\n');

    // 2. Send Test Email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'rautraynikhil6@gmail.com', // Apni email
      subject: '✅ Gmail SMTP Test - MahaProps',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f0f4ff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1a56db, #2563eb); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .success { color: #16a34a; font-weight: bold; font-size: 24px; }
            .detail { background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #1a56db; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
            .badge { display: inline-block; background: #16a34a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 MahaProps</h1>
              <p style="margin: 0; opacity: 0.9;">Real Estate Platform</p>
            </div>
            <div class="content">
              <p class="success">✅ Test Email Successful!</p>
              <p>Your Gmail SMTP configuration is working perfectly.</p>
              
              <div class="detail">
                <h4 style="margin: 0 0 10px 0;">📧 Email Details:</h4>
                <p><strong>From:</strong> ${process.env.SMTP_FROM}</p>
                <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
                <p><strong>Port:</strong> ${process.env.SMTP_PORT}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><span class="badge">GMAIL SMTP</span> <span class="badge">✅ ACTIVE</span></p>
              </div>
              
              <p style="margin-top: 20px;">🎉 You have successfully migrated from Brevo to Gmail SMTP!</p>
              <p style="color: #666; font-size: 14px;">This is an automated test email from your MahaProps application.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MahaProps Real Estate. All rights reserved.</p>
              <p style="margin: 0; font-size: 10px; color: #9ca3af;">Powered by Node.js & Gmail SMTP</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('========================================');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📨 Response: ${info.response}`);
    console.log(`📬 Email sent to: rautraynikhil6@gmail.com`);
    console.log('========================================');
    console.log('🎉 Gmail SMTP Configuration Complete!');

  } catch (error) {
    console.error('❌ Test failed!');
    console.error('========================================');
    console.error(`Error: ${error.message}`);
    console.error('========================================');
    
    // Troubleshooting tips
    console.log('\n💡 Troubleshooting Tips:');
    if (error.message.includes('Invalid login')) {
      console.log('   → Check your App Password. Make sure it has spaces: "dsvc piii snup fcmb"');
      console.log('   → Try removing quotes from SMTP_PASS in .env file');
    } else if (error.message.includes('535')) {
      console.log('   → 2-Step Verification is OFF. Turn it ON and generate new App Password.');
      console.log('   → Visit: https://myaccount.google.com/apppasswords');
    } else if (error.message.includes('timeout')) {
      console.log('   → Check your internet connection');
      console.log('   → Port 587 might be blocked. Try port 465 with secure: true');
    } else if (error.message.includes('connection')) {
      console.log('   → Check if port 587 is open in your firewall');
      console.log('   → Try using port 465 instead');
    } else if (error.message.includes('self-signed')) {
      console.log('   → Already handled with rejectUnauthorized: false');
    } else {
      console.log('   → Check your .env file for correct values');
      console.log('   → Make sure nodemailer is installed: npm install nodemailer');
    }
  }
}

// Run the test
testGmailSMTP();