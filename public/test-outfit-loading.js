(function() {
  console.log('Outfit loading debug script initialized');
  
  // Track navigation events
  let lastEdit = '';
  
  // Monitor URL changes
  function checkForEditParam() {
    const url = new URL(window.location.href);
    const editId = url.searchParams.get('edit');
    
    if (editId && editId !== lastEdit) {
      console.log('URL edit parameter changed:', editId);
      lastEdit = editId;
      
      // Monitor network requests for this outfit
      monitorApiRequests(editId);
    }
  }
  
  // Monitor API requests related to outfit loading
  function monitorApiRequests(editId) {
    const origFetch = window.fetch;
    window.fetch = function(url, options) {
      const fetchPromise = origFetch.apply(this, arguments);
      
      if (url.toString().includes(`/api/outfits?id=${editId}`)) {
        console.log(`Intercepted fetch request for outfit ${editId}`);
        
        // Monitor the response
        fetchPromise.then(response => {
          console.log(`API response status for outfit ${editId}:`, response.status);
          return response.clone().json().then(data => {
            console.log(`API response data for outfit ${editId}:`, data);
          }).catch(err => {
            console.error('Error parsing API response:', err);
          });
        }).catch(err => {
          console.error('Error with API request:', err);
        });
      }
      
      return fetchPromise;
    };
  }
  
  // Set up listeners
  window.addEventListener('popstate', checkForEditParam);
  
  // Run initial check
  checkForEditParam();
  
  // Re-check every 500ms in case of client-side navigation
  setInterval(checkForEditParam, 500);
  
  console.log('Outfit loading debug monitoring active');
})(); 