const $ = (id) => document.getElementById(id);

function login() {
  const $button = $("btnLogin");

  $button.addEventListener("click", (e) => {
    e.preventDefault();
    const email = $("email").value;
    const password = $("password").value;
    const data = { email, password };
    fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          window.location.href = "/home";
        } else {
          Toastify({
            text: data.message,
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
