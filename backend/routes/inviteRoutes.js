const express = require('express');
const router = express.Router();
const { sendInviteEmail } = require('../services/emailService');
const attachDefaultUser = require('../middleware/defaultUser');

router.post('/', attachDefaultUser, async (req, res, next) => {
  try {
    const { emails, accessLevel } = req.body;

    if (!emails || !emails.length) {
      return res.status(400).json({ message: 'No emails provided' });
    }

    await Promise.all(
      emails.map(email =>
        sendInviteEmail(
          email,
          accessLevel || 'Viewer',
          req.user.name || req.user.email
        )
      )
    );

    res.json({ message: 'Invitations sent successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;