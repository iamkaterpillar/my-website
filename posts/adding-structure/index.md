---
title: "Adding structure"
date: "2025-04-14"
track: "building iamkaterpillar"
summary: "Cleaning up file structure for a scalable and maintainable setup."
---

# Adding structure

When you’re just starting a personal site or blog, it’s tempting to toss everything into one folder and call it a day. But if you think your project might grow — even just a little — it’s worth taking a moment early on to build structure into your setup.

That’s what this post is about: setting up a neat, scalable file structure from the beginning to make things easier later.

## Why structure matters

Right now, my site only has a few pages. But I know I’m going to be adding more blog posts, some images, and likely other resources (scripts, analytics tools, maybe even interactive pages). Without a clear structure, things could quickly get messy:

- Hard to find files
- Duplicate images or assets
- Confusing link paths
- Refactoring pain when things grow

So instead of deferring that cleanup to “someday,” I’m doing it now.

## What I set up

I landed on a simple but clean structure:

```
my-website/
├── index.html
├── about.html
├── blog.html
├── post.html
├── posts/               # All blog post content lives here
│   ├── usage-analytics/
│   │   ├── index.md
│   │   └── thumb.jpg
│   ├── website-setup/
│   │   ├── index.md
│   │   └── thumb.jpg
│   └── adding-structure/
│       ├── index.md
│       └── thumb.jpg
├── assets/              # Site-wide assets
│   ├── images/
│   │   └── icons/
│   │       └── favicon.ico
│   ├── fonts/
├── style.css
├── script.js
├── posts.json           # Blog post metadata for rendering
└── CNAME                # For custom domain
```

### Why images go with posts

One of the decisions I spent time on was whether to put blog post images (like thumbnails) inside a global `assets/` folder or right next to the `.md` file for the post.

I decided to keep post-specific assets *with the post itself*. Why?

- Easier to move/delete/edit posts later without breaking things
- Keeps global `assets/` clean and focused on site-wide assets
- Everything related to a blog post lives together, which just feels right

If I had to migrate this blog to another system or export a post, I’d want it to be self-contained.

## Final thoughts

This kind of structure might feel like overkill when you only have three blog posts and a favicon, but it’s a gift to your future self. I’d rather spend 10 extra minutes now than have to refactor everything in a month.

If you’re building your own site and wondering whether to invest time in structure early on — I say yes. It keeps your project organized, easier to debug, and ready to scale if inspiration hits ✨
