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
    console.log('Menu toggle clicked');
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

  fetch("posts.json")
    .then(response => response.json())
    .then(posts => {
      // Filter posts based on current page
      const isBebopPage = window.location.pathname.endsWith("bebop.html");
      const isVibeCodingPage = window.location.pathname.endsWith("blog.html");
      
      let filteredPosts;
      if (isBebopPage) {
        filteredPosts = posts.filter(post => post.track && post.track.toLowerCase() === "bebop");
      } else if (isVibeCodingPage) {
        filteredPosts = posts.filter(post => post.track && post.track.toLowerCase() === "vibe coding");
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
        card.innerHTML = `
          <a href="post.html?id=${post.id}">
            <img src="${post.thumbnail}" alt="${post.title}" loading="lazy" />
            <h2>${post.title}</h2>
            <p>${post.summary}</p>
            <small>${post.date} • ${post.track}</small>
          </a>
        `;
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

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    postContent.innerHTML = "<p>Post not found.</p>";
    return;
  }

  fetch(`posts/${postId}/index.html`)
    .then(res => {
      if (!res.ok) throw new Error("Not found");
      return res.text();
    })
    .then(html => {
      postContent.innerHTML = html;
    })
    .catch(() => {
      postContent.innerHTML = "<p>Could not load this post.</p>";
    });
}