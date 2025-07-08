document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const res = await fetch("http://localhost:5000/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    alert("Registration successful! Please login.");
                    window.location.href = "login.html";
                } else {
                    alert(data.error || "Registration failed");
                }
            } catch (err) {
                alert("Network error. Please try again.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const res = await fetch("http://localhost:5000/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("user", JSON.stringify(data));
                    alert("Login successful");
                    window.location.href = "index.html";
                } else {
                    alert(data.error || "Login failed");
                }
            } catch (err) {
                alert("Network error. Please try again.");
            }
        });
    }
});