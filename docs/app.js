const form = document.getElementById("loginForm");
const submitBtn = document.getElementById("submitBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const messageEl = document.getElementById("message");

let mode = "login"; // or "signup"

function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = text ? `message ${type}` : "message";
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading
        ? "One moment…"
        : (mode === "login" ? "Log in" : "Create account");
}

toggleModeBtn.addEventListener("click", () => {
    mode = mode === "login" ? "signup" : "login";
    submitBtn.textContent = mode === "login" ? "Log in" : "Create account";
    toggleModeBtn.textContent = mode === "login"
        ? "Create an account instead"
        : "Log in instead";
    setMessage("", "");
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage("", "");

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;

    if (!email || !pass) {
        setMessage("Enter both an email and a password.", "error");
        return;
    }

    setLoading(true);

    const endpoint = mode === "login" ? "/api/login" : "/api/signup";

    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass })
    })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong. Please try again.");
            }
            if (mode === "signup") {
                setMessage("Account created. Taking you in…", "info");
            }
            window.location.href = "/study";
        })
        .catch((err) => {
            setLoading(false);
            setMessage(err.message, "error");
        });
});