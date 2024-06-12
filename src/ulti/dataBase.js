const mongoDb = require('mongodb');
const mongoose = require('mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');

async function connect() {
	const NODE_ENV = process.env.NODE_ENV;
	const MONGO_USER = process.env.MONGO_USER;
	const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
	const MONGO_DATABASE = process.env.MONGO_DATABASE;
	//eLK0gO2Urefu88KF
	//LzIvbyd711vsJSyQ
	//FiocogoFiCmy6OhN:nodeexxp
	// const uri = `mongodb+srv://nguyenvantai566:LzIvbyd711vsJSyQ@cluster0.rfhibt5.mongodb.net/`;
	// const uri = `mongodb+srv://nguyenvantai566:FiocogoFiCmy6OhN@cluster0.fyheja6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
	// const client = new MongoClient(uri);
	try {
		await mongoose.connect(
			`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.fyheja6.mongodb.net/${MONGO_DATABASE}`,
			{}
		);
		// await mongoose.connect(uri);
		console.log('connect successfully');
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
	}
}
module.exports = { connect };
