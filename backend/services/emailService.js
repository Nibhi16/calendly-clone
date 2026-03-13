const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function sendInviteEmail(toEmail, accessLevel, invitedBy) {
  await transporter.sendMail({
    from: `"MeetFlow" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `You've been invited to collaborate on MeetFlow`,
    html: `
      <h2>You've been invited!</h2>
      <p><strong>${invitedBy}</strong> has invited you to collaborate on MeetFlow as a <strong>${accessLevel}</strong>.</p>
      <p>Click below to get started:</p>
      <a href="${process.env.FRONTEND_URL}" style="background:#4f46e5;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Accept Invitation
      </a>
    `
  });
}

module.exports = { sendInviteEmail };