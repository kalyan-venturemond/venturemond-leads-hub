// Test MongoDB connection
import { MongoClient } from 'mongodb';

const uri = "mongodb://kalyanguraka7_db_user:QBxs3rYxTR5D0LTD@ac-ghnoq6a-shard-00-00.hytigun.mongodb.net:27017,ac-ghnoq6a-shard-00-01.hytigun.mongodb.net:27017,ac-ghnoq6a-shard-00-02.hytigun.mongodb.net:27017/venturemond?ssl=true&authSource=admin&retryWrites=true&w=majority";


async function testConnection() {
    console.log('🔄 Testing MongoDB connection...');

    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');

        const db = client.db('venturemond');
        const collection = db.collection('contacts');

        const count = await collection.countDocuments();
        console.log(`📊 Found ${count} contacts in the database`);

        const sampleLead = await collection.findOne({});
        console.log('📝 Sample lead:', JSON.stringify(sampleLead, null, 2));

        await client.close();
        console.log('✅ Connection test complete!');
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
