// Wait until the entire page is loaded before running this script
document.addEventListener("DOMContentLoaded", () => {
  // Select the blogGrid container where we'll place all blog cards
  const blogGrid = document.getElementById("blogGrid");

  // Fetch blog post metadata from posts.json
  fetch("posts.json")
    .then((response) => response.json()) // Convert JSON response into a JS object
    .then((posts) => {
      // Loop through each post in the JSON array
      posts.forEach((post) => {
        // Create a new <div> for each blog card
        const card = document.createElement("div");
        card.className = "blog-card"; // Add a class for styling

        // Fill the card with the blog post's content using a template literal
        card.innerHTML = `
          <a href="post.html?id=${post.id}">
            <img src="${post.thumbnail}" alt="${post.title}" />
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