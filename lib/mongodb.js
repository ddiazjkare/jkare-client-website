import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable in .env.local file');
}

/**
 * Global connection cache for Next.js
 * Prevents multiple connections during hot reloading in development
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with proper error handling
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDatabase() {
    // Return existing connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // Wait for pending connection
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering for immediate errors
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('✅ MongoDB Connected Successfully');
                return mongoose;
            })
            .catch((error) => {
                cached.promise = null; // Reset promise on failure
                console.error('❌ MongoDB connection error:', error.message);
                throw error; // Propagate error instead of crashing
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

// Set up connection event handlers
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});

// Graceful shutdown
if (process.env.NODE_ENV !== 'production') {
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    });
}

// Initialize connection
connectDatabase().catch((error) => {
    console.error('Failed to initialize MongoDB connection:', error.message);
});

export default mongoose;
export { connectDatabase };