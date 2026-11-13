import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your production domain or configure via environment variable
const SITE_URL = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://greenbeli.in';
const API_URL = process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:5007/api';

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/products', changefreq: 'daily', priority: '0.9' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/our-story', changefreq: 'monthly', priority: '0.7' },
  { url: '/journal', changefreq: 'weekly', priority: '0.8' },
  { url: '/plant-care-guides', changefreq: 'weekly', priority: '0.8' },
  { url: '/our-growers', changefreq: 'monthly', priority: '0.7' },
  { url: '/gallery', changefreq: 'weekly', priority: '0.7' },
  { url: '/proposals', changefreq: 'monthly', priority: '0.6' },
  { url: '/testimonials', changefreq: 'monthly', priority: '0.6' },
  { url: '/gift-cards', changefreq: 'monthly', priority: '0.6' },
  { url: '/shipping-returns', changefreq: 'monthly', priority: '0.5' },
  { url: '/faqs', changefreq: 'monthly', priority: '0.6' },
  { url: '/contact', changefreq: 'monthly', priority: '0.6' },
];

async function fetchDynamicRoutes() {
  const dynamicRoutes = [];

  try {
    // Fetch categories
    const catRes = await fetch(`${API_URL}/categories`);
    if (catRes.ok) {
      const catData = await catRes.json();
      const categories = Array.isArray(catData) ? catData : catData.categories || [];
      for (const cat of categories) {
        const slug = cat.slug || cat._id;
        if (slug) {
          dynamicRoutes.push({
            url: `/category/${encodeURIComponent(slug)}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : undefined,
          });
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap-gen] Warning: Could not fetch categories from backend API:', err.message);
  }

  try {
    // Fetch products
    const prodRes = await fetch(`${API_URL}/products?limit=1000`);
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      const products = Array.isArray(prodData)
        ? prodData
        : prodData.items || prodData.products || [];

      for (const prod of products) {
        const slugOrId = prod.slug || prod._id;
        if (slugOrId) {
          dynamicRoutes.push({
            url: `/products/${encodeURIComponent(slugOrId)}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: prod.updatedAt ? new Date(prod.updatedAt).toISOString().split('T')[0] : undefined,
          });
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap-gen] Warning: Could not fetch products from backend API:', err.message);
  }

  return dynamicRoutes;
}

async function generateSitemap() {
  console.log(`Generating sitemap with base URL: ${SITE_URL}`);
  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const currentDate = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (item) => `  <url>
    <loc>${SITE_URL.replace(/\/+$/, '')}${item.url}</loc>
    <lastmod>${item.lastmod || currentDate}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml.trim(), 'utf-8');
  console.log(`Successfully generated sitemap.xml with ${allRoutes.length} URLs at ${outputPath}`);
}

generateSitemap();
