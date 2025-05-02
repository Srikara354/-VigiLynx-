import React, { useState, useEffect } from 'react';
import './CybersecurityNews.css';

const CyberNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of news items per page

  // Use the News API directly instead of going through a backend
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const NEWS_API_URL = `https://newsapi.org/v2/everything?q=cybersecurity&apiKey=${API_KEY}&pageSize=30&language=en&sortBy=publishedAt`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch news');
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'API returned an error');
        }
        
        const formattedNews = data.articles.map((article, index) => ({
          id: index,
          title: article.title,
          summary: article.description || 'No summary available',
          image: article.urlToImage || `https://via.placeholder.com/300x120.png?text=Cyber+News+${index + 1}`,
          link: article.url,
          date: new Date(article.publishedAt).toLocaleDateString()
        }));
        
        setNewsItems(formattedNews);
        setLoading(false);
      } catch (err) {
        console.error('News API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [NEWS_API_URL]);

  // Calculate pagination
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = newsItems.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Fetching Cybersecurity Updates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="news-page">
      {/* Header */}
      <header className="header">
        <h1>CyberWatch News</h1>
        <p>Global Cybersecurity Updates at Your Fingertips</p>
      </header>

      {/* Main Content */}
      <main className="news-grid">
        {paginatedItems.map((item) => (
          <article key={item.id} className="news-card">
            <div className="image-container">
              <img 
                src={item.image}
                alt={item.title}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x120.png?text=News+Image'; }}
              />
            </div>
            <div className="content">
              <h2>{item.title}</h2>
              <p className="summary">{item.summary}</p>
              <div className="meta">
                <span className="date">{item.date}</span>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 CyberWatch News | Updated Feb 27, 2025</p>
      </footer>
    </div>
  );
};

export default CyberNews;