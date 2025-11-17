import { ObjectId } from 'mongodb';
import database from '../config/database.js';
import { Book } from '../models/Book.js';

class BookController {
  async getAllBooks(req, res) {
    try {
      const collection = database.getCollection('books');
      const books = await collection.find({}).sort({ dateCreation: -1 }).toArray();
      const booksDTO = books.map(book => Book.fromDocument(book).toJSON());
      res.json(booksDTO);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getBookById(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID invalide' });

      const collection = database.getCollection('books');
      const book = await collection.findOne({ _id: new ObjectId(id) });
      if (!book) return res.status(404).json({ error: 'Livre non trouvé' });

      res.json(Book.fromDocument(book).toJSON());
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async createBook(req, res) {
    try {
      const { titre, auteur, annee, statut = 'à lire', note = null } = req.body;
      if (!titre || !auteur || !annee) {
        return res.status(400).json({ error: 'Titre, auteur et année obligatoires' });
      }

      const newBook = new Book({ titre, auteur, annee, statut, note });
      const collection = database.getCollection('books');
      const result = await collection.insertOne(newBook);
      
      newBook._id = result.insertedId;
      res.status(201).json(newBook.toJSON());
    } catch (error) {
      res.status(500).json({ error: 'Erreur création livre' });
    }
  }

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID invalide' });

      const collection = database.getCollection('books');
      const existingBook = await collection.findOne({ _id: new ObjectId(id) });
      if (!existingBook) return res.status(404).json({ error: 'Livre non trouvé' });

      const { titre, auteur, annee, statut, note } = req.body;
      const updateData = {
        ...(titre && { titre }),
        ...(auteur && { auteur }),
        ...(annee && { annee: parseInt(annee) }),
        ...(statut && { statut }),
        ...(note !== undefined && { note: note ? parseInt(note) : null }),
        dateModification: new Date()
      };

      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      const updatedBook = await collection.findOne({ _id: new ObjectId(id) });
      res.json(Book.fromDocument(updatedBook).toJSON());
    } catch (error) {
      res.status(500).json({ error: 'Erreur mise à jour' });
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID invalide' });

      const collection = database.getCollection('books');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Livre non trouvé' });

      res.json({ message: 'Livre supprimé' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur suppression' });
    }
  }

  async getStats(req, res) {
    try {
      const collection = database.getCollection('books');
      const total = await collection.countDocuments();
      const lus = await collection.countDocuments({ statut: 'lu' });
      const aLire = await collection.countDocuments({ statut: 'à lire' });
      
      const booksAvecNotes = await collection.find({ statut: 'lu', note: { $ne: null } }).toArray();
      const moyenneNote = booksAvecNotes.length > 0 
        ? booksAvecNotes.reduce((sum, book) => sum + book.note, 0) / booksAvecNotes.length 
        : 0;

      res.json({
        total,
        lus,
        aLire,
        moyenneNote: Math.round(moyenneNote * 10) / 10
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur statistiques' });
    }
  }
}

export default new BookController();