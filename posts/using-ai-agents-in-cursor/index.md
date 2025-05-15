---
title: "Using AI Agents in Cursor"
date: "2024-03-26"
description: "How I used Cursor's AI agent to clean up my website's code and make it more maintainable"
---

I've been playing around with Cursor's AI agent lately, and let me tell you — it's pretty mind-blowing. Today, I want to share how I used it to solve a real problem I had with my website: duplicate navigation code across every page.

## The Problem

When I first built this site, I was copying and pasting the same navigation bar into every HTML file. You know, the classic "it works for now" solution that developers love to hate. Here's what I had in every single page:

```html
<header>
  <nav>
    <a href="index.html">Home</a>
    <a href="about.html">About me</a>
    <a href="blog.html">Vibe coding</a>
    <a href="bebop.html">Building Bebop</a>
  </nav>
</header>
```

Not only was this annoying to maintain (imagine updating the navigation in five different files!), but it also meant I had duplicate code everywhere. Not exactly what you'd call "clean code."

## The Solution

Enter Cursor's AI agent. I asked it to help me refactor my site to use a shared layout component, and it did something pretty cool: it created a new `components` directory with two files:

1. `layout.html` - A template that contains all the shared elements:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- All the common stuff: meta tags, styles, analytics -->
</head>
<body>
  <!-- Navigation -->
  <header>
    <nav>
      <a href="/index.html">Home</a>
      <a href="/about.html">About me</a>
      <a href="/blog.html">Vibe coding</a>
      <a href="/bebop.html">Building Bebop</a>
    </nav>
  </header>  

  <!-- Main content -->
  <main>
    {{content}}
  </main>
</body>
</html>
```

2. `layout.js` - A small script that handles the magic:
```javascript
async function loadLayout() {
  const layoutResponse = await fetch('/components/layout.html');
  const layoutHtml = await layoutResponse.text();
  
  // Get the current page's content
  const mainContent = document.querySelector('main').innerHTML;
  
  // Replace the content placeholder in the layout
  const finalHtml = layoutHtml.replace('{{content}}', mainContent);
  
  // Update the document
  document.documentElement.innerHTML = finalHtml;
}

// Load the layout when the DOM is ready
document.addEventListener('DOMContentLoaded', loadLayout);
```

Now, each page only needs to contain its unique content, wrapped in a `<main>` tag. The layout script handles loading the shared template and injecting the page-specific content into it.

## Why This Rocks

This change makes my site so much more maintainable:
- Navigation changes only need to be made in one place
- Common elements (like analytics, styles, and favicon) are managed centrally
- Each page is cleaner and focused on its unique content
- If I want to add a new page, I don't have to copy-paste all the boilerplate

## The AI Experience

What's really cool about this whole process is how natural it felt. I just told the AI what I wanted to achieve ("refactor my site to use a shared layout"), and it:
1. Understood the problem
2. Proposed a solution
3. Created the necessary files
4. Updated all my existing pages
5. Explained what it did and why

It's like having a pair programmer who's really good at refactoring and explaining their thought process. The best part? I learned something new about web development patterns while getting my code cleaned up.

I'm still getting used to working with AI agents, but moments like this make me excited about the future of coding. It's not just about writing code faster — it's about having a partner that helps you write better code and learn along the way.

*P.S. If you're curious about the full implementation, you can check out the [components directory](https://github.com/iamkaterpillar/my-website/tree/main/components) in my GitHub repo.* 