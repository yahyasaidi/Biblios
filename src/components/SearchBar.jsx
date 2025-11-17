import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, filterStatus, onFilterChange, stats }) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-group">
          <label htmlFor="search">🔍 Rechercher</label>
          <input
            type="text"
            id="search"
            placeholder="Rechercher par titre ou auteur..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter">📊 Filtrer par statut</label>
          <select
            id="filter"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="all">Tous les livres ({stats?.total || 0})</option>
            <option value="lu">Livres lus ({stats?.lus || 0})</option>
            <option value="à lire">Livres à lire ({stats?.aLire || 0})</option>
          </select>
        </div>
      </div>
      
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{color: '#4CAF50'}}>{stats.lus}</span>
            <span className="stat-label">Lus</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{color: '#FF9800'}}>{stats.aLire}</span>
            <span className="stat-label">À lire</span>
          </div>
          {stats.moyenneNote > 0 && (
            <div className="stat-item">
              <span className="stat-number" style={{color: '#FFC107'}}>
                {stats.moyenneNote}
              </span>
              <span className="stat-label">Moyenne</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;