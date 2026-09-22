/* =========================================
   JARVIS COMPUTER CONSULT
   SHARED AUTHENTICATION & LOGOUT CONTROLLER
========================================= */

(function () {
    "use strict";

    // Global Logout Handler
    function handleLogout(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            localStorage.removeItem("currentUser");
            sessionStorage.clear();
        } catch (err) {
            console.error("Logout storage error:", err);
        }

        // Redirect user straight back to login page
        window.location.replace("login.html");
    }

    // Expose globally for inline onclick or manual calls
    window.logoutJarvisUser = handleLogout;

    // Update Header and Navigation UI based on Auth State
    function renderAuthState() {
        let currentUser = null;
        try {
            currentUser = JSON.parse(localStorage.getItem("currentUser"));
        } catch (e) {
            currentUser = null;
        }

        const greetingSmall = document.getElementById("userGreetingSmall");
        const greetingName = document.getElementById("userGreetingName");
        const accountLink = document.getElementById("accountButton");
        const logoutBtn = document.getElementById("logoutButton");
        const navSignIn = document.getElementById("navSignInLink");
        const navLogout = document.getElementById("navLogoutLink");

        if (currentUser && currentUser.email) {
            const rawName = currentUser.name || currentUser.email.split("@")[0] || "User";
            const firstName = rawName.split(" ")[0];

            if (greetingSmall) greetingSmall.textContent = "Welcome,";
            if (greetingName) greetingName.textContent = firstName;

            if (accountLink) {
                accountLink.title = `Signed in as ${currentUser.email}`;
                // Keep clicking account link from sending back to login while active
                accountLink.href = "home.html";
            }

            if (logoutBtn) {
                logoutBtn.style.display = "inline-flex";
            }

            if (navSignIn) {
                navSignIn.style.display = "none";
            }

            if (navLogout) {
                navLogout.style.display = "inline-flex";
            }
        } else {
            if (greetingSmall) greetingSmall.textContent = "Hello,";
            if (greetingName) greetingName.textContent = "Sign In";

            if (accountLink) {
                accountLink.title = "Sign In / Register";
                accountLink.href = "login.html";
            }

            if (logoutBtn) {
                logoutBtn.style.display = "none";
            }

            if (navSignIn) {
                navSignIn.style.display = "inline-flex";
            }

            if (navLogout) {
                navLogout.style.display = "none";
            }
        }

        // Attach event listeners to all logout triggers
        const logoutElements = document.querySelectorAll("#logoutButton, #navLogoutLink, [data-action='logout'], .logout-btn");
        logoutElements.forEach(function (el) {
            el.removeEventListener("click", handleLogout);
            el.addEventListener("click", handleLogout);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderAuthState);
    } else {
        renderAuthState();
    }
})();
