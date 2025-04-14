// Wait until the page content is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Get the element where we'll insert blog post cards
    const blogGrid = document.getElementById("blogGrid");
  
    // Load blog post metadata from the posts.json file
    fetch("posts.json")
      .then((response) => response.json()) // Convert the response to JSON
      .then((posts) => {
        // Loop through each post and create a visual card for it
        posts.forEach((post) => {
          // Create a new <div> for the blog post card
          const card = document.createElement("div");
          card.className = "blog-card"; // Add a class for styling
  
          // Fill the card with content using the post metadata
          card.innerHTML = `
            <a href="post.html?id=${post.id}">
              <img src="${post.thumbnail}" alt="${post.title}" />
              <h2>${post.title}</h2>
              <p>${post.summary}</p>
              <small>${post.date} • ${post.track}</small>
            </a>
          `;
  
          // Add the finished card to the blogGrid element on the page
          blogGrid.appendChild(card);
        });
      })
      .catch((error) => {
        // If there's an error loading posts.json, show a friendly error message
        console.error("Failed to load blog posts:", error);
        blogGrid.innerHTML = "<p>Oops! Could not load posts.</p>";
      });
  });  