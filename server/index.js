const express=require('express');
const dotenv=require('dotenv');
const cors = require('cors');
const mongoose=require('mongoose');
const Event = require('./models/Event');
const authRoutes=require('./routes/auth.js');
const eventRoutes=require('./routes/event.js');
const bookingRoutes=require('./routes/booking.js');
dotenv.config(); 
const app=express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT= process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const migration = await Event.collection.updateMany(
            {
                $or: [
                    { totalSeates: { $exists: true } },
                    { availavleSeats: { $exists: true } }
                ]
            },
            [
                {
                    $set: {
                        totalSeats: { $ifNull: ['$totalSeats', '$totalSeates'] },
                        availableSeats: { $ifNull: ['$availableSeats', '$availavleSeats'] }
                    }
                },
                { $unset: ['totalSeates', 'availavleSeats'] }
            ]
        );
        if (migration.modifiedCount > 0) {
            console.log(`Updated seat fields for ${migration.modifiedCount} existing events`);
        }
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

startServer();