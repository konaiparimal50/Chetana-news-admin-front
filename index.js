const CONFIG = {
  LOGIN_API_URL: "https://script.google.com/macros/s/AKfycbzYxErtKcBZR2IbUNuex1G5KHy_hCUNKR0OYVoTZRNGnRa-ordN0Ov41SZwbBRzK-67Yw/exec"
};

// যদি ইউজার আগে থেকেই লগইন করা থাকে তবে সরাসরি dashboard.html এ পাঠিয়ে দেবে
if (sessionStorage.getItem("csnAdminAuthed") === "true") {
  window.location.href = "dashboard.html";
}

const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginAlert = document.getElementById("loginAlert");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const loginBtnText = document.getElementById("loginBtnText");
const loginSpinner = document.getElementById("loginSpinner");
const helpLinkLogin = document.getElementById("helpLinkLogin");

async function safeParseJson(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    throw new Error("সার্ভার থেকে সঠিক রেসপন্স পাওয়া যায়নি।");
  }
}

function showAlert(message) {
  loginAlert.textContent = message;
  loginAlert.hidden = false;
}

function hideAlert() {
  loginAlert.hidden = true;
  loginAlert.textContent = "";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    showAlert("অনুগ্রহ করে সমস্ত তথ্য প্রদান করুন।");
    return;
  }

  setLoading(true);
  hideAlert();

  try {
    const response = await fetch(CONFIG.LOGIN_API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password
      })
    });

    const result = await safeParseJson(response);

    if (result.success) {
      sessionStorage.setItem("csnAdminAuthed", "true");
      if (result.editorName) {
        localStorage.setItem("csnEditorName", result.editorName);
      }
      
      // লগইন সফল হলে ড্যাশবোর্ডে পাঠাবে
      window.location.href = "dashboard.html";
    } else {
      showAlert(result.message || "ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।");
    }
  } catch (err) {
    showAlert(err.message || "সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।");
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  loginSubmitBtn.disabled = isLoading;
  loginUsername.disabled = isLoading;
  loginPassword.disabled = isLoading;
  
  if (isLoading) {
    loginBtnText.textContent = "Verifying / যাচাই করা হচ্ছে... ";
    loginSpinner.hidden = false;
  } else {
    loginBtnText.textContent = "Login / প্রবেশ করুন";
    loginSpinner.hidden = true;
  }
}

helpLinkLogin.addEventListener("click", () => {
  window.location.href = "help.html";
});
