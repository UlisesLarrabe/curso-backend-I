document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".btn-card");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cardProduct = this.closest(".cardProduct");
      const productId = cardProduct.getAttribute("data-id");
      const quantity = {
        quantity: 1,
      };
      const url = `/api/carts/6687315ff6dba271eeaad2eb/product/${productId}`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quantity),
      };

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});
