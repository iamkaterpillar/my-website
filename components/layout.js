async function loadLayout() {
  const layoutResponse = await fetch('/components/layout.html');
  const layoutHtml = await layoutResponse.text();
  
  // Get the current page's content
  const mainContent = document.querySelector('main').innerHTML;
  
  // Replace the content placeholder in the layout
  const finalHtml = layoutHtml.replace('{{content}}', mainContent);
  
  // Update the document
  document.documentElement.innerHTML = finalHtml;
  
  // Re-execute any scripts that were in the page
  const scripts = Array.from(document.getElementsByTagName('script'));
  scripts.forEach(script => {
    if (script.src && !script.src.includes('layout.js')) {
      const newScript = document.createElement('script');
      newScript.src = script.src;
      document.body.appendChild(newScript);
    }
  });
}

// Load the layout immediately
loadLayout(); 