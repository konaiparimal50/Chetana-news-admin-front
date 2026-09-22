/* ============================================================
   CSN NEWS ADMIN — DASHBOARD LOGIC (dashboard.js)
============================================================= */

// ১. নিরাপত্তা যাচাইকরণ (টোকেন না থাকলে index.html এ পাঠিয়ে দেওয়া হবে)
const authToken = localStorage.getItem("csnAuthToken");
if (!authToken) {
  window.location.href = "index.html";
}

const CONFIG = {
  RENDER_API_URL: "https://cns-news-admin.onrender.com/api/posts", 
  ADMIN_API_KEY: "csn_secure_token_2026",
  MAX_IMAGE_BYTES: 1.5 * 1024 * 1024 
};

// প্রোফাইল ড্রপডাউন ও সাহায্য
const profileMenuBtn = document.getElementById("profileMenuBtn");
const profileDropdown = document.getElementById("profileDropdown");
const dropdownEditBtn = document.getElementById("dropdownEditBtn");
const dropdownHelpBtn = document.getElementById("dropdownHelpBtn");
const dropdownLogoutBtn = document.getElementById("dropdownLogoutBtn");
const helpLinkFooter = document.getElementById("helpLinkFooter");

// পোস্ট ফর্ম এলিমেন্ট
const postForm = document.getElementById("postForm");
const headlineInput = document.getElementById("headline");
const bodyInput = document.getElementById("body");
const categorySelect = document.getElementById("category");
const districtSelect = document.getElementById("district");
const editorInput = document.getElementById("editor");
const postDateInput = document.getElementById("postDate");

// ইমেজ ১ এলিমেন্ট
const imageInput = document.getElementById("image");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const imageAlert = document.getElementById("imageAlert");

// ইমেজ ২ এলিমেন্ট (নতুন)
const image2Container = document.getElementById("image2Container");
const image2Input = document.getElementById("image2");
const fileNameDisplay2 = document.getElementById("fileNameDisplay2");
const imageAlert2 = document.getElementById("imageAlert2");

const formAlert = document.getElementById("formAlert");

// লাইভ প্রিভিউ এলিমেন্ট
const previewCategory = document.getElementById("previewCategory");
const previewDistrict = document.getElementById("previewDistrict");
const previewHeadline = document.getElementById("previewHeadline");
const previewBody = document.getElementById("previewBody");
const previewImage = document.getElementById("previewImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const previewEditor = document.getElementById("previewEditor");
const previewDate = document.getElementById("previewDate");

// পপআপ মোডাল এলিমেন্ট
const progressModal = document.getElementById("progressModal");
const progressModalCard = progressModal.querySelector(".modal-card");
const modalProgressStage = document.getElementById("modalProgressStage");
const modalProgressText = document.getElementById("modalProgressText");
const modalProgressBarFill = document.getElementById("modalProgressBarFill");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const progressRingBar = document.getElementById("progressRingBar");
const modalRingContainer = document.getElementById("modalRingContainer");
const modalProgressBarContainer = document.getElementById("modalProgressBarContainer");

const modalSuccessIcon = document.getElementById("modalSuccessIcon");
const modalErrorIcon = document.getElementById("modalErrorIcon");
const modalSuccessActions = document.getElementById("modalSuccessActions");
const modalErrorActions = document.getElementById("modalErrorActions");

const modalSuccessCloseBtn = document.getElementById("modalSuccessCloseBtn");
const modalErrorCloseBtn = document.getElementById("modalErrorCloseBtn");
const successAudio = document.getElementById("successAudio");

const footerYear = document.getElementById("footerYear");
const ringCircumference = 377;

// ড্রপডাউন কন্ট্রোল
profileMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!profileDropdown.contains(e.target) && e.target !== profileMenuBtn) {
    profileDropdown.classList.remove("active");
  }
});

dropdownEditBtn.addEventListener("click", () => {
  profileDropdown.classList.remove("active");
  window.location.href = "edit.html";
});

dropdownHelpBtn.addEventListener("click", () => {
  profileDropdown.classList.remove("active");
  window.location.href = "help.html";
});

dropdownLogoutBtn.addEventListener("click", () => {
  profileDropdown.classList.remove("active");
  triggerLogout();
});

helpLinkFooter.addEventListener("click", () => {
  window.location.href = "help.html";
});

function triggerLogout() {
  sessionStorage.removeItem("csnAdminAuthed");
  localStorage.removeItem("csnEditorName");
  window.location.href = "index.html";
}

function showAlert(el, message, type) {
  if(!el) return;
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.hidden = false;
}
function hideAlert(el) {
  if(!el) return;
  el.hidden = true;
  el.textContent = "";
}

// তারিখ সেটআপ
function setTodayDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const formatted = `${yyyy}-${mm}-${dd}`;
  postDateInput.value = formatted;
  updatePreviewDate(formatted);
}

function toBengaliDate(isoDate) {
  try {
    const date = new Date(`${isoDate}T00:00:00`);
    return date.toLocaleDateString("bn-IN", { year: "numeric", month: "long", day: "numeric" });
  } catch (err) {
    return isoDate;
  }
}

function updatePreviewDate(isoDate) {
  previewDate.textContent = isoDate ? toBengaliDate(isoDate) : "—";
}

// লাইভ প্রিভিউ লজিক (নতুন ইমেজ ২ ইনজেকশন সহ)
function updateBodyPreview() {
  const text = bodyInput.value.trim() || "সংবাদের বিবরণ এখানে সরাসরি প্রদর্শিত হবে যখন আপনি বাম পাশে টাইপ করবেন।";
  
  if (image2Input && image2Input.files && image2Input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const middleIndex = Math.floor(text.length / 2);
      const splitIndex = text.indexOf(" ", middleIndex) !== -1 ? text.indexOf(" ", middleIndex) : middleIndex;
      
      const part1 = text.substring(0, splitIndex);
      const part2 = text.substring(splitIndex);
      
      previewBody.innerHTML = `${part1}<br><br><img src="${e.target.result}" alt="News Image 2" style="width:100%; border-radius:8px; margin: 10px 0;"><br><br>${part2}`;
    };
    reader.readAsDataURL(image2Input.files[0]);
  } else {
    previewBody.textContent = text;
  }
}

headlineInput.addEventListener("input", () => {
  previewHeadline.textContent = headlineInput.value.trim() || "এখানে শিরোনাম দেখা যাবে";
});

bodyInput.addEventListener("input", updateBodyPreview);

categorySelect.addEventListener("change", () => {
  previewCategory.textContent = categorySelect.value || "বিভাগ";
});

districtSelect.addEventListener("change", () => {
  previewDistrict.textContent = districtSelect.value || "জেলা";
});

editorInput.addEventListener("input", () => {
  previewEditor.textContent = `সম্পাদক: ${editorInput.value.trim() || "—"}`;
});

// প্রথম ছবি হ্যান্ডলার
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  hideAlert(imageAlert);

  if (!file) {
    fileNameDisplay.textContent = "No file chosen";
    clearPreviewImage();
    if(image2Container) image2Container.hidden = true; // প্রথমটা না থাকলে দ্বিতীয় অপশন লুকানো থাকবে
    return;
  }

  if (file.size > CONFIG.MAX_IMAGE_BYTES) {
    showAlert(imageAlert, "ছবির আকার ১.৫ MB এর বেশি হতে পারবে না। অন্য ছবি বেছে নিন।", "error");
    imageInput.value = "";
    fileNameDisplay.textContent = "No file chosen";
    clearPreviewImage();
    if(image2Container) image2Container.hidden = true;
    return;
  }

  fileNameDisplay.textContent = file.name;
  if(image2Container) image2Container.hidden = false; // সফলভাবে প্রথমটা দিলে দ্বিতীয় অপশন দেখাবে

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.hidden = false;
    previewPlaceholder.hidden = true;
  };
  reader.readAsDataURL(file);
});

// দ্বিতীয় ছবি হ্যান্ডলার (ঐচ্ছিক)
if(image2Input) {
  image2Input.addEventListener("change", () => {
    const file = image2Input.files[0];
    hideAlert(imageAlert2);

    if (!file) {
      fileNameDisplay2.textContent = "No file chosen";
      updateBodyPreview();
      return;
    }

    if (file.size > CONFIG.MAX_IMAGE_BYTES) {
      showAlert(imageAlert2, "ছবির আকার ১.৫ MB এর বেশি হতে পারবে না।", "error");
      image2Input.value = "";
      fileNameDisplay2.textContent = "No file chosen";
      updateBodyPreview();
      return;
    }

    fileNameDisplay2.textContent = file.name;
    updateBodyPreview(); // দ্বিতীয় ছবি সিলেক্ট হলে টেক্সটের মাঝে প্রিভিউ আপডেট হবে
  });
}

function clearPreviewImage() {
  previewImage.src = "";
  previewImage.hidden = true;
  previewPlaceholder.hidden = false;
}

// মোডাল আনীমেশন লজিক
let progressPercent = 0;
let progressInterval = null;

function setRingOffset(percent) {
  const offset = ringCircumference - (percent / 100) * ringCircumference;
  progressRingBar.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
  progressRingBar.style.strokeDashoffset = offset;
}

function openProgressModal() {
  progressPercent = 0;
  progressModal.hidden = false;
  
  progressModalCard.classList.remove('is-success', 'is-error');
  modalProgressStage.style.display = "block";
  modalRingContainer.style.display = "flex";
  modalProgressBarContainer.style.display = "block";
  
  modalSuccessIcon.hidden = true;
  modalErrorIcon.hidden = true;
  modalSuccessActions.hidden = true;
  modalErrorActions.hidden = true;
  
  modalTitle.textContent = "সংবাদ প্রকাশ করা হচ্ছে...";
  modalSubtitle.textContent = "অনুগ্রহ করে অপেক্ষা করুন, আপনার সংবাদটি সার্ভারে পাঠানো হচ্ছে।";
  
  updateProgressUI(0);
}

function startProgressSimulation() {
  progressInterval = setInterval(() => {
    if (progressPercent < 90) {
      progressPercent += Math.floor(Math.random() * 8) + 4;
    } else if (progressPercent < 95) {
      progressPercent += 1;
    }
    
    if (progressPercent > 95) progressPercent = 95;
    updateProgressUI(progressPercent);
  }, 220);
}

function updateProgressUI(percent) {
  modalProgressText.textContent = `${Math.round(percent)}%`;
  modalProgressBarFill.style.width = `${percent}%`;
  setRingOffset(percent);
}

function finishUploadSuccess() {
  clearInterval(progressInterval);
  let endPercent = progressPercent;
  const finishInterval = setInterval(() => {
    if (endPercent < 100) {
      endPercent += 4;
      if (endPercent > 100) endPercent = 100;
      updateProgressUI(endPercent);
    } else {
      clearInterval(finishInterval);
      try {
        successAudio.currentTime = 0;
        successAudio.play().catch(e => console.log("সাউন্ড প্লে অবরুদ্ধ: ", e));
      } catch (err) {}
      
      setTimeout(() => {
        modalProgressStage.style.display = "none";
        modalRingContainer.style.display = "none";
        modalProgressBarContainer.style.display = "none";
        
        progressModalCard.classList.add('is-success');
        modalSuccessIcon.hidden = false;
        modalTitle.textContent = "প্রকাশিত হয়েছে!";
        modalSubtitle.textContent = "আপনার সংবাদটি সফলভাবে প্রকাশিত হয়েছে।";
        modalSuccessActions.hidden = false;
      }, 250);
    }
  }, 20);
}

function finishUploadError(errorMessage) {
  clearInterval(progressInterval);
  setTimeout(() => {
    modalProgressStage.style.display = "none";
    modalRingContainer.style.display = "none";
    modalProgressBarContainer.style.display = "none";
    
    progressModalCard.classList.add('is-error');
    modalErrorIcon.hidden = false;
    modalTitle.textContent = "প্রকাশ ব্যর্থ হয়েছে";
    modalSubtitle.textContent = errorMessage || "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।";
    modalErrorActions.hidden = false;
  }, 250);
}

modalSuccessCloseBtn.addEventListener("click", () => {
  progressModal.hidden = true;
  resetPostForm();
});

modalErrorCloseBtn.addEventListener("click", () => {
  progressModal.hidden = true;
});

// ফর্ম সাবমিশন
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert(formAlert);

  const missing = [];
  if (!headlineInput.value.trim()) missing.push("Headline");
  if (!bodyInput.value.trim()) missing.push("News details");
  if (!categorySelect.value) missing.push("Category");
  if (!districtSelect.value) missing.push("District");
  if (!editorInput.value.trim()) missing.push("Editor");
  if (!imageInput.files[0]) missing.push("Cover image");

  if (missing.length > 0) {
    showAlert(formAlert, `অনুগ্রহ করে পূরণ করুন: ${missing.join(", ")}`, "error");
    return;
  }

  openProgressModal();
  startProgressSimulation();

  const formData = new FormData();
  formData.append("headline", headlineInput.value.trim());
  formData.append("body", bodyInput.value.trim());
  formData.append("category", categorySelect.value);
  formData.append("district", districtSelect.value);
  formData.append("editor", editorInput.value.trim());
  formData.append("date", postDateInput.value);
  
  // প্রথম ইমেজ যুক্ত করা হলো
  formData.append("image", imageInput.files[0]);
  
  // দ্বিতীয় ইমেজ থাকলে যুক্ত করা হবে
  if (image2Input && image2Input.files[0]) {
    formData.append("image2", image2Input.files[0]);
  }

  try {
    const response = await fetch(CONFIG.RENDER_API_URL, {
      method: "POST",
      headers: { "x-api-key": CONFIG.ADMIN_API_KEY },
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      finishUploadSuccess();
    } else {
      throw new Error(result.message || "সংবাদ প্রকাশ করা যায়নি।");
    }
  } catch (err) {
    finishUploadError(err.message || "সংবাদ প্রকাশ করা যায়নি।");
  }
});

function resetPostForm() {
  postForm.reset();
  fileNameDisplay.textContent = "No file chosen";
  hideAlert(imageAlert);
  clearPreviewImage();
  
  // ইমেজ ২ এর ডেটা রিসেট
  if(image2Input) image2Input.value = "";
  if(fileNameDisplay2) fileNameDisplay2.textContent = "No file chosen";
  if(image2Container) image2Container.hidden = true;
  hideAlert(imageAlert2);
  
  previewHeadline.textContent = "এখানে শিরোনাম দেখা যাবে";
  previewBody.textContent = "সংবাদের বিবরণ এখানে সরাসরি প্রদর্শিত হবে যখন আপনি বাম পাশে টাইপ করবেন।";
  previewCategory.textContent = "বিভাগ";
  previewDistrict.textContent = "জেলা";
  loadDashboardData();
}

function loadDashboardData() {
  setTodayDate();
  const savedEditor = localStorage.getItem("csnEditorName");
  if (savedEditor) {
    editorInput.value = savedEditor;
    previewEditor.textContent = `সম্পাদক: ${savedEditor}`;
  } else {
    editorInput.value = "";
    previewEditor.textContent = "সম্পাদক: —";
  }
}

// ইনিশিয়ালাইজেশন
(function init() {
  if(footerYear) footerYear.textContent = new Date().getFullYear();
  loadDashboardData();
})();
