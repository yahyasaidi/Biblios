import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import SearchBar from '../components/SearchBar';
import { bookService } from '../services/api';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    checkServerStatus();
  }, []);

  useEffect(() => {
    if (serverStatus === 'connected') {
      loadBooks();
      loadStats();
    }
  }, [serverStatus]);

  useEffect(() => {
    const filtered = books.filter(book => {
      const matchesSearch = book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.auteur.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || book.statut === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
    
    setFilteredBooks(filtered);
  }, [books, searchTerm, filterStatus]);

  const checkServerStatus = async () => {
    try {
      await bookService.healthCheck();
      setServerStatus('connected');
      setError('');
    } catch (err) {
      setServerStatus('disconnected');
      setError('❌ Serveur non disponible. Vérifiez que le backend est démarré sur le port 5000.');
      setLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
      setError('');
    } catch (err) {
      setError('❌ Erreur lors du chargement des livres');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await bookService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleCreateBook = async (bookData) => {
    try {
      await bookService.createBook(bookData);
      await loadBooks();
      await loadStats();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('❌ Erreur lors de la création du livre');
      console.error('Error creating book:', err);
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      await bookService.updateBook(editingBook.id, bookData);
      await loadBooks();
      await loadStats();
      setEditingBook(null);
      setError('');
    } catch (err) {
      setError('❌ Erreur lors de la mise à jour du livre');
      console.error('Error updating book:', err);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.')) {
      try {
        await bookService.deleteBook(id);
        await loadBooks();
        await loadStats();
        setError('');
      } catch (err) {
        setError('❌ Erreur lors de la suppression du livre');
        console.error('Error deleting book:', err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookService.updateBook(id, { statut: newStatus });
      await loadBooks();
      await loadStats();
      setError('');
    } catch (err) {
      setError('❌ Erreur lors du changement de statut');
      console.error('Error updating status:', err);
    }
  };

  const handleInitSampleData = async () => {
    try {
      await bookService.initSampleData();
      await loadBooks();
      await loadStats();
      setError('');
    } catch (err) {
      setError('❌ Erreur lors de l\'initialisation des données');
      console.error('Error initializing data:', err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleFormSubmit = (bookData) => {
    if (editingBook) {
      handleUpdateBook(bookData);
    } else {
      handleCreateBook(bookData);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handleRetry = () => {
    checkServerStatus();
  };

  if (serverStatus === 'checking') {
    return (
      <div className="home">
        <div className="loading-fullscreen">
          <div className="spinner-large"></div>
          <p>Connexion au serveur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="app-header">
        <div className="header-content">
          <h1> 📚 Biblios </h1>
          <p>Gérez votre collection de livres avec MongoDB</p>
          <div className={`server-status ${serverStatus}`}>
            {serverStatus === 'connected' ? '✅ Connecté à MongoDB' : '❌ Serveur déconnecté'}
          </div>
        </div>
      </header>

      <div className="main-content">
        {error && (
          <div className="error-message">
            {error}
            <button className="btn-retry" onClick={handleRetry}>
              🔄 Réessayer
            </button>
          </div>
        )}

        <div className="content-section">
          <div className="action-buttons">
            {!showForm && !editingBook && (
              <button 
                className="btn btn-primary add-book-btn"
                onClick={() => setShowForm(true)}
              >
                ➕ Ajouter un nouveau livre
              </button>
            )}
            
            {books.length === 0 && (
              <button 
                className="btn btn-secondary"
                onClick={handleInitSampleData}
              >
                📥 Charger des livres d'exemple
              </button>
            )}
          </div>

          {(showForm || editingBook) && (
            <BookForm
              book={editingBook}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}

          {books.length > 0 && (
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              stats={stats}
            />
          )}

          <div className="books-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement de votre bibliothèque...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="empty-state">
                {books.length === 0 ? (
                  <>
                    <div className="empty-icon">📚</div>
                    <h3>Votre bibliothèque est vide</h3>
                    <p>Commencez par ajouter votre premier livre ou chargez des exemples !</p>
                    <div className="empty-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                      >
                        Ajouter mon premier livre
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleInitSampleData}
                      >
                        Charger des exemples
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="empty-icon">🔍</div>
                    <h3>Aucun livre trouvé</h3>
                    <p>Aucun livre ne correspond à votre recherche. Essayez d'autres termes.</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                    >
                      Voir tous les livres
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <h2 className="section-title">
                  {filteredBooks.length === books.length 
                    ? `Ma Collection (${books.length} livre${books.length > 1 ? 's' : ''})`
                    : `Résultats (${filteredBooks.length} livre${filteredBooks.length > 1 ? 's' : ''})`
                  }
                </h2>
                <div className="books-grid">
                  {filteredBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onEdit={handleEdit}
                      onDelete={handleDeleteBook}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;