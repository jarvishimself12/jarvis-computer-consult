/* =========================================
   JARVIS COMPUTER CONSULT
   LOGIN & AUTHENTICATION JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // If user is already authenticated and visits the root index.html, forward them straight to the store.
    // On explicit login.html, allow them to view the page to test or switch accounts.
    try {
        const isLoginPage = window.location.pathname.toLowerCase().endsWith("login.html");
        const existingUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!isLoginPage && existingUser && existingUser.email) {
            window.location.replace("home.html");
            return;
        }
    } catch (e) {
        console.warn("Storage check:", e);
    }

    // Elements
    const loginFormContainer = document.getElementById("loginForm");
    const signupFormContainer = document.getElementById("signupForm");
    const showSignupButton = document.getElementById("showSignupButton");
    const showLoginButton = document.getElementById("showLoginButton");

    const loginFormElement = document.getElementById("loginFormElement");
    const signupFormElement = document.getElementById("signupFormElement");

    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const rememberMe = document.getElementById("rememberMe");
    const loginAlert = document.getElementById("loginAlert");
    const signupAlert = document.getElementById("signupAlert");
    const signInBtn = document.getElementById("signInSubmitBtn");
    const signUpBtn = document.getElementById("signUpSubmitBtn");

    // Google Modal Elements
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const googleSignInModal = document.getElementById("googleSignInModal");
    const googleModalOverlay = document.getElementById("googleModalOverlay");
    const googleModalCloseBtn = document.getElementById("googleModalCloseBtn");
    const googleModalCancelBtn = document.getElementById("googleModalCancelBtn");
    const googleSignInForm = document.getElementById("googleSignInForm");
    const googleModalEmail = document.getElementById("googleModalEmail");
    const googleModalPassword = document.getElementById("googleModalPassword");
    const googleModalAlert = document.getElementById("googleModalAlert");
    const googleModalSubmitBtn = document.getElementById("googleModalSubmitBtn");

    // Returning User Elements
    const returningUserCard = document.getElementById("returningUserCard");
    const returningUserInitial = document.getElementById("returningUserInitial");
    const returningUserGreeting = document.getElementById("returningUserGreeting");
    const returningUserEmailDisplay = document.getElementById("returningUserEmailDisplay");
    const switchAccountBtn = document.getElementById("switchAccountBtn");
    const loginEmailGroup = document.getElementById("loginEmailGroup");

    // Check if user has already signed in before: show email & avoid re-typing
    function setupRememberedUser() {
        try {
            let rememberedEmail = localStorage.getItem("lastSignedInEmail") || localStorage.getItem("savedEmail");
            let rememberedName = localStorage.getItem("lastSignedInName") || "";

            if (!rememberedEmail) {
                const current = JSON.parse(localStorage.getItem("currentUser"));
                if (current && current.email) {
                    rememberedEmail = current.email;
                    rememberedName = current.name || "";
                }
            }

            if (rememberedEmail && loginEmail) {
                loginEmail.value = rememberedEmail;
                if (rememberMe) rememberMe.checked = true;

                if (returningUserCard && loginEmailGroup) {
                    const initial = rememberedName ? rememberedName.charAt(0).toUpperCase() : rememberedEmail.charAt(0).toUpperCase();
                    if (returningUserInitial) returningUserInitial.textContent = initial;

                    const firstName = rememberedName ? rememberedName.split(" ")[0] : rememberedEmail.split("@")[0];
                    if (returningUserGreeting) returningUserGreeting.textContent = `Welcome back, ${firstName}`;
                    if (returningUserEmailDisplay) returningUserEmailDisplay.textContent = rememberedEmail;

                    // Display recognized card and hide manual email input
                    returningUserCard.classList.remove("hidden");
                    loginEmailGroup.classList.add("hidden");

                    // Focus password so person doesn't have to type email again
                    setTimeout(function () {
                        if (loginPassword) loginPassword.focus();
                    }, 120);
                }
            }
        } catch (e) {
            console.warn("Remembered user check error:", e);
        }
    }

    setupRememberedUser();

    // Switch Account handler
    if (switchAccountBtn) {
        switchAccountBtn.addEventListener("click", function () {
            if (returningUserCard) returningUserCard.classList.add("hidden");
            if (loginEmailGroup) loginEmailGroup.classList.remove("hidden");
            if (loginEmail) {
                loginEmail.value = "";
                loginEmail.focus();
            }
        });
    }

    // Helper: Show Alert Notification
    function showAlert(element, message, type = "error") {
        if (!element) return;
        element.className = `auth-alert ${type}`;
        element.innerHTML = type === "error"
            ? `<i class="fa-solid fa-circle-exclamation"></i> <span>${message}</span>`
            : `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        element.classList.remove("hidden");
    }

    function hideAlert(element) {
        if (element) {
            element.classList.add("hidden");
        }
    }

    // ==========================================
    // SWITCH BETWEEN LOGIN & SIGN UP
    // ==========================================

    if (showSignupButton) {
        showSignupButton.addEventListener("click", function () {
            hideAlert(loginAlert);
            hideAlert(signupAlert);
            loginFormContainer.classList.add("hidden");
            signupFormContainer.classList.remove("hidden");
            const signupName = document.getElementById("signupName");
            if (signupName) signupName.focus();
        });
    }

    if (showLoginButton) {
        showLoginButton.addEventListener("click", function () {
            hideAlert(loginAlert);
            hideAlert(signupAlert);
            signupFormContainer.classList.add("hidden");
            loginFormContainer.classList.remove("hidden");
            if (loginEmail) loginEmail.focus();
        });
    }

    // ==========================================
    // PASSWORD VISIBILITY TOGGLES
    // ==========================================

    function setupPasswordToggles() {
        const passwordToggles = document.querySelectorAll(".password-toggle");
        passwordToggles.forEach(function (button) {
            button.addEventListener("click", function () {
                const targetId = button.dataset.target;
                const input = document.getElementById(targetId);
                const icon = button.querySelector("i");

                if (!input || !icon) return;

                if (input.type === "password") {
                    input.type = "text";
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                    button.setAttribute("aria-label", "Hide password");
                } else {
                    input.type = "password";
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                    button.setAttribute("aria-label", "Show password");
                }
            });
        });
    }
    setupPasswordToggles();

    // ==========================================
    // GOOGLE SIGN IN MODAL FLOW
    // Requests email and valid password
    // ==========================================

    function openGoogleModal() {
        if (!googleSignInModal) return;
        hideAlert(googleModalAlert);
        if (googleModalEmail) googleModalEmail.value = "";
        if (googleModalPassword) googleModalPassword.value = "";
        if (googleModalSubmitBtn) {
            googleModalSubmitBtn.disabled = false;
            googleModalSubmitBtn.innerHTML = '<span>Sign In</span> <i class="fa-solid fa-arrow-right"></i>';
        }
        googleSignInModal.classList.remove("hidden");
        setTimeout(function () {
            if (googleModalEmail) googleModalEmail.focus();
        }, 100);
    }

    function closeGoogleModal() {
        if (!googleSignInModal) return;
        googleSignInModal.classList.add("hidden");
        hideAlert(googleModalAlert);
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", openGoogleModal);
    }

    if (googleModalCloseBtn) {
        googleModalCloseBtn.addEventListener("click", closeGoogleModal);
    }

    if (googleModalCancelBtn) {
        googleModalCancelBtn.addEventListener("click", closeGoogleModal);
    }

    if (googleModalOverlay) {
        googleModalOverlay.addEventListener("click", closeGoogleModal);
    }

    if (googleSignInForm) {
        googleSignInForm.addEventListener("submit", function (event) {
            event.preventDefault();
            hideAlert(googleModalAlert);

            const email = googleModalEmail ? googleModalEmail.value.trim() : "";
            const password = googleModalPassword ? googleModalPassword.value : "";

            if (!email) {
                showAlert(googleModalAlert, "Please enter your Google email address.");
                if (googleModalEmail) googleModalEmail.focus();
                return;
            }

            if (!email.includes("@") || !email.includes(".")) {
                showAlert(googleModalAlert, "Please enter a valid email address (e.g. yourname@gmail.com).");
                if (googleModalEmail) googleModalEmail.focus();
                return;
            }

            if (!password) {
                showAlert(googleModalAlert, "Please enter your password.");
                if (googleModalPassword) googleModalPassword.focus();
                return;
            }

            if (password.length < 6) {
                showAlert(googleModalAlert, "Please enter a valid password (at least 6 characters).");
                if (googleModalPassword) googleModalPassword.focus();
                return;
            }

            if (googleModalSubmitBtn) {
                googleModalSubmitBtn.disabled = true;
                googleModalSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Signing In...';
            }

            const rawName = email.split("@")[0].replace(/[._]/g, " ");
            const userName = rawName
                .split(" ")
                .filter(Boolean)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") || "Google User";

            const googleUser = {
                name: userName,
                email: email
            };

            try {
                localStorage.setItem("currentUser", JSON.stringify(googleUser));
                localStorage.setItem("lastSignedInEmail", email);
                localStorage.setItem("lastSignedInName", userName);
                localStorage.setItem("savedEmail", email);
            } catch (e) {
                console.warn("Storage write error:", e);
            }

            showAlert(googleModalAlert, `Welcome, ${userName}! Taking you to Jarvis Computer consult...`, "success");

            setTimeout(function () {
                window.location.href = "home.html";
            }, 300);
        });
    }

    // ==========================================
    // PERFORM LOGIN & SEND STRAIGHT INTO WEBSITE
    // ==========================================

    function performLogin(email, password, overrideName = null) {
        if (signInBtn) {
            signInBtn.classList.add("loading");
            signInBtn.disabled = true;
            signInBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Signing In...';
        }

        // Check registered users in storage
        let userName = overrideName;
        try {
            const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
            const matched = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (matched) {
                // If a password was saved for this account, verify it matches
                if (matched.password && matched.password !== password) {
                    if (signInBtn) {
                        signInBtn.classList.remove("loading");
                        signInBtn.disabled = false;
                        signInBtn.innerHTML = '<span id="signInBtnText">Sign In to Website</span> <i class="fa-solid fa-arrow-right"></i>';
                    }
                    showAlert(loginAlert, "Incorrect password. Please verify your credentials or create an account.");
                    if (loginPassword) loginPassword.focus();
                    return;
                }
                userName = matched.name || userName;
            } else {
                // Auto-register new sign in for smooth access
                const derivedName = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Customer";
                userName = derivedName;
                registeredUsers.push({
                    name: derivedName,
                    email: email,
                    password: password
                });
                localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
            }
        } catch (e) {
            console.warn("Storage check:", e);
        }

        if (!userName) {
            const raw = email.includes("@") ? email.split("@")[0].replace(/[._]/g, " ") : email;
            userName = raw
                .split(" ")
                .filter(Boolean)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") || "Customer";
        }

        // Save session (unlocks website across home.html, shop.html, product.html)
        try {
            const sessionUser = {
                name: userName,
                email: email
            };
            localStorage.setItem("currentUser", JSON.stringify(sessionUser));
            localStorage.setItem("lastSignedInEmail", email);
            localStorage.setItem("lastSignedInName", userName);
            localStorage.setItem("savedEmail", email);
        } catch (e) {
            console.warn("Storage write error:", e);
        }

        // Visual feedback
        if (signInBtn) {
            signInBtn.classList.remove("loading");
            signInBtn.classList.add("success");
            signInBtn.innerHTML = '<i class="fa-solid fa-check"></i> Welcome, ' + userName.split(" ")[0] + '!';
        }

        showAlert(loginAlert, `Welcome back, ${userName}! Taking you straight to the website...`, "success");

        // Send person straight into the actual website
        setTimeout(function () {
            window.location.href = "home.html";
        }, 250);
    }

    // ==========================================
    // SIGN IN FORM SUBMIT
    // ==========================================

    if (loginFormElement) {
        loginFormElement.addEventListener("submit", function (event) {
            event.preventDefault();
            hideAlert(loginAlert);

            const email = loginEmail ? loginEmail.value.trim() : "";
            const password = loginPassword ? loginPassword.value : "";

            // User must provide both email and password
            if (!email || !password) {
                showAlert(loginAlert, "Please enter your credentials to login or sign up.");
                if (!email && loginEmail) {
                    loginEmail.focus();
                } else if (!password && loginPassword) {
                    loginPassword.focus();
                }
                return;
            }

            if (!email.includes("@")) {
                showAlert(loginAlert, "Please enter a valid email address.");
                if (loginEmail) loginEmail.focus();
                return;
            }

            performLogin(email, password);
        });
    }

    // ==========================================
    // SIGN UP FORM SUBMIT
    // ==========================================

    if (signupFormElement) {
        signupFormElement.addEventListener("submit", function (event) {
            event.preventDefault();
            hideAlert(signupAlert);

            const nameInput = document.getElementById("signupName");
            const emailInput = document.getElementById("signupEmail");
            const passwordInput = document.getElementById("signupPassword");
            const termsInput = document.getElementById("terms");

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";

            if (!name || !email || !password) {
                showAlert(signupAlert, "Please enter your credentials to login or sign up.");
                if (!name && nameInput) nameInput.focus();
                else if (!email && emailInput) emailInput.focus();
                else if (!password && passwordInput) passwordInput.focus();
                return;
            }

            if (!email.includes("@")) {
                showAlert(signupAlert, "Please enter a valid email address.");
                if (emailInput) emailInput.focus();
                return;
            }

            if (password.length < 4) {
                showAlert(signupAlert, "Please choose a password (at least 4 characters).");
                if (passwordInput) passwordInput.focus();
                return;
            }

            if (termsInput && !termsInput.checked) {
                showAlert(signupAlert, "Please check the box to agree to the Terms of Service.");
                return;
            }

            if (signUpBtn) {
                signUpBtn.classList.add("loading");
                signUpBtn.disabled = true;
                signUpBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...';
            }

            // Save to registered users list
            try {
                const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
                const existingIdx = registeredUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
                if (existingIdx >= 0) {
                    registeredUsers[existingIdx] = { name, email, password };
                } else {
                    registeredUsers.push({ name, email, password });
                }
                localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

                // Save session user (unlocks website)
                localStorage.setItem("currentUser", JSON.stringify({
                    name: name,
                    email: email
                }));
                localStorage.setItem("lastSignedInEmail", email);
                localStorage.setItem("lastSignedInName", name);
                localStorage.setItem("savedEmail", email);
            } catch (e) {
                console.warn("Storage write error:", e);
            }

            if (signUpBtn) {
                signUpBtn.classList.remove("loading");
                signUpBtn.classList.add("success");
                signUpBtn.innerHTML = '<i class="fa-solid fa-check"></i> Account Created!';
            }

            showAlert(signupAlert, `Account created for ${name}! Taking you straight to the website...`, "success");

            // Send person straight into the actual website
            setTimeout(function () {
                window.location.href = "home.html";
            }, 250);
        });
    }

    // ==========================================
    // KEYBOARD ENTER LISTENER
    // Notifies to enter credentials if empty
    // ==========================================

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const activeEl = document.activeElement;
            const activeTag = activeEl ? activeEl.tagName.toLowerCase() : "";
            const activeType = activeEl ? (activeEl.getAttribute("type") || "").toLowerCase() : "";

            // If user is focused on navigation/links or non-submit buttons, allow native interaction
            if (activeTag === "a" || (activeTag === "button" && activeType !== "submit")) {
                return;
            }

            // Check if Google Sign In Modal is currently open
            if (googleSignInModal && !googleSignInModal.classList.contains("hidden")) {
                const email = googleModalEmail ? googleModalEmail.value.trim() : "";
                const password = googleModalPassword ? googleModalPassword.value : "";

                if (!email || !password || password.length < 6 || !email.includes("@")) {
                    event.preventDefault();
                    if (googleSignInForm) {
                        googleSignInForm.requestSubmit ? googleSignInForm.requestSubmit() : googleSignInForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                    }
                    return;
                }
                return; // Let form submit proceed
            }

            const isSignupVisible = signupFormContainer && !signupFormContainer.classList.contains("hidden");

            if (isSignupVisible) {
                const nameInput = document.getElementById("signupName");
                const emailInput = document.getElementById("signupEmail");
                const passwordInput = document.getElementById("signupPassword");

                const name = nameInput ? nameInput.value.trim() : "";
                const email = emailInput ? emailInput.value.trim() : "";
                const password = passwordInput ? passwordInput.value : "";

                if (!name || !email || !password) {
                    event.preventDefault();
                    showAlert(signupAlert, "Please enter your credentials to login or sign up.");
                    if (!name && nameInput) nameInput.focus();
                    else if (!email && emailInput) emailInput.focus();
                    else if (!password && passwordInput) passwordInput.focus();
                    return;
                }

                // If credentials are entered but user pressed Enter from outside an input/submit button, submit the form
                if (activeTag !== "input" && activeType !== "submit" && signupFormElement) {
                    event.preventDefault();
                    signupFormElement.requestSubmit ? signupFormElement.requestSubmit() : signupFormElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
            } else {
                // Login Form is visible
                const email = loginEmail ? loginEmail.value.trim() : "";
                const password = loginPassword ? loginPassword.value : "";

                if (!email || !password) {
                    event.preventDefault();
                    showAlert(loginAlert, "Please enter your credentials to login or sign up.");
                    if (!email && loginEmail) {
                        loginEmail.focus();
                    } else if (!password && loginPassword) {
                        loginPassword.focus();
                    }
                    return;
                }

                // If credentials are entered and Enter pressed from outside an input/submit button, perform login
                if (activeTag !== "input" && activeType !== "submit") {
                    event.preventDefault();
                    if (loginFormElement) {
                        loginFormElement.requestSubmit ? loginFormElement.requestSubmit() : loginFormElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                    }
                }
            }
        }
    });

});