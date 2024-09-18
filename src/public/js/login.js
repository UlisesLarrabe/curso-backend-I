const $ = (id) => document.getElementById(id);

function login() {
  const $button = $("btnLogin");

  $button.addEventListener("click", (e) => {
    e.preventDefault();
    const email = $("email").value;
    const password = $("password").value;
    const data = { email, password };
    fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.token) {
          window.location.href = "/home";
        } else {
          Toastify({
            text: "Credenciales invalidas",
            offset: {
              x: 50,
              y: 10,
            },
          }).showToast();
        }
      });
  });
}

login();
