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
          Toastify({
            text: "Se ha agregado al carrito",
            offset: {
              x: 50,
              y: 10,
            },
          }).showToast();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});

const $btnLogout = document.getElementById("logout");
$btnLogout.addEventListener("click", (e) => {
  fetch("/api/users/logout", {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/login";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
