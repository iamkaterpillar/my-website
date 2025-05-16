async function loadLayout() {
  const layoutResponse = await fetch('/components/layout.html');
  const layoutHtml = await layoutResponse.text();
  
  // Get the current page's content
  const mainContent = document.querySelector('main').innerHTML;
  
  // Replace the content placeholder in the layout
  const finalHtml = layoutHtml.replace('{{content}}', mainContent);
  
  // Update the document
  document.documentElement.innerHTML = finalHtml;
  
  // Re-execute all scripts
  const scripts = Array.from(document.getElementsByTagName('script'));
  scripts.forEach(script => {
    const newScript = document.createElement('script');
    
    // Copy all attributes
    Array.from(script.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    
    // Copy inline script content
    if (!script.src) {
      newScript.textContent = script.textContent;
    }
    
    // Don't re-add layout.js to avoid infinite loop
    if (!script.src || !script.src.includes('layout.js')) {
      document.body.appendChild(newScript);
    }
  });
}

// Wait for DOM to be ready before loading layout
document.addEventListener('DOMContentLoaded', loadLayout); 