// Wait until the entire page is loaded before running this script
document.addEventListener("DOMContentLoaded", () => {
  // Select the blogGrid container where we'll place all blog cards
  const blogGrid = document.getElementById("blogGrid");

  // Only proceed if we found the blogGrid element
  if (!blogGrid) return;

  // Fetch blog post metadata from posts.json
  fetch("posts.json")
    .then((response) => response.json()) // Convert JSON response into a JS object
    .then((posts) => {
      // On blog.html page, show only 'vibe coding' posts
      const isVibeCodingPage = window.location.pathname.endsWith("blog.html");
      const filteredPosts = posts.filter((post) => post.track && post.track.toLowerCase() === "vibe coding");

      if (filteredPosts.length === 0) {
        blogGrid.innerHTML = "<p>No blog posts to show yet!</p>";
        return;
      }

      // Loop through each post in the filtered array
      filteredPosts.forEach((post) => {
        // Create a new <div> for each blog card
        const card = document.createElement("div");
        card.className = "blog-card"; // Add a class for styling

        // Fill the card with the blog post's content using a template literal
        card.innerHTML = `
          <a href="post.html?id=${post.id}">
            <img src="${post.thumbnail}" alt="${post.title}" loading="lazy" />
            <h2>${post.title}</h2>
            <p>${post.summary}</p>
            <small>${post.date} • ${post.track}</small>
          </a>
        `;

        // Append the card to the grid on the blog page
        blogGrid.appendChild(card);
      });
    })
    .catch((error) => {
      // Handle any errors that occur (e.g. file missing or bad JSON format)
      console.error("Failed to load blog posts:", error);
      blogGrid.innerHTML = "<p>Oops! Could not load posts.</p>";
    });
});

// Handle loading a single blog post's content on post.html
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  // If no ID was passed, show a fallback message
  if (!postId) {
    document.getElementById("postContent").innerHTML = "<p>Post not found.</p>";
    return;
  }

  // Fetch the post content from its HTML version (not .md)
  fetch(`posts/${postId}/index.html`)
    .then((res) => {
      if (!res.ok) throw new Error("Not found");
      return res.text();
    })
    .then((html) => {
      document.getElementById("postContent").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("postContent").innerHTML = "<p>Could not load this post.</p>";
    });
});