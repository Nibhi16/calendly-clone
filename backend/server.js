const express = require('express');
const cors = require('cors');
const prisma = require('./utils/prismaClient');
const attachDefaultUser = require('./middleware/defaultUser');
const errorHandler = require('./utils/errorHandler');

const eventTypeRoutes = require('./routes/eventTypeRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const slotRoutes = require('./routes/slotRoutes');

const app = express();

// Basic configuration
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Middleware
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json());

// Attach default user for all "authenticated" routes
app.use(attachDefaultUser);

// Route registration
app.use('/event-types', eventTypeRoutes);
app.use('/availability', availabilityRoutes);
app.use('/bookings', bookingRoutes);
app.use('/slots', slotRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

