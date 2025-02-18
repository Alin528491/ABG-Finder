document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Page loaded. Running scripts...");

    // === OLD FUNCTIONALITY (KEPT INTACT) ===
    const loadingScreen = document.getElementById("loading-screen");
    const smoothWrapper = document.getElementById("smooth-wrapper");

    if (loadingScreen) {
        gsap.to(".loading-bar", { 
            width: "100%", 
            duration: 2, 
            ease: "power2.out"
        });

        gsap.to("#loading-screen", { 
            opacity: 0, 
            duration: 1.5, 
            delay: 2, 
            onComplete: () => {
                console.log("✅ Loading screen animation complete.");
                loadingScreen.style.display = "none";
            }
        });
    } else {
        console.warn("⚠️ Loading screen not found.");
    }

    if (smoothWrapper) {
        gsap.to("#smooth-wrapper", { opacity: 1, duration: 1.5, delay: 2.5 });
    } else {
        console.warn("⚠️ Smooth wrapper not found.");
    }

    // === FIXED: STOP JUMPING TO HOME PAGE ON LOCATION CLICKS ===
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener("click", function (event) {
            event.preventDefault(); // Stops jumping
            openGraph(this.id);
        });
    });

    // === BACKDOOR SYSTEM: "ABG FINDER" TEXT AS SECRET BUTTON ===
    let clickCount = 0;
    let clickTimer;

    const abgFinderLogo = document.querySelector(".navbar .logo, .navbar h1, .abg-finder-text"); // Adjust to match your structure

    if (abgFinderLogo) {
        console.log("🟢 ABG FINDER text detected as backdoor trigger.");

        // **Make sure it's clickable**
        abgFinderLogo.style.cursor = "pointer";

        abgFinderLogo.addEventListener("click", function (event) {
            event.preventDefault(); // Prevents default behavior
            clickCount++;
            console.log(`🔎 Click detected: ${clickCount}`);

            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                    console.log("🔄 Redirecting to home page.");
                    window.location.href = "index.html"; // Change this if needed
                }, 1000); // If only 1 click in 1 sec, go to home
            }

            if (clickCount >= 4) {
                clearTimeout(clickTimer);
                clickCount = 0;
                console.log("🔑 Backdoor activated!");
                openKeypad();
            }
        });
    } else {
        console.warn("⚠️ ABG FINDER text not found.");
    }

    function openKeypad() {
        const keypadOverlay = document.getElementById("keypadOverlay");
        if (keypadOverlay) {
            keypadOverlay.style.display = "flex";
            document.getElementById("pinInput").value = "";
            console.log("🔓 Keypad displayed.");
        } else {
            console.error("❌ Keypad overlay element not found.");
        }
    }

    function closeKeypad() {
        document.getElementById("keypadOverlay").style.display = "none";
    }

    // === FIXED: KEYPAD FUNCTIONALITY ===
    const pinInput = document.getElementById("pinInput");
    const submitPin = document.getElementById("submitPin");
    const backspace = document.getElementById("backspace");
    const errorMsg = document.getElementById("errorMsg");
    const correctPin = "2122";

    document.querySelectorAll(".key-btn").forEach(button => {
        button.addEventListener("click", function () {
            if (pinInput.value.length < 4) {
                pinInput.value += this.dataset.value;
            }
        });
    });

    backspace.addEventListener("click", function () {
        pinInput.value = pinInput.value.slice(0, -1);
    });

    submitPin.addEventListener("click", function () {
        if (pinInput.value === correctPin) {
            console.log("✅ Correct PIN entered. Redirecting...");
            window.location.href = "admin.html";
        } else {
            errorMsg.textContent = "Incorrect PIN";
            setTimeout(() => { errorMsg.textContent = ""; }, 2000);
            pinInput.value = "";
        }
    });

    // === FIXED: UPDATE HOTSPOTS BASED ON TIME ===
    function updateHotspots() {
        console.log("🔄 Updating hotspots...");

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const hotspots = {
            "cafeteria": document.getElementById("cafeteria"),
            "upper-grind": document.getElementById("upper-grind"),
            "swimming-pool": document.getElementById("swimming-pool"),
            "tennis-court": document.getElementById("tennis-court"),
            "breeze-way": document.getElementById("breeze-way"),
            "rajendra": document.getElementById("rajendra")
        };

        // Reset all to yellow (low)
        Object.values(hotspots).forEach(el => el.style.backgroundColor = "yellow");

        if ((currentTime >= 435 && currentTime <= 465) || (currentTime >= 680 && currentTime <= 720)) {
            hotspots["cafeteria"].style.backgroundColor = "red";
        }
        if (currentTime >= 680 && currentTime <= 720) {
            hotspots["upper-grind"].style.backgroundColor = "red";
        }
        if (currentTime >= 890 && currentTime <= 1020) {
            hotspots["swimming-pool"].style.backgroundColor = "red";
            hotspots["tennis-court"].style.backgroundColor = "red";
            hotspots["rajendra"].style.backgroundColor = "red";
        }

        const timestamp = document.getElementById("timestamp");
        if (timestamp) {
            timestamp.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        } else {
            console.warn("⚠️ Timestamp element not found.");
        }

        console.log("✅ Hotspots updated.");
    }

    setInterval(updateHotspots, 1000);
    updateHotspots();

    // === GRAPH FUNCTION (SHOWS WHEN LOCATION IS CLICKED) ===
    function openGraph(location) {
        const modal = document.getElementById("graphModal");
        const modalTitle = document.getElementById("modalTitle");
        const detailGraphCanvas = document.getElementById("detailGraph");

        modal.style.display = "flex";
        modalTitle.textContent = location.replace("-", " ").toUpperCase();

        if (window.detailChart) {
            window.detailChart.destroy();
        }

        window.detailChart = new Chart(detailGraphCanvas, {
            type: "line",
            data: {
                labels: ["7:00", "9:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
                datasets: [{
                    label: `${location.replace("-", " ")} ABG Density`,
                    data: [1, 3, 5, 7, 9, 6, 4],
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Time", color: "white" }, grid: { color: "gray" } },
                    y: { title: { display: true, text: "ABG Density", color: "white" }, grid: { color: "gray" } }
                }
            }
        });
    }

    // === CLOSE BUTTON WORKS FOR ALL GRAPHS ===
    document.querySelector(".close").addEventListener("click", function () {
        console.log("❌ Closing graph modal...");
        document.getElementById("graphModal").style.display = "none";
    });

});
