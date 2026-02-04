const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://jayedbinladen471_db_user:dkCj2lyHRIxARn39@cluster0.fmidkg6.mongodb.net/importila?retryWrites=true&w=majority";
const dbName = "importila";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);

        console.log("--- Sample Product ---");
        const product = await db.collection('products').findOne({ purchasePrice: { $exists: true } });
        console.log(JSON.stringify(product, null, 2));

        console.log("\n--- Sample Delivered/Complete Order ---");
        const order = await db.collection('orders').findOne({
            status: { $regex: /delivered|complete/i }
        });
        console.log(JSON.stringify(order, null, 2));

        console.log("\n--- Order Statuses ---");
        const statuses = await db.collection('orders').distinct('status');
        console.log(statuses);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
run();
