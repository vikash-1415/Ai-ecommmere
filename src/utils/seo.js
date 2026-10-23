/**
 * SEO & GEO (Generative Engine Optimization) Structured Data & Meta Tag Manager
 */

export function updateMeta({
  title = "WeatherCart | AI-Powered Weather-Based Shopping",
  description = "Discover personalized products tailored to your real-time local weather, temperature, and UV index.",
  canonical = window.location.href,
  ogImage = "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=80",
  type = "website",
} = {}) {
  // Document title
  document.title = title;

  // Standard Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", description);

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", canonical);

  // Open Graph Tags
  const ogTags = {
    "og:title": title,
    "og:description": description,
    "og:url": canonical,
    "og:image": ogImage,
    "og:type": type,
    "og:site_name": "WeatherCart",
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": ogImage,
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`) || 
              document.querySelector(`meta[name="${property}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      if (property.startsWith("twitter:")) {
        tag.setAttribute("name", property);
      } else {
        tag.setAttribute("property", property);
      }
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  });
}

/**
 * Injects or updates JSON-LD Schema structured data
 */
export function injectStructuredData(schema, id = "dynamic-ld-json") {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Standard Schema generators for Product, Article, Organization, Breadcrumb
 */
export const schemaGenerators = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WeatherCart",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "description": "AI-powered weather-aware smart e-commerce platform.",
    "sameAs": [
      "https://twitter.com/weathercart",
      "https://instagram.com/weathercart",
      "https://github.com/weathercart"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }),

  product: (product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": `WC-PROD-${product.id || product._id}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "WeatherCart Select"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    },
    "aggregateRating": product.ratingAverage ? {
      "@type": "AggregateRating",
      "ratingValue": product.ratingAverage,
      "reviewCount": product.ratingCount || 1,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined
  }),

  article: (article) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.coverImage,
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author?.name || "WeatherCart Editorial"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WeatherCart",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  }),

  breadcrumbs: (crumbs = []) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  }),

  faq: (faqs = []) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  })
};
