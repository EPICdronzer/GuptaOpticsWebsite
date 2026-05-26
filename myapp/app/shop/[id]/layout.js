import { getProductById } from '../../../actions/adminActions';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  
  if (!product) {
    return {
      title: "Product Not Found | Optical Galaxy & Gupta Optics",
      description: "Discover premium eyewear collections at Optical Galaxy & Gupta Optics."
    };
  }

  const title = `${product.name} | Optical Galaxy & Gupta Optics`;
  const description = product.description || `Buy ${product.name} at Optical Galaxy & Gupta Optics. Premium custom lenses, anti-glare coatings, and lightweight frames.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : []
    }
  };
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
