class Product {
  constructor(id, title, price, description, image) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
  }

  createCard() {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
          <div class="image-container">
              <img data-src="${this.image}" alt="${this.title}" class="lazy">
          </div>
          <h2>${this.title}</h2>
          <p>${this.description}</p>
          <div class="price">$${this.price}</div>
      `;

    return card;
  }
}

class ProductListing {
  constructor(apiUrl, container) {
    this.apiUrl = apiUrl;
    this.container = container;
  }

  async fetchProducts() {
    try {
      const response = await fetch(this.apiUrl);
      const products = await response.json();
      return products.map(
        (product) =>
          new Product(
            product.id,
            product.title,
            product.price,
            product.description,
            product.image
          )
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async render() {
    const products = await this.fetchProducts();
    products.forEach((product) => {
      this.container.appendChild(product.createCard());
    });
    this.lazyLoadImages();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img.lazy");
    const config = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.classList.remove("lazy");
          img.classList.add("lazy-loaded");
          observer.unobserve(img);
        }
      });
    }, config);

    images.forEach((image) => {
      imageObserver.observe(image);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productListContainer = document.querySelector(".product-listing");
  const productListing = new ProductListing(
    "https://fakestoreapi.com/products",
    productListContainer
  );
  productListing.render();
});
