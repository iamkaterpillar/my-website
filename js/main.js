// Unregister service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// Initialize everything after layout is loaded
window.addEventListener('layoutLoaded', () => {
  console.log('Layout loaded, initializing features...');
  
  // Mobile menu functionality
  initMobileMenu();
  
  // Blog functionality
  initBlogPosts();
  
  // Post content functionality
  initPostContent();
});

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) {
    console.log('Mobile menu elements not found');
    return;
  }
  
  console.log('Mobile menu elements found, setting up listeners...');
  
  // Prevent any click inside the menu from bubbling up
  navLinks.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Toggle menu when clicking the button
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });

  function toggleMenu() {
    const isOpen = navLinks.classList.contains('active');
    console.log('Toggling menu:', isOpen ? 'closing' : 'opening');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    menuToggle.classList.add('active');
    navLinks.classList.add('active');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    console.log('Menu opened');
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    console.log('Menu closed');
  }
}

function initBlogPosts() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  // Clear existing posts before loading new ones
  blogGrid.innerHTML = '';

  fetch("/data/posts.json")
    .then(response => response.json())
    .then(posts => {
      // Sort posts by date (most recent first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Filter posts based on current page
      const currentPath = window.location.pathname.replace(/^\/+|\/+$|\.[^/.]+$/g, '');
      const isBebopPage = currentPath === "bebop";
      const isVibeCodingPage = currentPath === "blog";
      const isAboutPage = currentPath === "about";
      const isHomePage = currentPath === "" || currentPath === "index";
      
      let filteredPosts;
      if (isBebopPage) {
        filteredPosts = posts.filter(post => post.track && post.track.toLowerCase() === "bebop");
      } else if (isVibeCodingPage) {
        filteredPosts = posts.filter(post => post.track && post.track.toLowerCase() === "vibe coding");
      } else if (isAboutPage) {
        filteredPosts = posts.filter(post => post.track && post.track.toLowerCase() === "about me");
      } else if (isHomePage) {
        // On homepage, show only 2 most recent posts (already sorted by date)
        filteredPosts = posts.slice(0, 2);
      } else {
        filteredPosts = posts;
      }

      if (filteredPosts.length === 0) {
        blogGrid.innerHTML = "<p class='no-posts'>No blog posts to show yet!</p>";
        return;
      }

      // Loop through each post in the filtered array
      filteredPosts.forEach(post => {
        const card = document.createElement("div");
        card.className = "blog-card";
        
        // Create the link element
        const link = document.createElement('a');
        link.href = `/${post.slug}`;
        
        // Create the content container
        const content = document.createElement('div');
        content.className = 'blog-card-content';
        
        // Ensure thumbnail path starts with a slash
        const thumbnailPath = post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`;
        
        // Create image element separately to handle loading errors
        const img = document.createElement('img');
        img.src = thumbnailPath;
        img.alt = post.title;
        img.loading = 'lazy';
        img.onerror = () => {
          console.error('Failed to load thumbnail:', thumbnailPath);
          img.src = '/assets/images/placeholder.jpg';
          img.alt = 'Thumbnail not available';
        };
        
        // Add the image to the link
        link.appendChild(img);
        
        // Add the content
        content.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.summary}</p>
          <small>${post.date} • ${post.track}</small>
        `;
        
        // Add the content to the link
        link.appendChild(content);
        
        // Add the link to the card
        card.appendChild(link);
        
        // Add the card to the grid
        blogGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Failed to load blog posts:", error);
      blogGrid.innerHTML = "<p class='no-posts'>Oops! Could not load posts.</p>";
    });
}

function initPostContent() {
  const postContent = document.getElementById("postContent");
  if (!postContent) return;

  // Get the slug from either the URL path or query parameter
  let slug = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!slug) {
    const urlParams = new URLSearchParams(window.location.search);
    slug = urlParams.get('slug');
  }

  if (!slug) {
    postContent.innerHTML = "<p>Post not found.</p>";
    return;
  }

  // First, fetch the post metadata to determine the track
  fetch("/data/posts.json")
    .then(res => res.json())
    .then(posts => {
      const post = posts.find(p => p.slug === slug);
      if (!post) throw new Error("Post not found");
      
      // Update page title and meta tags
      const baseUrl = window.location.origin;
      const canonicalUrl = `${baseUrl}/${post.slug}`;
      const imageUrl = `${baseUrl}${post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`}`;
      
      // Basic meta tags
      document.title = `${post.title} | iamkaterpillar`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', post.summary);
      
      // OpenGraph meta tags
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', post.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', post.summary);
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
      
      // Twitter Card meta tags
      document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image');
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', post.title);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', post.summary);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);
      
      // Canonical URL
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
      
      // Update JSON-LD structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.summary,
        "datePublished": post.date,
        "url": canonicalUrl,
        "image": imageUrl,
        "author": {
          "@type": "Person",
          "name": "Katharina Fore",
          "url": "https://iamkaterpillar.com/about"
        },
        "publisher": {
          "@type": "Person",
          "name": "Katharina Fore",
          "url": "https://iamkaterpillar.com"
        }
      };
      
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (jsonLdScript) {
        jsonLdScript.textContent = JSON.stringify(structuredData, null, 2);
      }
      
      // Determine back link based on track
      let backLink = '/blog';
      let backText = 'back to Vibe coding';
      
      if (post.track && post.track.toLowerCase() === 'bebop') {
        backLink = '/bebop';
        backText = 'back to Building bebop';
      }

      // Then fetch the post content
      return fetch(`/posts/${post.id}/index.html`)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.text();
        })
        .then(html => {
          // Add back button and post content
          postContent.innerHTML = `
            <a href="${backLink}" class="back-button">${backText}</a>
            ${html}
          `;

          // Update URL to clean format if using query parameter
          if (window.location.search) {
            window.history.replaceState({}, '', `/${post.slug}`);
          }
        });
    })
    .catch((error) => {
      console.error("Failed to load post:", error);
      document.title = "Post Not Found | iamkaterpillar";
      postContent.innerHTML = `
        <a href="/blog" class="back-button">back to blog</a>
        <p>Could not load this post.</p>
      `;
    });
}