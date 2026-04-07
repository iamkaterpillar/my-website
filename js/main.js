// Initialize everything after layout is loaded
window.addEventListener('layoutLoaded', () => {
  initMobileMenu();
  initBlogPosts();
  initPostContent();
});

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) {
    return;
  }

  navLinks.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });

  function toggleMenu() {
    navLinks.classList.contains('active') ? closeMenu() : openMenu();
  }

  function openMenu() {
    menuToggle.classList.add('active');
    navLinks.classList.add('active');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

function initBlogPosts() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  blogGrid.innerHTML = '';

  const currentPath = window.location.pathname.replace(/^\/+|\/+$|\.[^/.]+$/g, '');
  const isHomePage = currentPath === "" || currentPath === "index";
  const isBlogPage = currentPath === "blog" || currentPath === "pages/blog";

  fetch("/data/posts.json")
    .then(response => response.json())
    .then(posts => {
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (isHomePage) {
        renderPosts(blogGrid, posts.slice(0, 4));
        return;
      }

      if (isBlogPage) {
        initBlogFilters(blogGrid, posts);
        return;
      }
    })
    .catch(error => {
      console.error("Failed to load blog posts:", error);
      blogGrid.innerHTML = "<p class='no-posts'>Oops! Could not load posts.</p>";
    });
}

function initBlogFilters(blogGrid, posts) {
  const params = new URLSearchParams(window.location.search);
  const initialTrack = params.get('track') || 'all';

  const filtersEl = document.getElementById('trackFilters');
  if (filtersEl) {
    filtersEl.querySelectorAll('.track-filter').forEach(btn => {
      if (btn.dataset.track === initialTrack) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('.track-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const track = btn.dataset.track;
        const url = track === 'all' ? '/pages/blog' : `/pages/blog?track=${encodeURIComponent(track)}`;
        history.pushState({}, '', url);
        filterAndRender(blogGrid, posts, track);
      });
    });
  }

  filterAndRender(blogGrid, posts, initialTrack);
}

function filterAndRender(blogGrid, posts, track) {
  const filtered = track === 'all'
    ? posts
    : posts.filter(p => {
        const tracks = Array.isArray(p.tracks) ? p.tracks : (p.track ? [p.track] : []);
        return tracks.some(t => t.toLowerCase() === track.toLowerCase());
      });
  renderPosts(blogGrid, filtered);
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderPosts(blogGrid, posts) {
  blogGrid.innerHTML = '';

  if (posts.length === 0) {
    blogGrid.innerHTML = "<p class='no-posts'>No posts yet!</p>";
    return;
  }

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "blog-card";

    const link = document.createElement('a');
    link.href = `/pages/post.html?slug=${post.slug}`;

    const thumbnailPath = post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`;
    const img = document.createElement('img');
    img.src = thumbnailPath;
    img.alt = post.title;
    img.loading = 'lazy';
    img.onerror = () => {
      img.src = '/assets/images/placeholder.jpg';
      img.alt = 'Thumbnail not available';
    };

    link.appendChild(img);

    const content = document.createElement('div');
    content.className = 'blog-card-content';
    content.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.summary}</p>
      <div class="post-meta">
        ${(Array.isArray(post.tracks) ? post.tracks : [post.track]).map(t => `<span class="post-track-badge">${t}</span>`).join('')}
        <small>${formatDate(post.date)}</small>
      </div>
    `;
    link.appendChild(content);
    card.appendChild(link);
    blogGrid.appendChild(card);
  });
}

function initPostContent() {
  const postContent = document.getElementById("postContent");
  if (!postContent) return;

  const urlParams = new URLSearchParams(window.location.search);
  let slug = urlParams.get('slug');

  if (!slug) {
    slug = window.location.pathname.replace(/^\/+|\/+$|\.[^/.]+$/g, '');
    if (slug.startsWith('pages/')) {
      slug = slug.replace('pages/', '');
    }
  }

  if (!slug) {
    postContent.innerHTML = "<p>Post not found.</p>";
    return;
  }

  fetch("/data/posts.json")
    .then(res => res.json())
    .then(posts => {
      const post = posts.find(p => p.slug === slug);
      if (!post) throw new Error("Post not found");

      const baseUrl = window.location.origin;
      const canonicalUrl = `${baseUrl}/${post.slug}`;
      const imageUrl = `${baseUrl}${post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`}`;

      document.title = `${post.title} | iamkaterpillar`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', post.summary);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', post.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', post.summary);
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
      document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image');
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', post.title);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', post.summary);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);

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

      // Back link always goes to blog, pre-filtered to the post's first track
      const tracks = Array.isArray(post.tracks) ? post.tracks : (post.track ? [post.track] : []);
      const track = (tracks[0] || '').toLowerCase();
      const backUrl = !track
        ? '/pages/blog'
        : `/pages/blog?track=${encodeURIComponent(track)}`;
      const backText = 'back to blog';

      return fetch(`/posts/${post.id}/index.html`)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.text();
        })
        .then(html => {
          const badgesHtml = tracks.map(t => `<span class="post-track-badge">${t}</span>`).join('');
          postContent.innerHTML = `
            <a href="${backUrl}" class="back-button">${backText}</a>
            ${html}
          `;
          // Inject date + track badges after the first h1
          const h1 = postContent.querySelector('h1');
          if (h1) {
            const meta = document.createElement('div');
            meta.className = 'post-meta post-header-meta';
            meta.innerHTML = `${badgesHtml}<small>${formatDate(post.date)}</small>`;
            h1.insertAdjacentElement('afterend', meta);
          }
          if (window.location.search) {
            window.history.replaceState({}, '', `/${post.slug}`);
          }
        });
    })
    .catch((error) => {
      console.error("Failed to load post:", error);
      document.title = "Post Not Found | iamkaterpillar";
      postContent.innerHTML = `
        <a href="/pages/blog" class="back-button">back to blog</a>
        <p>Could not load this post.</p>
      `;
    });
}
