import express from 'express';
import cors from 'cors';
import database from './config/database.js';
import bookController from './controllers/bookController.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes API
app.get('/api/books', bookController.getAllBooks);
app.get('/api/books/:id', bookController.getBookById);
app.post('/api/books', bookController.createBook);
app.put('/api/books/:id', bookController.updateBook);
app.delete('/api/books/:id', bookController.deleteBook);
app.get('/api/stats', bookController.getStats);

// Route santé
app.get('/api/health', async (req, res) => {
  try {
    const collection = database.getCollection('books');
    const count = await collection.countDocuments();
    res.json({ 
      status: 'OK', 
      database: 'MongoDB',
      totalBooks: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// Données d'exemple
app.post('/api/init-sample', async (req, res) => {
  try {
    const collection = database.getCollection('books');
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ error: 'Base déjà peuplée' });
    }

    const sampleBooks = [
      {
        titre: "L'Étranger",
        auteur: "Albert Camus",
        annee: 1942,
        statut: "lu",
        note: 5,
        dateCreation: new Date(),
        dateModification: new Date()
      },
      {
        titre: "1984",
        auteur: "George Orwell",
        annee: 1949,
        statut: "à lire",
        note: null,
        dateCreation: new Date(),
        dateModification: new Date()
      },
      {
        titre: "Le Petit Prince",
        auteur: "Antoine de Saint-Exupéry",
        annee: 1943,
        statut: "lu",
        note: 4,
        dateCreation: new Date(),
        dateModification: new Date()
      }
    ];

    const result = await collection.insertMany(sampleBooks);
    res.json({ message: `${result.insertedCount} livres ajoutés` });
  } catch (error) {
    res.status(500).json({ error: 'Erreur initialisation' });
  }
});

// Démarrer le serveur
async function startServer() {
  try {
    await database.connect();
    app.listen(PORT, () => {
      console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer:', error);
  }
}

startServer();