import { ObjectId } from 'mongodb';

export class Book {
  constructor({ 
    _id = null, 
    titre, 
    auteur, 
    annee, 
    statut = 'à lire', 
    note = null,
    dateCreation = new Date(),
    dateModification = new Date()
  }) {
    this._id = _id ? new ObjectId(_id) : null;
    this.titre = titre;
    this.auteur = auteur;
    this.annee = parseInt(annee);
    this.statut = statut;
    this.note = note ? parseInt(note) : null;
    this.dateCreation = dateCreation;
    this.dateModification = dateModification;
  }

  toJSON() {
    return {
      id: this._id ? this._id.toString() : null,
      titre: this.titre,
      auteur: this.auteur,
      annee: this.annee,
      statut: this.statut,
      note: this.note,
      dateCreation: this.dateCreation,
      dateModification: this.dateModification
    };
  }

  static fromDocument(doc) {
    return new Book(doc);
  }
}