document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const storedTheme = localStorage.getItem("mockpro-theme") || "dark";

    body.classList.toggle("dark-mode", storedTheme === "dark");
    body.classList.toggle("light-mode", storedTheme !== "dark");

    if (themeToggle) {
        themeToggle.textContent = storedTheme === "dark" ? "☀️ Light" : "🌙 Dark";
        themeToggle.addEventListener("click", () => {
            const isDark = body.classList.toggle("dark-mode");
            body.classList.toggle("light-mode", !isDark);
            localStorage.setItem("mockpro-theme", isDark ? "dark" : "light");
            themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal-item").forEach((item) => observer.observe(item));

    document.querySelectorAll("[data-tilt]").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = -((y / rect.height) - 0.5) * 6;
            const rotateY = ((x / rect.width) - 0.5) * 6;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
        });
    });

    document.querySelectorAll(".voice-input-btn").forEach((button) => {
        button.addEventListener("click", () => {
            // Check if we're on HTTPS or localhost
            const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Voice input is not supported in this browser. Please use a modern browser like Chrome, Edge, or Safari.");
                return;
            }

            if (!isSecure) {
                alert("Voice input requires HTTPS. Please access the site over a secure connection.");
                return;
            }

            const target = document.getElementById(button.dataset.voiceTarget);
            if (!target) {
                alert("Voice input target not found.");
                return;
            }

            // Check if microphone permission is already granted
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({name: 'microphone'}).then((result) => {
                    if (result.state === 'denied') {
                        alert("Microphone permission is blocked. Please enable microphone access in your browser settings and refresh the page.");
                        return;
                    }
                    startVoiceRecognition();
                }).catch(() => {
                    // Fallback for browsers that don't support permissions API
                    startVoiceRecognition();
                });
            } else {
                startVoiceRecognition();
            }

            function startVoiceRecognition() {
                const recognition = new SpeechRecognition();
                recognition.lang = "en-US";
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                recognition.continuous = false;

                // Store original button text
                const originalText = button.textContent;
                button.textContent = "🎙 Listening...";
                button.disabled = true;
                button.classList.add("btn-listening");

                recognition.onstart = () => {
                    console.log("Voice recognition started");
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    console.log("Voice transcript:", transcript);
                    target.value = `${target.value} ${transcript}`.trim();
                    target.focus();
                };

                recognition.onerror = (event) => {
                    console.error("Voice recognition error:", event.error);
                    let errorMessage = "Voice input failed. ";
                    switch(event.error) {
                        case 'not-allowed':
                            errorMessage += "Microphone permission denied. Please click 'Allow' when prompted for microphone access.";
                            break;
                        case 'no-speech':
                            errorMessage += "No speech detected. Please speak clearly and try again.";
                            break;
                        case 'audio-capture':
                            errorMessage += "No microphone found. Please check your microphone connection.";
                            break;
                        case 'network':
                            errorMessage += "Network error occurred. Please check your internet connection.";
                            break;
                        case 'service-not-allowed':
                            errorMessage += "Voice recognition service is not available. Please try again later.";
                            break;
                        default:
                            errorMessage += `Error: ${event.error}. Please try again.`;
                    }
                    alert(errorMessage);
                };

                recognition.onend = () => {
                    console.log("Voice recognition ended");
                    button.textContent = originalText;
                    button.disabled = false;
                    button.classList.remove("btn-listening");
                };

                try {
                    recognition.start();
                } catch (error) {
                    console.error("Failed to start voice recognition:", error);
                    alert("Failed to start voice input. Please try again.");
                    button.textContent = originalText;
                    button.disabled = false;
                    button.classList.remove("btn-listening");
                }
            }
        });
    });

    document.querySelectorAll(".dynamic-progress").forEach((bar) => {
        const progress = parseInt(bar.dataset.progress || "0", 10);
        bar.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
    });

    document.querySelectorAll("[data-timer]").forEach((timerElement) => {
        let remaining = parseInt(timerElement.dataset.timer, 10) || 0;

        const renderTimer = () => {
            const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
            const seconds = String(remaining % 60).padStart(2, "0");
            timerElement.textContent = `${minutes}:${seconds}`;
        };

        renderTimer();
        const interval = setInterval(() => {
            if (remaining <= 0) {
                clearInterval(interval);
                timerElement.textContent = "Time's up";
                return;
            }
            remaining -= 1;
            renderTimer();
        }, 1000);
    });
});
