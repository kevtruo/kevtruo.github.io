// Simple Search Functionality
(function() {
  const searchToggle = document.getElementById('search-toggle');
  const body = document.body;
  
  // Create search overlay
  const searchOverlay = document.createElement('div');
  searchOverlay.id = 'search-overlay';
  searchOverlay.className = 'search-overlay';
  searchOverlay.innerHTML = `
    <div class="search-container">
      <div class="search-header">
        <input type="text" id="search-input" placeholder="Search posts..." autocomplete="off">
        <button id="search-close" aria-label="Close search">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div id="search-results" class="search-results"></div>
    </div>
  `;
  body.appendChild(searchOverlay);
  
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchClose = document.getElementById('search-close');
  
  let posts = [];
  
  // Fetch posts data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      posts = data;
    })
    .catch(error => console.error('Error loading search data:', error));
  
  // Toggle search overlay
  function toggleSearch() {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
      searchInput.focus();
      body.style.overflow = 'hidden';
    } else {
      searchInput.value = '';
      searchResults.innerHTML = '';
      body.style.overflow = '';
    }
  }
  
  searchToggle.addEventListener('click', toggleSearch);
  searchClose.addEventListener('click', toggleSearch);
  
  // Close on overlay click
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) {
      toggleSearch();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      toggleSearch();
    }
  });
  
  // Search functionality
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = posts.filter(post => {
      return post.title.toLowerCase().includes(query) ||
             post.content.toLowerCase().includes(query) ||
             post.category.toLowerCase().includes(query) ||
             post.tags.some(tag => tag.toLowerCase().includes(query));
    });
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No posts found</div>';
      return;
    }
    
    searchResults.innerHTML = results.map(post => `
      <a href="${post.url}" class="search-result">
        <div class="search-result-meta">
          <time>${post.date}</time>
          <span class="search-result-category">${post.category}</span>
        </div>
        <h3>${highlightQuery(post.title, query)}</h3>
        <p>${highlightQuery(truncate(post.content, 150), query)}</p>
      </a>
    `).join('');
  });
  
  function highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
  }
})();
