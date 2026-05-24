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
  let searchDataLoaded = false;

  // Fetch posts data lazily when search is first opened
  function loadSearchData() {
    if (searchDataLoaded) return Promise.resolve();

    return fetch('/search.json', {
      cache: 'force-cache' // Use browser cache when available
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to load search data');
        return response.json();
      })
      .then(data => {
        posts = data;
        searchDataLoaded = true;
      })
      .catch(error => {
        console.error('Error loading search data:', error);
        searchResults.innerHTML = '<div class="no-results">Search temporarily unavailable</div>';
      });
  }

  // Toggle search overlay
  function toggleSearch() {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
      searchInput.focus();
      body.style.overflow = 'hidden';
      // Load search data when overlay opens (lazy loading)
      loadSearchData();
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

  // Search functionality with debouncing for performance
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();

    // Clear previous timeout
    clearTimeout(searchTimeout);

    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    // Debounce search to avoid excessive filtering
    searchTimeout = setTimeout(() => {
      if (!searchDataLoaded) {
        searchResults.innerHTML = '<div class="no-results">Loading search...</div>';
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

    // Use textContent and createElement for safer DOM manipulation
    searchResults.innerHTML = '';
    results.forEach(post => {
      const resultLink = document.createElement('a');
      resultLink.href = post.url;
      resultLink.className = 'search-result';

      const meta = document.createElement('div');
      meta.className = 'search-result-meta';

      const time = document.createElement('time');
      time.textContent = post.date;
      meta.appendChild(time);

      const category = document.createElement('span');
      category.className = 'search-result-category';
      category.textContent = post.category;
      meta.appendChild(category);

      const title = document.createElement('h3');
      title.innerHTML = highlightQuery(post.title, query);

      const content = document.createElement('p');
      content.innerHTML = highlightQuery(truncate(post.content, 150), query);

      resultLink.appendChild(meta);
      resultLink.appendChild(title);
      resultLink.appendChild(content);
      searchResults.appendChild(resultLink);
    });
    }, 150); // 150ms debounce delay
  });

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function highlightQuery(text, query) {
    // Escape the text first, then escape the query for regex
    const escapedText = escapeHtml(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  }
  
  function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
  }
})();
