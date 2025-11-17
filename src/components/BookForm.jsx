import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titre: '',
    auteur: '',
    annee: '',
    statut: 'à lire',
    note: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        titre: book.titre || '',
        auteur: book.auteur || '',
        annee: book.annee || '',
        statut: book.statut || 'à lire',
        note: book.note || ''
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
    }
    
    if (!formData.auteur.trim()) {
      newErrors.auteur = "L'auteur est obligatoire";
    }
    
    if (!formData.annee) {
      newErrors.annee = "L'année est obligatoire";
    } else if (formData.annee < 1000 || formData.annee > new Date().getFullYear()) {
      newErrors.annee = `L'année doit être entre 1000 et ${new Date().getFullYear()}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData = {
      ...formData,
      annee: parseInt(formData.annee),
      note: formData.note ? parseInt(formData.note) : null
    };

    onSubmit(submitData);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h3>{book ? '✏️ Modifier le livre' : '➕ Ajouter un nouveau livre'}</h3>
      
      <div className="form-group">
        <label htmlFor="titre">Titre *</label>
        <input
          type="text"
          id="titre"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          className={errors.titre ? 'error' : ''}
          placeholder="Entrez le titre du livre"
        />
        {errors.titre && <span className="error-message">{errors.titre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="auteur">Auteur *</label>
        <input
          type="text"
          id="auteur"
          name="auteur"
          value={formData.auteur}
          onChange={handleChange}
          className={errors.auteur ? 'error' : ''}
          placeholder="Entrez le nom de l'auteur"
        />
        {errors.auteur && <span className="error-message">{errors.auteur}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="annee">Année de publication *</label>
        <input
          type="number"
          id="annee"
          name="annee"
          value={formData.annee}
          onChange={handleChange}
          className={errors.annee ? 'error' : ''}
          min="1000"
          max={new Date().getFullYear()}
          placeholder="Ex: 2024"
        />
        {errors.annee && <span className="error-message">{errors.annee}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="statut">Statut de lecture</label>
        <select
          id="statut"
          name="statut"
          value={formData.statut}
          onChange={handleChange}
        >
          <option value="à lire">📖 À lire</option>
          <option value="lu">✓ Lu</option>
        </select>
      </div>

      {formData.statut === 'lu' && (
        <div className="form-group">
          <label htmlFor="note">Note</label>
          <select
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
          >
            <option value="">Sans note</option>
            <option value="1">⭐ 1 étoile</option>
            <option value="2">⭐⭐ 2 étoiles</option>
            <option value="3">⭐⭐⭐ 3 étoiles</option>
            <option value="4">⭐⭐⭐⭐ 4 étoiles</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 étoiles</option>
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {book ? '💾 Mettre à jour' : '➕ Ajouter le livre'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          ❌ Annuler
        </button>
      </div>
    </form>
  );
};

export default BookForm;