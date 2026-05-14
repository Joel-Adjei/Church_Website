import { useLocation } from "react-router-dom";

const SITE_NAME = "Grace Cathedral";
const SITE_URL = "https://chapelweb.netlify.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  noSuffix?: boolean;
}

export function Seo({ title, description, image, type = "website", noSuffix = false }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = noSuffix ? title : `${title} | ${SITE_NAME}`;
  const ogImage = image ?? DEFAULT_IMAGE;
  const canonical = `${SITE_URL}${pathname}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
