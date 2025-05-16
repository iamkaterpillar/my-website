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
  const scriptPromises = scripts.map(script => {
    return new Promise((resolve, reject) => {
      const newScript = document.createElement('script');
      
      // Copy all attributes
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy inline script content
      if (!script.src) {
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
        resolve();
      } else if (!script.src.includes('layout.js')) {
        // For external scripts, wait for them to load
        newScript.onload = resolve;
        newScript.onerror = reject;
        document.body.appendChild(newScript);
      } else {
        resolve();
      }
    });
  });

  // Wait for all scripts to load
  await Promise.all(scriptPromises);

  // Dispatch event to notify scripts that layout is ready
  window.dispatchEvent(new Event('layoutLoaded'));
}

// Load layout immediately
loadLayout(); 