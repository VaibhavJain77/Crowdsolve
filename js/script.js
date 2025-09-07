
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  doc,
  deleteDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaGziLoGXLFChveGs-M_7s4GEoNpl8njU",
  authDomain: "crowdsolve-2b898.firebaseapp.com",
  projectId: "crowdsolve-2b898",
  storageBucket: "crowdsolve-2b898.appspot.com",
  messagingSenderId: "639065877216",
  appId: "1:639065877216:web:45d5def00363167fcfbe85",
  measurementId: "G-RFGMLW4143",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const problemsContainer = document.getElementById("problems-container");
const loggedInView = document.getElementById("logged-in-view");
const loggedOutView = document.getElementById("logged-out-view");
const signOutBtn = document.getElementById("sign-out-btn");
const userGreeting = document.getElementById("user-greeting");
const authModal = document.getElementById("auth-modal");
const problemModal = document.getElementById("problem-modal");
const problemDetailModal = document.getElementById(
  "problem-detail-modal"
);
const myContentModal = document.getElementById("my-content-modal");
const allModals = [
  authModal,
  problemModal,
  problemDetailModal,
  myContentModal,
];
const closeModalBtns = document.querySelectorAll(".close-modal-btn");
const openSigninBtn = document.getElementById("open-signin-modal-btn");
const openSignupBtn = document.getElementById("open-signup-modal-btn");
const postProblemBtns = [
  document.getElementById("post-problem-btn-nav"),
  document.getElementById("post-problem-btn-hero"),
  document.getElementById("post-problem-btn-cta"),
];
const myContentBtn = document.getElementById("my-content-btn");
const mainSignupTab = document.getElementById("main-signup-tab");
const mainSigninTab = document.getElementById("main-signin-tab");
const signupView = document.getElementById("signup-view");
const signinView = document.getElementById("signin-view");
const signupEmailTab = document.getElementById("signup-email-tab");
const signupPhoneTab = document.getElementById("signup-phone-tab");
const signupEmailView = document.getElementById("signup-email-view");
const signupPhoneView = document.getElementById("signup-phone-view");
const signinEmailTab = document.getElementById("signin-email-tab");
const signinPhoneTab = document.getElementById("signin-phone-tab");
const signinEmailView = document.getElementById("signin-email-view");
const signinPhoneView = document.getElementById("signin-phone-view");
const signupFormEmail = document.getElementById("signup-form-email");
const signinFormEmail = document.getElementById("signin-form-email");
const signupPhoneNameInput = document.getElementById("signup-phone-name");
const signupPhoneNumberInput = document.getElementById(
  "signup-phone-number"
);

const recordSolutionBtn = document.getElementById('record-solution-btn');
const stopSolutionBtn = document.getElementById('stop-solution-btn');
const recordingSolutionStatus = document.getElementById('recording-solution-status');
const audioSolutionPlayback = document.getElementById('audio-solution-playback');
const audioSolutionPlaybackContainer = document.getElementById('audio-solution-playback-container');
const deleteSolutionAudioBtn = document.getElementById('delete-solution-audio-btn');
const takeSolutionPhotoBtn = document.getElementById('take-solution-photo-btn');
const cameraSolutionView = document.getElementById('camera-solution-view');
const videoSolutionStreamEl = document.getElementById('video-solution-stream');
const captureSolutionBtn = document.getElementById('capture-solution-btn');
const photoSolutionCanvas = document.getElementById('photo-solution-canvas');
const photoSolutionPreview = document.getElementById('photo-solution-preview');
const photoSolutionPreviewContainer = document.getElementById('photo-solution-preview-container');
const deleteSolutionPhotoBtn = document.getElementById('delete-solution-photo-btn');

let solutionAudioChunks = [], solutionAudioBlob = null, solutionImageBlob = null, solutionVideoStream = null;
const signupSendOtpBtn = document.getElementById("signup-send-otp-btn");
const signupOtpCodeInput = document.getElementById("signup-otp-code");
const signupVerifyOtpBtn = document.getElementById(
  "signup-verify-otp-btn"
);
const signupPhoneEntry = document.getElementById("signup-phone-entry");
const signupOtpEntry = document.getElementById("signup-otp-entry");
const signinPhoneNumberInput = document.getElementById(
  "signin-phone-number"
);
const signinSendOtpBtn = document.getElementById("signin-send-otp-btn");
const signinOtpCodeInput = document.getElementById("signin-otp-code");
const signinVerifyOtpBtn = document.getElementById(
  "signin-verify-otp-btn"
);
const signinPhoneEntry = document.getElementById("signin-phone-entry");
const signinOtpEntry = document.getElementById("signin-otp-entry");
const problemForm = document.getElementById("problem-form");
const solutionForm = document.getElementById("solution-form");
const recordBtn = document.getElementById("record-btn");
const stopBtn = document.getElementById("stop-btn");
const recordingStatus = document.getElementById("recording-status");
const audioPlayback = document.getElementById("audio-playback");
const audioPlaybackContainer = document.getElementById(
  "audio-playback-container"
);
const deleteAudioBtn = document.getElementById("delete-audio-btn");
const takePhotoBtn = document.getElementById("take-photo-btn");
const cameraView = document.getElementById("camera-view");
const videoStreamEl = document.getElementById("video-stream");
const captureBtn = document.getElementById("capture-btn");
const photoCanvas = document.getElementById("photo-canvas");
const photoPreview = document.getElementById("photo-preview");
const photoPreviewContainer = document.getElementById(
  "photo-preview-container"
);
const deletePhotoBtn = document.getElementById("delete-photo-btn");
const toastEl = document.getElementById("toast-notification");
const toastMessageEl = document.getElementById("toast-message");
const confirmationModal = document.getElementById("confirmation-modal");
const confirmationTitle = document.getElementById("confirmation-title");
const confirmationMessage = document.getElementById(
  "confirmation-message"
);

let mediaRecorder,
  audioChunks = [],
  audioBlob = null,
  capturedImageBlob = null,
  videoStream = null,
  toastTimeout;

function showToast(message, type = "info") {
  clearTimeout(toastTimeout);
  toastMessageEl.textContent = message;
  toastEl.classList.remove(
    "bg-emerald-500",
    "bg-red-500",
    "bg-slate-700"
  );
  if (type === "success") toastEl.classList.add("bg-emerald-500");
  else if (type === "error") toastEl.classList.add("bg-red-500");
  else toastEl.classList.add("bg-slate-700");
  toastEl.classList.add("show");
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}
// --- LIVE MEDIA CAPTURE FOR SOLUTIONS ---
recordSolutionBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) solutionAudioChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      solutionAudioBlob = new Blob(solutionAudioChunks, { type: 'audio/webm' });
      audioSolutionPlayback.src = URL.createObjectURL(solutionAudioBlob);
      audioSolutionPlaybackContainer.classList.remove('hidden');
      solutionAudioChunks = [];
    };
    mediaRecorder.start();
    recordSolutionBtn.disabled = true; stopSolutionBtn.disabled = false; recordingSolutionStatus.textContent = "Recording...";
  } catch (e) { showToast("Microphone access was denied.", 'error'); }
});

stopSolutionBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordSolutionBtn.disabled = false; stopSolutionBtn.disabled = true; recordingSolutionStatus.textContent = "Recording stopped.";
  }
});

deleteSolutionAudioBtn.addEventListener('click', () => {
  solutionAudioBlob = null; audioSolutionPlayback.src = '';
  audioSolutionPlaybackContainer.classList.add('hidden');
  recordingSolutionStatus.textContent = "";
  showToast('Solution recording deleted.');
});

takeSolutionPhotoBtn.addEventListener('click', async () => {
  if (solutionVideoStream) {
    solutionVideoStream.getTracks().forEach(t => t.stop()); solutionVideoStream = null; cameraSolutionView.classList.add('hidden'); return;
  }
  try {
    solutionVideoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoSolutionStreamEl.srcObject = solutionVideoStream; cameraSolutionView.classList.remove('hidden');
  } catch (e) { showToast("Camera access was denied.", 'error'); }
});

captureSolutionBtn.addEventListener('click', () => {
  photoSolutionCanvas.width = videoSolutionStreamEl.videoWidth; photoSolutionCanvas.height = videoSolutionStreamEl.videoHeight;
  photoSolutionCanvas.getContext('2d').drawImage(videoSolutionStreamEl, 0, 0, photoSolutionCanvas.width, photoSolutionCanvas.height);
  photoSolutionCanvas.toBlob(b => {
    solutionImageBlob = b; photoSolutionPreview.src = URL.createObjectURL(b); photoSolutionPreviewContainer.classList.remove('hidden');
  }, 'image/jpeg');
  solutionVideoStream.getTracks().forEach(t => t.stop()); solutionVideoStream = null; cameraSolutionView.classList.add('hidden');
});

deleteSolutionPhotoBtn.addEventListener('click', () => {
  solutionImageBlob = null; photoSolutionPreview.src = '';
  photoSolutionPreviewContainer.classList.add('hidden');
  document.getElementById('image-solution').value = '';
  showToast('Solution photo deleted.');
});
function showConfirmation(
  title = "Are you sure?",
  message = "This action cannot be undone."
) {
  return new Promise((resolve) => {
    confirmationTitle.textContent = title;
    confirmationMessage.textContent = message;
    const confirmActionBtn =
      document.getElementById("confirm-action-btn");
    const confirmCancelBtn =
      document.getElementById("confirm-cancel-btn");
    confirmationModal.classList.remove("hidden");
    setTimeout(() => confirmationModal.classList.add("opacity-100"), 10);
    const close = (result) => {
      confirmationModal.classList.remove("opacity-100");
      setTimeout(() => confirmationModal.classList.add("hidden"), 300);
      resolve(result);
    };
    const newActionBtn = confirmActionBtn.cloneNode(true);
    confirmActionBtn.parentNode.replaceChild(
      newActionBtn,
      confirmActionBtn
    );
    const newCancelBtn = confirmCancelBtn.cloneNode(true);
    confirmCancelBtn.parentNode.replaceChild(
      newCancelBtn,
      confirmCancelBtn
    );
    newActionBtn.onclick = () => close(true);
    newCancelBtn.onclick = () => close(false);
  });
}

const openModal = (modal, view = "signup") => {
  if (modal === authModal) {
    if (view === "signup") mainSignupTab.click();
    else mainSigninTab.click();
  }
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("opacity-100"), 10);
};
const closeModal = (modal) => {
  modal.classList.remove("opacity-100");
  setTimeout(() => modal.classList.add("hidden"), 300);
};

const guestSigninBtn = document.getElementById("guest-signin-btn");


guestSigninBtn.addEventListener("click", async () => {
  try {
    await signInAnonymously(auth);
    closeModal(authModal);
    showToast("Signed in as a guest.", "success");
  } catch (error) {
    console.error("Guest sign-in failed:", error);
    showToast(`Error: ${error.message}`, "error");
  }
});
openSignupBtn.addEventListener("click", () =>
  openModal(authModal, "signup")
);
openSigninBtn.addEventListener("click", () =>
  openModal(authModal, "signin")
);
myContentBtn.addEventListener("click", () => {
  openModal(myContentModal);
  fetchMyContent();
});
closeModalBtns.forEach((btn) =>
  btn.addEventListener("click", () => allModals.forEach(closeModal))
);
allModals.forEach((modal) =>
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  })
);

mainSignupTab.addEventListener("click", () => {
  mainSignupTab.className = mainSignupTab.className.replace(
    "auth-tab-inactive",
    "auth-tab-active"
  );
  mainSigninTab.className = mainSigninTab.className.replace(
    "auth-tab-active",
    "auth-tab-inactive"
  );
  signupView.classList.remove("hidden");
  signinView.classList.add("hidden");
  setupRecaptcha();
});
mainSigninTab.addEventListener("click", () => {
  mainSigninTab.className = mainSigninTab.className.replace(
    "auth-tab-inactive",
    "auth-tab-active"
  );
  mainSignupTab.className = mainSignupTab.className.replace(
    "auth-tab-active",
    "auth-tab-inactive"
  );
  signinView.classList.remove("hidden");
  signupView.classList.add("hidden");
  setupRecaptcha();
});
function handleSubTabClick(
  activeTab,
  inactiveTab,
  activeView,
  inactiveView
) {
  activeTab.className = activeTab.className.replace(
    "auth-tab-inactive",
    "auth-tab-active"
  );
  inactiveTab.className = inactiveTab.className.replace(
    "auth-tab-active",
    "auth-tab-inactive"
  );
  activeView.classList.remove("hidden");
  inactiveView.classList.add("hidden");
  if (activeTab === signupPhoneTab || activeTab === signinPhoneTab)
    setupRecaptcha();
}
signupEmailTab.addEventListener("click", () =>
  handleSubTabClick(
    signupEmailTab,
    signupPhoneTab,
    signupEmailView,
    signupPhoneView
  )
);
signupPhoneTab.addEventListener("click", () =>
  handleSubTabClick(
    signupPhoneTab,
    signupEmailTab,
    signupPhoneView,
    signupEmailView
  )
);
signinEmailTab.addEventListener("click", () =>
  handleSubTabClick(
    signinEmailTab,
    signinPhoneTab,
    signinEmailView,
    signinPhoneView
  )
);
signinPhoneTab.addEventListener("click", () =>
  handleSubTabClick(
    signinPhoneTab,
    signinEmailTab,
    signinPhoneView,
    signinEmailView
  )
);

function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
    window.recaptchaVerifier.render();
  }
}
signupSendOtpBtn.addEventListener("click", () => {
  const name = signupPhoneNameInput.value;
  if (!name) return showToast("Please enter your name.", "error");
  signInWithPhoneNumber(
    auth,
    signupPhoneNumberInput.value,
    window.recaptchaVerifier
  )
    .then((c) => {
      window.confirmationResult = c;
      showToast("OTP sent successfully!", "success");
      signupPhoneEntry.classList.add("hidden");
      signupOtpEntry.classList.remove("hidden");
    })
    .catch((e) => showToast(`Error sending OTP: ${e.message}`, "error"));
});
signupVerifyOtpBtn.addEventListener("click", () => {
  if (!window.confirmationResult)
    return showToast("Please send OTP first.", "error");
  window.confirmationResult
    .confirm(signupOtpCodeInput.value)
    .then(async (r) => {
      await updateProfile(r.user, {
        displayName: signupPhoneNameInput.value,
      });
      closeModal(authModal);
      showToast("Account created successfully!", "success");
    })
    .catch((e) => showToast(`Invalid OTP: ${e.message}`, "error"));
});
signinSendOtpBtn.addEventListener("click", () => {
  signInWithPhoneNumber(
    auth,
    signinPhoneNumberInput.value,
    window.recaptchaVerifier
  )
    .then((c) => {
      window.confirmationResult = c;
      showToast("OTP sent successfully!", "success");
      signinPhoneEntry.classList.add("hidden");
      signinOtpEntry.classList.remove("hidden");
    })
    .catch((e) => showToast(`Error sending OTP: ${e.message}`, "error"));
});
signinVerifyOtpBtn.addEventListener("click", () => {
  if (!window.confirmationResult)
    return showToast("Please send OTP first.", "error");
  window.confirmationResult
    .confirm(signinOtpCodeInput.value)
    .then(() => {
      closeModal(authModal);
      showToast("Signed in successfully!", "success");
    })
    .catch((e) => showToast(`Invalid OTP: ${e.message}`, "error"));
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedInView.classList.remove("hidden");
    loggedInView.classList.add("flex");
    loggedOutView.classList.add("hidden");
    loggedOutView.classList.remove("flex");

    //Check if user is anonymous
    if (user.isAnonymous) {
      userGreeting.textContent = `Hi, Guest`;
    } else {
      userGreeting.textContent = `Hi, ${user.displayName || "User"}`;
    }
  } else {
    loggedOutView.classList.remove("hidden");
    loggedOutView.classList.add("flex");
    loggedInView.classList.add("hidden");
    loggedInView.classList.remove("flex");
    userGreeting.textContent = "";
  }
  fetchAndRenderProblems();
});

signupFormEmail.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      signupFormEmail["signup-email"].value,
      signupFormEmail["signup-password"].value
    );
    await updateProfile(cred.user, {
      displayName: signupFormEmail["signup-name"].value,
    });
    await sendEmailVerification(cred.user);
    showToast("Sign-up successful! Verification email sent.", "success");
    closeModal(authModal);
  } catch (error) {
    showToast(`Error: ${error.message}`, "error");
  }
});
signinFormEmail.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(
      auth,
      signinFormEmail["signin-email"].value,
      signinFormEmail["signin-password"].value
    );
    showToast("Signed in successfully!", "success");
    closeModal(authModal);
  } catch (error) {
    showToast(`Error: ${error.message}`, "error");
  }
});
signOutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showToast("Signed out.");
  } catch (error) {
    console.error("Sign out error:", error);
    showToast("Sign out failed.", "error");
  }
});

postProblemBtns.forEach(
  (btn) =>
    btn &&
    btn.addEventListener("click", () =>
      auth.currentUser
        ? openModal(problemModal)
        : openModal(authModal, "signin")
    )
);

recordBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      audioPlayback.src = URL.createObjectURL(audioBlob);
      audioPlaybackContainer.classList.remove("hidden");
      audioChunks = [];
    };
    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    recordingStatus.textContent = "Recording...";
  } catch (e) {
    showToast("Microphone access was denied.", "error");
    console.error(e);
  }
});
stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
    recordingStatus.textContent = "Recording stopped.";
  }
});
deleteAudioBtn.addEventListener("click", () => {
  audioBlob = null;
  audioPlayback.src = "";
  audioPlaybackContainer.classList.add("hidden");
  recordingStatus.textContent = "";
  showToast("Recording deleted.");
});
takePhotoBtn.addEventListener("click", async () => {
  if (videoStream) {
    videoStream.getTracks().forEach((t) => t.stop());
    videoStream = null;
    cameraView.classList.add("hidden");
    return;
  }
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoStreamEl.srcObject = videoStream;
    cameraView.classList.remove("hidden");
  } catch (e) {
    showToast("Camera access was denied.", "error");
    console.error(e);
  }
});
captureBtn.addEventListener("click", () => {
  photoCanvas.width = videoStreamEl.videoWidth;
  photoCanvas.height = videoStreamEl.videoHeight;
  photoCanvas
    .getContext("2d")
    .drawImage(
      videoStreamEl,
      0,
      0,
      photoCanvas.width,
      photoCanvas.height
    );
  photoCanvas.toBlob((b) => {
    capturedImageBlob = b;
    photoPreview.src = URL.createObjectURL(b);
    photoPreviewContainer.classList.remove("hidden");
  }, "image/jpeg");
  videoStream.getTracks().forEach((t) => t.stop());
  videoStream = null;
  cameraView.classList.add("hidden");
});
deletePhotoBtn.addEventListener("click", () => {
  capturedImageBlob = null;
  photoPreview.src = "";
  photoPreviewContainer.classList.add("hidden");
  document.getElementById("image").value = "";
  showToast("Photo deleted.");
});

const createProblemCard = (p, id) => {
  const colors = {
    Tech: "bg-sky-500/20 text-sky-300",
    Social: "bg-emerald-500/20 text-emerald-300",
    Growth: "bg-purple-500/20 text-purple-300",
    Education: "bg-amber-500/20 text-amber-300",
  };
  const isOwner = auth.currentUser && auth.currentUser.uid === p.authorId;

  let descriptionText = "Audio/Image problem - Click to view.";
  if (
    p.description &&
    typeof p.description === "string" &&
    p.description.trim() !== ""
  ) {
    descriptionText = p.description.substring(0, 100) + "...";
  }

  return `<div class="feature-card p-6 rounded-xl flex flex-col justify-between"><div>${p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${p.title}" class="w-full h-40 object-cover rounded-lg mb-4">`
    : ""
    }<div class="flex justify-between items-start"><span class="text-xs text-slate-400">posted by ${p.authorName || "Anonymous"
    }</span>${isOwner
      ? `<button class="delete-problem-btn text-red-400 hover:text-red-300 text-xs font-semibold" data-id="${id}">DELETE</button>`
      : ""
    }</div><h3 class="text-xl font-bold text-slate-100 mt-1 mb-2">${p.title
    }</h3><p class="text-slate-400 text-sm mb-4">${descriptionText}</p></div><div class="flex justify-between items-center mt-4"><span class="${colors[p.category] || "bg-slate-500/20 text-slate-300"
    } px-3 py-1 rounded-full text-xs font-medium">${p.category
    }</span><button class="view-solutions-btn text-sky-400 hover:text-sky-300 text-sm font-semibold" data-id="${id}">View Solutions &rarr;</button></div></div>`;
};

const fetchAndRenderProblems = async () => {
  try {
    const q = query(
      collection(db, "problems"),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      problemsContainer.innerHTML =
        '<p class="text-slate-500 text-center col-span-full">No problems posted yet. Be the first!</p>';
      return;
    }
    window.problemsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    problemsContainer.innerHTML = window.problemsData
      .map((p) => createProblemCard(p, p.id))
      .join("");
  } catch (e) {
    console.error("Error fetching problems: ", e);
    problemsContainer.innerHTML =
      '<p class="text-red-400 text-center col-span-full">Could not load problems.</p>';
  }
};

problemsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-problem-btn")) {
    const problemId = e.target.dataset.id;
    const confirmed = await showConfirmation(
      "Delete Problem?",
      "This will permanently delete the problem and all its solutions."
    );
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "problems", problemId));
        fetchAndRenderProblems();
        showToast("Problem deleted.", "success");
      } catch (err) {
        showToast(`Error deleting problem: ${err.message}`, "error");
      }
    }
  }
  if (e.target.classList.contains("view-solutions-btn")) {
    const p = window.problemsData.find(
      (p) => p.id === e.target.dataset.id
    );
    if (p) renderProblemDetail(p);
  }
});

const renderProblemDetail = async (p) => {
  document.getElementById(
    "problem-detail-header"
  ).innerHTML = `<div><h2 class="text-2xl md:text-3xl font-bold gradient-text">${p.title
  }</h2><p class="text-sm text-slate-400 mt-1">By: ${p.authorName || "Anonymous"
    }</p></div>`;
  let bodyHTML = "";
  if (p.audioUrl) {
    bodyHTML += `<div class="mt-2"><h4 class="text-slate-400 text-sm font-semibold mb-2">LISTEN TO THE PROBLEM:</h4><audio controls src="${p.audioUrl}" class="w-full"></audio></div>`;
  }
  if (p.description) {
    bodyHTML += `<p class="text-slate-300 whitespace-pre-wrap mt-4">${p.description}</p>`;
  }
  if (p.imageUrl) {
    bodyHTML += `<img src="${p.imageUrl}" alt="${p.title}" class="w-full max-h-96 object-contain rounded-lg mt-4">`;
  }
  document.getElementById("problem-detail-body").innerHTML = bodyHTML;

  const initialSuggestionsEl = document.getElementById(
    "ai-initial-suggestions-text"
  );
  if (p.aiSuggestions)
    typewriterEffect(initialSuggestionsEl, p.aiSuggestions, 20);
  else
    initialSuggestionsEl.innerHTML = `<p class="text-slate-400">No initial AI suggestions were generated.</p>`;

  const summaryEl = document.getElementById("ai-summary-text");
  summaryEl.innerHTML = `<p class="text-sm text-slate-400">Click "Analyze" to generate a summary of the top 3 community solutions.</p>`;
  const generateSummaryBtn = document.getElementById(
    "generate-summary-btn"
  );
  generateSummaryBtn.disabled = false;

  const newBtn = generateSummaryBtn.cloneNode(true);
  generateSummaryBtn.parentNode.replaceChild(newBtn, generateSummaryBtn);
  newBtn.addEventListener("click", async () => {
    newBtn.disabled = true;
    summaryEl.innerHTML = `<div class="flex items-center gap-2"><div class="animate-spin h-4 w-4 border-2 border-sky-400 border-t-transparent rounded-full"></div><span>AI is analyzing...</span></div>`;
    try {
      const solutions = await fetchSolutions(p.id);
      if (solutions.length > 1) {
        const text = solutions.map((s) => s.text).join("\n- ");
        const summary = await getAISummary(text);
        typewriterEffect(summaryEl, summary, 20);
      } else {
        summaryEl.innerHTML = `<p class="text-slate-400">Not enough community solutions to generate a summary yet.</p>`;
      }
    } catch (e) {
      summaryEl.innerHTML = `<p class="text-red-300">Failed to generate AI summary: ${e.message}</p>`;
    }
  });

  solutionForm.dataset.problemId = p.id;
  solutionForm.dataset.problemTitle = p.title;
  fetchAndRenderSolutions(p.id);
  openModal(problemDetailModal);
};

problemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = problemForm.querySelector("#submit-problem-btn");
  const user = auth.currentUser;
  if (!user) {
    showToast("You must sign in to post.", "error");
    return openModal(authModal, "signin");
  }
  if (
    !user.emailVerified &&
    user.providerData.some((p) => p.providerId === "password")
  )
    return showToast("Please verify your email first.", "error");

  const title = problemForm["title"].value;
  const userInputDescription = problemForm["description"].value.trim();
  const imageFileFromInput = problemForm["image"].files[0];
  const finalImageFile = capturedImageBlob
    ? new File([capturedImageBlob], "capture.jpg", { type: "image/jpeg" })
    : imageFileFromInput;

  if (!title.trim())
    return showToast("A problem title is required.", "error");
  if (!userInputDescription && !audioBlob && !finalImageFile)
    return showToast(
      "Please provide a description, audio, or image.",
      "error"
    );

  submitBtn.disabled = true;

  try {
    let audioUrl = null;
    let imageUrl = null;
    let transcribedText = null;

    if (audioBlob) {
      submitBtn.textContent = "Uploading & Transcribing...";
      const audioFile = new File([audioBlob], "recording.webm", {
        type: audioBlob.type,
      });
      transcribedText = await transcribeAudio(audioFile);
      const audioFormData = new FormData();
      audioFormData.append("file", audioFile);
      audioFormData.append("upload_preset", "crowdsolve_uploads");
      audioFormData.append("resource_type", "video");
      const audioRes = await fetch(
        `https://api.cloudinary.com/v1_1/dwjebrwih/video/upload`,
        { method: "POST", body: audioFormData }
      );
      const audioData = await audioRes.json();
      if (!audioData.secure_url) throw new Error("Audio upload failed.");
      audioUrl = audioData.secure_url;
    }

    if (finalImageFile) {
      submitBtn.textContent = "Uploading Image...";
      const imgFormData = new FormData();
      imgFormData.append("file", finalImageFile);
      imgFormData.append("upload_preset", "crowdsolve_uploads");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dwjebrwih/image/upload`,
        { method: "POST", body: imgFormData }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Image upload failed.");
      imageUrl = data.secure_url;
    }

    let finalDescription = userInputDescription;
    if (transcribedText) {
      finalDescription = userInputDescription
        ? `${userInputDescription}\n\n--- Transcribed Audio ---\n${transcribedText}`
        : transcribedText;
    } else if (!finalDescription && finalImageFile) {
      finalDescription = "[Problem described in attached image]";
    }

    submitBtn.textContent = "Getting AI Suggestions...";
    let aiSuggestions = null;
    try {
      if (finalDescription) {
        const suggestionPrompt = `Problem: "${title}". Description: "${finalDescription}". Provide 2-3 brief, one-sentence initial suggestions.`;
        aiSuggestions = await getAISolution(suggestionPrompt);
      }
    } catch (aiError) {
      console.error("AI suggestion failed, but proceeding:", aiError);
      showToast(
        "Couldn't get AI suggestions, but problem will still post.",
        "info"
      );
    }

    submitBtn.textContent = "Saving Problem...";

    // --- MODIFICATION START ---

    const newProblemDataForDb = {
      title: title,
      description: finalDescription,
      category: problemForm["category"].value,
      authorId: user.uid,
      authorName: user.displayName,
      timestamp: serverTimestamp(),
      imageUrl: imageUrl,
      audioUrl: audioUrl,
      aiSuggestions: aiSuggestions,
    };

    // Save to the database and get the new document's reference
    const docRef = await addDoc(collection(db, "problems"), newProblemDataForDb);

    // Instead of re-fetching, we'll manually add the new card to the UI
    const newProblemDataForUi = {
      id: docRef.id,
      ...newProblemDataForDb,
    };

    // Create the HTML for the new card
    const newCardHTML = createProblemCard(newProblemDataForUi, newProblemDataForUi.id);

    // Add the new card to the top of the list
    problemsContainer.insertAdjacentHTML('afterbegin', newCardHTML);

    // Also add the new problem to our local data array
    window.problemsData.unshift(newProblemDataForUi);

    // --- MODIFICATION END ---

    problemForm.reset();
    audioBlob = null;
    capturedImageBlob = null;
    audioPlaybackContainer.classList.add("hidden");
    photoPreviewContainer.classList.add("hidden");
    recordingStatus.textContent = "";

    closeModal(problemModal);
    // We no longer need this, because we added the card manually: fetchAndRenderProblems();
    showToast("Problem posted successfully!", "success");

  } catch (e) {
    console.error("--- PROBLEM SUBMISSION FAILED ---", e);
    showToast(`Error: ${e.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Problem";
  }
});

const fetchSolutions = async (id) => {
  const q = query(
    collection(db, "solutions"),
    where("problemId", "==", id),
    orderBy("timestamp", "asc")
  );
  return (await getDocs(q)).docs.map((d) => d.data());
};

const fetchAndRenderSolutions = async (id) => {
  const listEl = document.getElementById("solutions-list");
  listEl.innerHTML = `<p class="text-slate-500">Loading solutions...</p>`;
  try {
    const snapshot = await getDocs(query(collection(db, "solutions"), where("problemId", "==", id), orderBy("timestamp", "asc")));
    if (snapshot.empty) { listEl.innerHTML = `<p class="text-slate-500">No solutions yet. Be the first!</p>`; return; }

    let solutionsHTML = "";
    snapshot.forEach((doc) => {
      const s = doc.data();
      const isOwner = auth.currentUser && auth.currentUser.uid === s.authorId;

      // --- NEW LOGIC TO BUILD THE SOLUTION CARD ---
      solutionsHTML += `
                <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-3">
                  <div class="flex justify-between items-start">
                    <p class="text-xs text-slate-400">Solution by: ${s.authorName || "Anonymous"}</p>
                    ${isOwner ? `<button class="delete-solution-btn text-red-400 hover:text-red-300 text-xs font-semibold flex-shrink-0" data-solution-id="${doc.id}" data-problem-id="${id}">DELETE</button>` : ""}
                  </div>
                  
                  ${s.imageUrl ? `<img src="${s.imageUrl}" alt="Solution Image" class="w-full max-w-md mx-auto rounded-lg object-contain">` : ""}
                  
                  ${s.audioUrl ? `<audio controls src="${s.audioUrl}" class="w-full"></audio>` : ""}
                  
                  ${s.text ? `<p class="text-slate-300 pr-4 whitespace-pre-wrap">${s.text}</p>` : ""}
                </div>
              `;
    });
    listEl.innerHTML = solutionsHTML;

  } catch (e) { listEl.innerHTML = `<p class="text-red-400">Could not load solutions. The database may require an index.</p>`; }
};

problemDetailModal.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-solution-btn")) {
    const solutionId = e.target.dataset.solutionId;
    const problemId = e.target.dataset.problemId;
    const confirmed = await showConfirmation(
      "Delete Solution?",
      "This cannot be undone."
    );
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "solutions", solutionId));
        fetchAndRenderSolutions(problemId);
        showToast("Solution deleted.", "success");
      } catch (err) {
        showToast(`Error deleting solution: ${err.message}`, "error");
      }
    }
  }
});

const fetchMyContent = async () => {
  const myProblemsEl = document.getElementById("my-problems-container");
  const mySolutionsEl = document.getElementById("my-solutions-container");
  myProblemsEl.innerHTML = `<p class="text-slate-500">Loading...</p>`;
  mySolutionsEl.innerHTML = `<p class="text-slate-500">Loading...</p>`;
  if (!auth.currentUser) return;
  try {
    const pSnapshot = await getDocs(
      query(
        collection(db, "problems"),
        where("authorId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      )
    );
    myProblemsEl.innerHTML = pSnapshot.empty
      ? `<p class="text-slate-500">You haven't posted any problems yet.</p>`
      : pSnapshot.docs
        .map((d) => {
          const p = d.data();
          return `<div class="my-content-item bg-slate-700/50 p-3 rounded-md text-sm" data-problem-id="${d.id
            }"><p class="font-semibold text-slate-200">${p.title
            }</p><p class="text-slate-400">${p.description ? p.description.substring(0, 60) + "..." : ""
            }</p></div>`;
        })
        .join("");
  } catch (e) {
    myProblemsEl.innerHTML = `<p class="text-red-400">Could not load problems. An index may be required.</p>`;
  }
  try {
    const sSnapshot = await getDocs(
      query(
        collection(db, "solutions"),
        where("authorId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      )
    );
    mySolutionsEl.innerHTML = sSnapshot.empty
      ? `<p class="text-slate-500">You haven't submitted any solutions yet.</p>`
      : sSnapshot.docs
        .map((d) => {
          const s = d.data();
          return `<div class="my-content-item bg-slate-700/50 p-3 rounded-md text-sm" data-problem-id="${s.problemId
            }"><p class="text-slate-300">"${s.text.substring(
              0,
              80
            )}..."</p><p class="text-xs text-slate-500 mt-1">on problem: <span class="font-semibold text-slate-400">${s.problemTitle
            }</span></p></div>`;
        })
        .join("");
  } catch (e) {
    mySolutionsEl.innerHTML = `<p class="text-red-400">Could not load solutions. An index may be required.</p>`;
  }
};

myContentModal.addEventListener("click", (e) => {
  const clickedItem = e.target.closest(".my-content-item");
  if (clickedItem) {
    const problemId = clickedItem.dataset.problemId;
    if (!problemId) return;
    const problemData = window.problemsData.find(
      (p) => p.id === problemId
    );
    if (problemData) {
      closeModal(myContentModal);
      renderProblemDetail(problemData);
    } else {
      showToast("Could not find the details for that problem.", "error");
    }
  }
});

document.addEventListener("DOMContentLoaded", fetchAndRenderProblems);

function typewriterEffect(el, text, speed) {
  let i = 0;
  el.innerHTML = "";
  const c = document.createElement("span");
  c.className = "typing-cursor border-r-2";
  el.appendChild(c);
  (function type() {
    if (i < text.length) {
      c.before(text.charAt(i++));
      setTimeout(type, speed);
    } else c.remove();
  })();
}

async function apiPost(endpoint, body, isJson = true) {
  const options = { method: "POST", body };
  if (isJson) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  // CORRECTED LINE: This now uses the 'endpoint' variable to build the correct URL
  const res = await fetch(`https://crowdsolve-iqa9.onrender.com/api/${endpoint}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Server error" }));
    throw new Error(
      err.error || `Request failed with status ${res.status}`
    );
  }
  return res.json();
}

async function getAISolution(query) {
  // This now correctly tells apiPost to use the '/api/solve' endpoint
  return (await apiPost("solve", { query })).solution;
}

async function getAISummary(solutionsText) {
  // This now correctly tells apiPost to use the '/api/summarize' endpoint
  return (await apiPost("summarize", { solutionsText })).summary;
}
async function transcribeAudio(audioFile) {
  const fd = new FormData();
  fd.append("audio", audioFile);
  return (await apiPost("transcribe", fd, false)).text;
}

solutionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) { showToast("You must sign in to post a solution.", 'error'); return openModal(authModal, 'signin'); }

  let userInputText = solutionForm["solution-text"].value;
  const imageFileFromInput = document.getElementById("image-solution").files[0];
  const finalImageFile = solutionImageBlob ? new File([solutionImageBlob], "solution-capture.jpg", { type: "image/jpeg" }) : imageFileFromInput;

  if (!userInputText.trim() && !solutionAudioBlob && !finalImageFile) {
    return showToast("Please provide a text, audio, or image for your solution.", "error");
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    let audioUrl = null;
    let imageUrl = null;
    let transcribedText = null;

    if (solutionAudioBlob) {
      submitBtn.textContent = "Processing Audio...";
      const audioFile = new File([solutionAudioBlob], "solution-recording.webm", { type: solutionAudioBlob.type });
      transcribedText = await transcribeAudio(audioFile);

      const audioFormData = new FormData();
      audioFormData.append("file", audioFile);
      audioFormData.append("upload_preset", "crowdsolve_uploads");
      audioFormData.append("resource_type", "video");
      const audioRes = await fetch(`https://api.cloudinary.com/v1_1/dwjebrwih/video/upload`, { method: "POST", body: audioFormData });
      const audioData = await audioRes.json();
      if (audioData.secure_url) audioUrl = audioData.secure_url;
    }

    if (finalImageFile) {
      submitBtn.textContent = "Uploading Image...";
      const imgFormData = new FormData();
      imgFormData.append("file", finalImageFile);
      imgFormData.append("upload_preset", "crowdsolve_uploads");
      const res = await fetch(`https://api.cloudinary.com/v1_1/dwjebrwih/image/upload`, { method: "POST", body: imgFormData });
      const data = await res.json();
      if (data.secure_url) imageUrl = data.secure_url;
    }

    let finalText = userInputText.trim();
    if (transcribedText) {
      finalText = finalText ? `${finalText}\n\n(From Audio): ${transcribedText}` : `(From Audio): ${transcribedText}`;
    }

    const problemId = solutionForm.dataset.problemId;
    const newSolution = {
      text: finalText,
      imageUrl: imageUrl || null,
      audioUrl: audioUrl || null,
      authorId: user.uid,
      authorName: user.displayName,
      timestamp: serverTimestamp(),
      problemId: problemId,
      problemTitle: solutionForm.dataset.problemTitle,
    };

    await addDoc(collection(db, "solutions"), newSolution);

    // Reset form and UI elements
    solutionForm.reset();
    solutionAudioBlob = null;
    solutionImageBlob = null;
    audioSolutionPlaybackContainer.classList.add('hidden');
    photoSolutionPreviewContainer.classList.add('hidden');
    recordingSolutionStatus.textContent = "";

    fetchAndRenderSolutions(problemId);
    showToast('Solution submitted!', 'success');
  } catch (err) {
    showToast(`Error submitting solution: ${err.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Solution";
  }
});

