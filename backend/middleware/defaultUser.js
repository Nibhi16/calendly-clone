const prisma = require('../utils/prismaClient');

// Very simple "auth": always attach the first user as req.user.
// In a real app, you'd replace this with proper authentication.
async function attachDefaultUser(req, res, next) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(500).json({
        message: 'No default user found. Run the seed script first.'
      });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = attachDefaultUser;

