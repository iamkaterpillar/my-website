// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
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
  
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

function initBlogPosts() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

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