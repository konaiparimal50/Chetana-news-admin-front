const CONFIG = {
  // Render-এ ডেপ্লয় করার পর পাওয়া লাইভ URL দিন (যেমন: https://your-app.onrender.com)
  API_BASE_URL: "https://jwt-use-login.onrender.com"
};

// --- অটো-লগইন চেকার (Auto Login Check) ---
// ২ দিন পর্যন্ত টোকেন সচল থাকলে ইউজারকে সরাসরি dashboard.html-এ পাঠাবে
async function checkAutoLogin() {
  const token = localStorage.getItem("csnAuthToken");
  if (!token) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/api/verify-token`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "dashboard.html";
    } else {
      localStorage.removeItem("csnAuthToken");
    }
  } catch (e) {
    console.error("Auto-login error:", e);
  }
}

// পেজ লোড হলেই অটো-লগইন চেক হবে
checkAutoLogin();

const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginAlert = document.getElementById("loginAlert");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const loginBtnText = document.getElementById("loginBtnText");
const loginSpinner = document.getElementById("loginSpinner");
const helpLinkLogin = document.getElementById("helpLinkLogin");

function showAlert(message) {
  loginAlert.textContent = message;
  loginAlert.hidden = false;
}

function hideAlert() {
  loginAlert.hidden = true;
  loginAlert.textContent = "";
}

function setLoading(isLoading) {
  loginSubmitBtn.disabled = isLoading;
  loginUsername.disabled = isLoading;
  loginPassword.disabled = isLoading;
  if (isLoading) {
    loginBtnText.textContent = "Verifying / যাচাই করা হচ্ছে... ";
    loginSpinner.hidden = false;
  } else {
    loginBtnText.textContent = "Login / লগইন করুন";
    loginSpinner.hidden = true;
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    showAlert("দয়া করে ইউজারনেম এবং পাসওয়ার্ড পূরণ করুন!");
    return;
  }

  setLoading(true);
  hideAlert();

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
      // sessionStorage-এর বদলে localStorage ব্যবহার করা হলো
      localStorage.setItem("csnAuthToken", result.token);
      if (result.editorName) {
        localStorage.setItem("csnEditorName", result.editorName);
      }
      window.location.href = "dashboard.html";
    } else {
      showAlert(result.message || "লগইন ব্যর্থ হয়েছে!");
    }
  } catch (err) {
    showAlert("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি!");
  } finally {
    setLoading(false);
  }
});

helpLinkLogin.addEventListener("click", () => {
  window.location.href = "help.html";
});
