import mongoose from 'mongoose';

async function connectDB() {
  const dbUri =
    process.env.NODE_ENV === 'development'
      ? process.env.DATABASE_URI_DEV
      : process.env.DATABASE_URI_PROD;

  if (!dbUri) {
    throw new Error('Database URI is not defined');
  }

  try {
    const connection = await mongoose.connect(dbUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
    } else {
      console.error('Error connecting to MongoDB:', error);
    }
    process.exit(1);
  }
}

export default connectDB;
