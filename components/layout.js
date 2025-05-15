async function loadLayout() {
  const layoutResponse = await fetch('/components/layout.html');
  const layoutHtml = await layoutResponse.text();
  
  // Get the current page's content
  const mainContent = document.querySelector('main').innerHTML;
  
  // Replace the content placeholder in the layout
  const finalHtml = layoutHtml.replace('{{content}}', mainContent);
  
  // Update the document
  document.documentElement.innerHTML = finalHtml;
  
  // Reattach event listeners
  document.querySelector('script').addEventListener('load', () => {
    if (typeof initPage === 'function') {
      initPage();
    }
  });
}

// Load the layout when the DOM is ready
document.addEventListener('DOMContentLoaded', loadLayout); 