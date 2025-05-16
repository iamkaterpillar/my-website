async function loadLayout() {
  try {
    // Load layout
    const layoutResponse = await fetch('/components/layout.html');
    const layoutHtml = await layoutResponse.text();
    
    // Get the current page's content
    const mainContent = document.querySelector('main').innerHTML;
    
    // Create a temporary container to parse the layout HTML
    const temp = document.createElement('template');
    temp.innerHTML = layoutHtml;
    
    // Replace the content placeholder
    const mainElement = temp.content.querySelector('main');
    if (mainElement) {
      mainElement.innerHTML = mainContent;
    }

    // Store references to important elements
    const currentHead = document.head;
    const currentCss = document.querySelector('link[rel="stylesheet"]');
    const currentFavicon = document.querySelector('link[rel="icon"]');
    
    // Update the document with new layout
    document.documentElement.innerHTML = temp.innerHTML;
    
    // Restore critical head elements
    if (currentCss) {
      document.head.appendChild(currentCss);
    }
    if (currentFavicon) {
      document.head.appendChild(currentFavicon);
    }

    // Re-execute scripts
    const scripts = Array.from(document.getElementsByTagName('script'));
    const scriptPromises = scripts.map(script => {
      return new Promise((resolve, reject) => {
        // Skip if it's an analytics script
        if (script.src && script.src.includes('googletagmanager.com')) {
          resolve();
          return;
        }

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
  } catch (error) {
    console.error('Error loading layout:', error);
  }
}

// Execute layout loading
document.addEventListener('DOMContentLoaded', loadLayout); 