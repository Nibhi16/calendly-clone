require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./utils/prismaClient');
const attachDefaultUser = require('./middleware/defaultUser');
const errorHandler = require('./utils/errorHandler');

const eventTypeRoutes = require('./routes/eventTypeRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const slotRoutes = require('./routes/slotRoutes');
const inviteRoutes = require('./routes/inviteRoutes'); 

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use(attachDefaultUser);

app.use('/event-types', eventTypeRoutes);
app.use('/availability', availabilityRoutes);
app.use('/bookings', bookingRoutes);
app.use('/slots', slotRoutes);
app.use('/invite', inviteRoutes); 

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});