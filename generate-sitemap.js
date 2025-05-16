const fs = require('fs');

// Read posts.json to get all blog posts
const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));

// Base URL of the website
const baseUrl = 'https://iamkaterpillar.com';

// Static pages
const staticPages = [
  '',  // homepage
  'about',
  'blog',
  'bebop'
];

// Generate XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static pages
staticPages.forEach(page => {
  const url = page ? `${baseUrl}/${page}` : baseUrl;
  xml += `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page ? '0.8' : '1.0'}</priority>
  </url>
`;
});

// Add blog posts
posts.forEach(post => {
  xml += `  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
});

xml += '</urlset>';

// Write sitemap.xml
fs.writeFileSync('sitemap.xml', xml);
console.log('Sitemap generated successfully!'); 