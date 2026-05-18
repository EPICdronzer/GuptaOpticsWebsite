export const siteConfig = {
  name: "Optical Galaxy",
  fullName: "Optical Galaxy",
  contact: {
    email: "info@Opticalgalaxy.com",
    phone: "+91 98765 43210",
    whatsapp: "9876543210", // Format: countrycodeNumber without +
  },
  address: {
    street: "123 Vision Avenue",
    city: "New Delhi",
    state: "Delhi",
    zip: "110001",
    country: "India",
    full: "123 Vision Avenue, New Delhi, India",
    googleMaps: "https://maps.app.goo.gl/your-location-link"
  },
  social: {
    instagram: "https://instagram.com/Opticalgalaxy",
    facebook: "https://facebook.com/Opticalgalaxy",
    twitter: "https://twitter.com/Opticalgalaxy",
    linkedin: "https://linkedin.com/company/Opticalgalaxy",
  },
  links: {
    shop: "/shop",
    about: "/about",
    contact: "/contact",
    blog: "/blog",
  },
  footer: {
    tagline: "Premium Eyewear for the Modern Individual.",
    copyright: "© 2025 Optical Galaxy. All rights reserved.",
  },
  // Backend Configuration
  backend: {
    mongodbUri: "mongodb://localhost:27017/Opticalgalaxy", // Local MongoDB for now
    cloudinary: {
      cloudName: "your_cloud_name",
      apiKey: "your_api_key",
      apiSecret: "your_api_secret",
      uploadPreset: "Opticalgalaxy_products"
    }
  }
};
