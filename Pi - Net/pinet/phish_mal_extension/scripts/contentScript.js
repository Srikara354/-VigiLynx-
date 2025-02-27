// contentScript.js
document.addEventListener('click', async (e) => {
  const link = e.target.closest('a');
  if (link) {
    const url = link.href;

    if (!url || url.startsWith('javascript:')) {
      console.log('Skipping invalid URL:', url);
      return;
    }

    e.preventDefault(); // Block navigation immediately
    console.log('Link clicked:', url);

    chrome.runtime.sendMessage({ type: 'CHECK_URL', url }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        return;
      }

      if (response && !response.isSafe) {
        alert(`⚠️ Unsafe URL! ${response.message}`);
      } else {
        alert('✅ Safe URL! Redirecting...');
        window.location.href = url;
      }
    });
  }
});