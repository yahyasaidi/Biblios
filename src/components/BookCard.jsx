import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onEdit, onDelete, onStatusChange }) => {
  const renderStars = (note) => {
    if (!note) return null;
    
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <span 
            key={index} 
            className={index < note ? 'star filled' : 'star'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`book-card ${book.statut}`}>
      <div className="book-header">
        <h3 className="book-title">{book.titre}</h3>
        <span className={`status-badge ${book.statut}`}>
          {book.statut === 'lu' ? '✓ Lu' : '📖 À lire'}
        </span>
      </div>
      
      <div className="book-details">
        <p className="book-author"><strong>Auteur:</strong> {book.auteur}</p>
        <p className="book-year"><strong>Année:</strong> {book.annee}</p>
        
        {book.statut === 'lu' && book.note && (
          <div className="book-rating">
            <strong>Note: </strong>
            {renderStars(book.note)}
            <span className="note-value">({book.note}/5)</span>
          </div>
        )}
      </div>
      
      <div className="book-actions">
        <button 
          className="btn btn-status"
          onClick={() => onStatusChange(book.id, book.statut === 'lu' ? 'à lire' : 'lu')}
        >
          {book.statut === 'lu' ? '↶ Marquer à lire' : '✓ Marquer comme lu'}
        </button>
        
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(book)}
        >
          ✏️ Modifier
        </button>
        
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(book.id)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default BookCard;