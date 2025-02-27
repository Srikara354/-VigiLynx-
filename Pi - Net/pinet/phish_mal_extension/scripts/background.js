// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_URL') {
    const url = request.url;

    fetch(`http://localhost:5000/api/scan?input=${encodeURIComponent(url)}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        sendResponse({ isSafe: data.isSafe, message: data.geminiInsights });
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ isSafe: true, message: 'Error checking URL' });
      });

    return true;
  }
});