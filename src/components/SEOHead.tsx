import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    author: {
      name: string;
      url: string;
    };
    tags?: string[];
  };
}

export function SEOHead({ title, description, image, article }: SEOHeadProps) {
  const location = useLocation();
  const url = `${window.location.origin}${location.pathname}`;
  
  // Update document title and meta tags
  document.title = `${title} | NewsOpinions`;
  
  // Update meta tags
  const metaTags = {
    description,
    "og:title": title,
    "og:description": description,
    "og:url": url,
    "og:type": article ? "article" : "website",
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
  };

  // Update existing meta tags or create new ones
  Object.entries(metaTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[property="${name}"]`) ||
               document.querySelector(`meta[name="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // Add JSON-LD Schema
  const schema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url
    },
    publisher: {
      "@type": "Organization",
      name: "NewsOpinions",
      logo: {
        "@type": "ImageObject",
        url: `${window.location.origin}/logo.png`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NewsOpinions",
    description: description,
    url: url
  };

  // Update JSON-LD script
  let scriptTag = document.querySelector('script[type="application/ld+json"]');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(schema);

  return null;
}