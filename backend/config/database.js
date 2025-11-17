import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.uri = process.env.MONGODB_URI;
  }

  async connect() {
    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log('✅ Connecté à MongoDB');
      
      await this.db.collection('books').createIndex({ titre: 'text', auteur: 'text' });
      return this.db;
    } catch (error) {
      console.error('❌ Erreur MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  getCollection(collectionName) {
    if (!this.db) throw new Error('Database not connected');
    return this.db.collection(collectionName);
  }
}

export default new Database();