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
          <img src="${this.image}" alt="${this.title}">
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
