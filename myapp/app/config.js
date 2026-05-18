export const siteConfig = {
  name: "Eyeconic",
  fullName: "Gupta Optics",
  contact: {
    email: "info@guptaoptics.com",
    phone: "+91 98765 43210",
    whatsapp: "919876543210", // Format: countrycodeNumber without +
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
    instagram: "https://instagram.com/eyeconic",
    facebook: "https://facebook.com/eyeconic",
    twitter: "https://twitter.com/eyeconic",
    linkedin: "https://linkedin.com/company/eyeconic",
  },
  links: {
    shop: "/shop",
    about: "/about",
    contact: "/contact",
    blog: "/blog",
  },
  footer: {
    tagline: "Premium Eyewear for the Modern Individual.",
    copyright: "© 2025 Eyeconic. All rights reserved.",
  },
  // Backend Configuration
  backend: {
    mongodbUri: "mongodb://localhost:27017/eyeconic", // Local MongoDB for now
    cloudinary: {
      cloudName: "your_cloud_name",
      apiKey: "your_api_key",
      apiSecret: "your_api_secret",
      uploadPreset: "eyeconic_products"
    }
  }
};
