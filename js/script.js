const productList = document.querySelector(".list-products");
const totalElement = document.querySelector(".total");

if (!productList || !totalElement) {
  throw new Error("Le panier doit contenir une liste de produits et un total.");
}

const getProductValue = (product, selector, parseValue) => {
  const element = product.querySelector(selector);
  const value = element ? parseValue(element.textContent) : Number.NaN;

  if (!Number.isFinite(value)) {
    throw new Error(`Valeur invalide pour le produit : ${selector}.`);
  }

  return value;
};

const updateTotal = () => {
  const total = [...productList.querySelectorAll(".product-item")].reduce(
    (sum, product) => {
      const price = getProductValue(product, ".unit-price", (text) =>
        Number.parseFloat(text.replace(/[^\d.,-]/g, "").replace(",", "."))
      );
      const quantity = getProductValue(product, ".quantity", (text) =>
        Number.parseInt(text, 10)
      );

      return sum + price * quantity;
    },
    0
  );

  const formattedTotal = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(total);
  totalElement.textContent = `${formattedTotal} F CFA`;
};

productList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest("button[data-action]");
  const product = button?.closest(".product-item");

  if (!button || !product) {
    return;
  }

  const action = button.dataset.action;

  if (action === "remove") {
    product.remove();
    updateTotal();
    return;
  }

  if (action === "favorite") {
    const isFavorite = button.getAttribute("aria-pressed") !== "true";
    const productName = product.querySelector(".card-title")?.textContent.trim();

    button.setAttribute("aria-pressed", String(isFavorite));
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute(
      "aria-label",
      `${isFavorite ? "Retirer" : "Ajouter"} ${productName} ${
        isFavorite ? "des" : "aux"
      } favoris`
    );
    return;
  }

  const quantityElement = product.querySelector(".quantity");

  if (!quantityElement) {
    throw new Error("Le produit doit afficher sa quantité.");
  }

  const quantity = getProductValue(product, ".quantity", (text) =>
    Number.parseInt(text, 10)
  );

  if (action === "increase") {
    quantityElement.textContent = String(quantity + 1);
  } else if (action === "decrease") {
    quantityElement.textContent = String(Math.max(0, quantity - 1));
  } else {
    return;
  }

  updateTotal();
});

updateTotal();
