const socket = io();

const $ = (className) => document.getElementById(className);

function register() {
  const $btnRegister = $("btnRegister");

  $btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    const first_name = $("first_name").value;
    const last_name = $("last_name").value;
    const email = $("email").value;
    const password = $("password").value;
    const age = $("age").value;

    $btnRegister.disabled = false;
    $btnRegister.style.opacity = 1;

    if (!first_name || !last_name || !email || !password || !age) {
      Toastify({
        text: "Complete todos los campos",
        offset: {
          x: 50,
          y: 10,
        },
      }).showToast();
      return;
    }
    const user = { first_name, last_name, email, password, age };
    fetch("/api/sessions/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status >= 400) {
          return Toastify({ text: data.message }).showToast();
        } else {
          Toastify({
            text: "Registro creado, por favor inicia sesion",
            offset: {
              x: 50,
              y: 10,
            },
          }).showToast();
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      });
  });
}

register();
