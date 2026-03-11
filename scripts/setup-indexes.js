import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Load environment variables manually from .env and .env.local
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), ".env.local")
];

envPaths.forEach(envPath => {
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
});

async function setupIndexes() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    const db = client.db("importila"); // Change this if your DB name differs

    console.log("Creating indexes...");

    // Create indexes manually here
    await db.collection("products").createIndex({ category: 1 });
    await db.collection("products").createIndex({ name: "text" });
    await db.collection("orders").createIndex({ createdAt: -1 });
    await db.collection("orders").createIndex({ status: 1 });
    await db.collection("daily_sales").createIndex({ date: -1 });
    await db.collection("sliders").createIndex({ location: 1 }, { unique: true });
    await db.collection("users").createIndex({ username: 1 }, { unique: true });

    console.log("Successfully created all indexes!");
  } catch (error) {
    console.error("Failed to create indexes:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB server");
  }
}

setupIndexes();
