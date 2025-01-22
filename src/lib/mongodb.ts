import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const options = {};

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Add a custom property to the global interface for TypeScript
declare global {
  // This avoids conflicts with other global types
  // and ensures global._mongoClientPromise is correctly typed
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to persist the MongoDB client
  const globalWithMongoClientPromise = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient instance for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
