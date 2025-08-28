import { GetServerSideProps } from 'next';
import { articles } from '../data/articles';
import { Article } from '../data/articles/types';

const generateSiteMap = (articles: Article[]) => {
  const mostRecentDate = articles.reduce((max, article) => {
    const effectiveDate = article.lastModified || article.date;
    const maxDate = new Date(max);
    const effectiveDateObj = new Date(effectiveDate);
    return effectiveDateObj > maxDate ? effectiveDate : max;
  }, articles[0].lastModified || articles[0].date);

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://aika.app</loc>
       <lastmod>${mostRecentDate}</lastmod>
       <priority>1.00</priority>
     </url>
     <url>
       <loc>https://aika.app/articles</loc>
       <lastmod>${mostRecentDate}</lastmod>
       <priority>0.80</priority>
     </url>
     ${articles
       .map(({ slug, date, lastModified }) => {
         const lastmod = lastModified || date;
         return `
       <url>
           <loc>${`https://aika.app/articles/${slug}`}</loc>
           <lastmod>${lastmod}</lastmod>
           <priority>0.64</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap(articles);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const SiteMap = () => {
  // This component does not render anything.
};

export default SiteMap;
