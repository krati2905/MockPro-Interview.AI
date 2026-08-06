document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const themePanel = document.getElementById("themeSettingsPanel");
    const themePreviewGrid = document.getElementById("themePreviewGrid");
    const themeStorageKey = "mockpro-theme";

    const themeDefinitions = {
        original: { label: "Original", colors: { "--bg": "#111827", "--bg-soft": "#172033", "--surface": "#1d2a42", "--surface-soft": "#24354f", "--border": "rgba(148, 201, 255, 0.24)", "--text": "#f3f7ff", "--muted": "#9eb0c8", "--primary": "#60a5fa", "--primary-strong": "#3b82f6", "--accent": "#38bdf8", "--accent-strong": "#0ea5e9", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#08121f", "--shadow": "0 18px 45px rgba(15, 23, 42, 0.28)", "--input-bg": "rgba(15, 23, 42, 0.7)", "--input-border": "rgba(148, 201, 255, 0.28)", "--chip-bg": "rgba(96, 165, 250, 0.16)" } },
        "classic-blue": { label: "Classic Blue", colors: { "--bg": "#111827", "--bg-soft": "#172033", "--surface": "#1d2a42", "--surface-soft": "#24354f", "--border": "rgba(148, 201, 255, 0.24)", "--text": "#f3f7ff", "--muted": "#9eb0c8", "--primary": "#60a5fa", "--primary-strong": "#3b82f6", "--accent": "#38bdf8", "--accent-strong": "#0ea5e9", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#08121f", "--shadow": "0 18px 45px rgba(15, 23, 42, 0.28)", "--input-bg": "rgba(15, 23, 42, 0.7)", "--input-border": "rgba(148, 201, 255, 0.28)", "--chip-bg": "rgba(96, 165, 250, 0.16)" } },
        ocean: { label: "Ocean", colors: { "--bg": "#031827", "--bg-soft": "#0b2e3f", "--surface": "#113b50", "--surface-soft": "#184b61", "--border": "rgba(111, 214, 255, 0.3)", "--text": "#eefbff", "--muted": "#8dbac8", "--primary": "#2dd4bf", "--primary-strong": "#0f766e", "--accent": "#38bdf8", "--accent-strong": "#0284c7", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#4ade80", "--button-text": "#02131d", "--shadow": "0 18px 45px rgba(2, 8, 23, 0.3)", "--input-bg": "rgba(3, 24, 39, 0.7)", "--input-border": "rgba(111, 214, 255, 0.28)", "--chip-bg": "rgba(45, 212, 191, 0.2)" } },
        sky: { label: "Sky", colors: { "--bg": "#07111f", "--bg-soft": "#10223a", "--surface": "#18304f", "--surface-soft": "#224264", "--border": "rgba(131, 191, 255, 0.24)", "--text": "#f3f8ff", "--muted": "#95aac2", "--primary": "#8b5cf6", "--primary-strong": "#6d28d9", "--accent": "#60a5fa", "--accent-strong": "#2563eb", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#05111d", "--shadow": "0 18px 45px rgba(7, 17, 31, 0.28)", "--input-bg": "rgba(7, 17, 31, 0.72)", "--input-border": "rgba(131, 191, 255, 0.26)", "--chip-bg": "rgba(129, 140, 248, 0.18)" } },
        "royal-purple": { label: "Royal Purple", colors: { "--bg": "#160d2b", "--bg-soft": "#24143d", "--surface": "#322054", "--surface-soft": "#3f2b69", "--border": "rgba(183, 139, 255, 0.26)", "--text": "#f7ebff", "--muted": "#b7a4cf", "--primary": "#c084fc", "--primary-strong": "#9333ea", "--accent": "#a78bfa", "--accent-strong": "#7c3aed", "--danger": "#fb7185", "--warning": "#fbbf24", "--success": "#34d399", "--button-text": "#12081d", "--shadow": "0 18px 45px rgba(22, 13, 43, 0.32)", "--input-bg": "rgba(22, 13, 43, 0.75)", "--input-border": "rgba(183, 139, 255, 0.24)", "--chip-bg": "rgba(192, 132, 252, 0.18)" } },
        lavender: { label: "Lavender", colors: { "--bg": "#20132b", "--bg-soft": "#2e1f3f", "--surface": "#3f2b54", "--surface-soft": "#4f3566", "--border": "rgba(228, 186, 255, 0.26)", "--text": "#fdf4ff", "--muted": "#d7bfe2", "--primary": "#f0abfc", "--primary-strong": "#d946ef", "--accent": "#c084fc", "--accent-strong": "#a855f7", "--danger": "#f472b6", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#1e1224", "--shadow": "0 18px 45px rgba(32, 19, 43, 0.3)", "--input-bg": "rgba(32, 19, 43, 0.74)", "--input-border": "rgba(228, 186, 255, 0.24)", "--chip-bg": "rgba(240, 171, 252, 0.16)" } },
        forest: { label: "Forest", colors: { "--bg": "#071b12", "--bg-soft": "#10321d", "--surface": "#184728", "--surface-soft": "#235a34", "--border": "rgba(110, 231, 183, 0.25)", "--text": "#f2fff7", "--muted": "#9ed8b7", "--primary": "#4ade80", "--primary-strong": "#16a34a", "--accent": "#34d399", "--accent-strong": "#059669", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#4ade80", "--button-text": "#07140d", "--shadow": "0 18px 45px rgba(7, 27, 18, 0.28)", "--input-bg": "rgba(7, 27, 18, 0.74)", "--input-border": "rgba(110, 231, 183, 0.24)", "--chip-bg": "rgba(74, 222, 128, 0.16)" } },
        emerald: { label: "Emerald", colors: { "--bg": "#06251f", "--bg-soft": "#0b3b31", "--surface": "#134d41", "--surface-soft": "#1e6653", "--border": "rgba(94, 234, 212, 0.26)", "--text": "#f2fffb", "--muted": "#98d4c8", "--primary": "#2dd4bf", "--primary-strong": "#0f766e", "--accent": "#34d399", "--accent-strong": "#059669", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#4ade80", "--button-text": "#051812", "--shadow": "0 18px 45px rgba(6, 37, 31, 0.3)", "--input-bg": "rgba(6, 37, 31, 0.74)", "--input-border": "rgba(94, 234, 212, 0.24)", "--chip-bg": "rgba(45, 212, 191, 0.16)" } },
        rose: { label: "Rose", colors: { "--bg": "#241018", "--bg-soft": "#3a1b25", "--surface": "#4b2431", "--surface-soft": "#602c3b", "--border": "rgba(251, 146, 160, 0.26)", "--text": "#fff5f7", "--muted": "#f0bdc7", "--primary": "#fb7185", "--primary-strong": "#e11d48", "--accent": "#f43f5e", "--accent-strong": "#be123c", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#140b0e", "--shadow": "0 18px 45px rgba(36, 16, 24, 0.3)", "--input-bg": "rgba(36, 16, 24, 0.76)", "--input-border": "rgba(251, 146, 160, 0.24)", "--chip-bg": "rgba(251, 113, 133, 0.16)" } },
        "sunset-orange": { label: "Sunset Orange", colors: { "--bg": "#22140d", "--bg-soft": "#3b220f", "--surface": "#57331a", "--surface-soft": "#724221", "--border": "rgba(251, 191, 36, 0.28)", "--text": "#fff8f1", "--muted": "#f2d1ae", "--primary": "#fb923c", "--primary-strong": "#ea580c", "--accent": "#f59e0b", "--accent-strong": "#d97706", "--danger": "#fb7185", "--warning": "#fbbf24", "--success": "#34d399", "--button-text": "#150a04", "--shadow": "0 18px 45px rgba(34, 20, 13, 0.32)", "--input-bg": "rgba(34, 20, 13, 0.76)", "--input-border": "rgba(251, 191, 36, 0.24)", "--chip-bg": "rgba(251, 146, 60, 0.16)" } },
        cyberpunk: { label: "Cyberpunk", colors: { "--bg": "#12081d", "--bg-soft": "#1e1030", "--surface": "#2e1742", "--surface-soft": "#3b1f55", "--border": "rgba(244, 114, 182, 0.26)", "--text": "#fdf2f8", "--muted": "#f0c0da", "--primary": "#f472b6", "--primary-strong": "#ec4899", "--accent": "#22d3ee", "--accent-strong": "#06b6d4", "--danger": "#fb7185", "--warning": "#fbbf24", "--success": "#34d399", "--button-text": "#0b0512", "--shadow": "0 18px 45px rgba(18, 8, 29, 0.32)", "--input-bg": "rgba(18, 8, 29, 0.74)", "--input-border": "rgba(244, 114, 182, 0.24)", "--chip-bg": "rgba(34, 211, 238, 0.16)" } },
        midnight: { label: "Midnight", colors: { "--bg": "#020617", "--bg-soft": "#0f172a", "--surface": "#111c34", "--surface-soft": "#17254b", "--border": "rgba(148, 163, 184, 0.24)", "--text": "#f8fafc", "--muted": "#94a3b8", "--primary": "#38bdf8", "--primary-strong": "#0284c7", "--accent": "#818cf8", "--accent-strong": "#6366f1", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#020617", "--shadow": "0 18px 45px rgba(2, 6, 23, 0.36)", "--input-bg": "rgba(2, 6, 23, 0.76)", "--input-border": "rgba(148, 163, 184, 0.24)", "--chip-bg": "rgba(56, 189, 248, 0.16)" } },
        "minimal-white": { label: "Minimal White", colors: { "--bg": "#f5f7fb", "--bg-soft": "#eff2f7", "--surface": "#ffffff", "--surface-soft": "#f8fafc", "--border": "rgba(15, 23, 42, 0.1)", "--text": "#0f172a", "--muted": "#475569", "--primary": "#2563eb", "--primary-strong": "#1d4ed8", "--accent": "#7c3aed", "--accent-strong": "#6d28d9", "--danger": "#dc2626", "--warning": "#d97706", "--success": "#16a34a", "--button-text": "#ffffff", "--shadow": "0 18px 45px rgba(15, 23, 42, 0.1)", "--input-bg": "#ffffff", "--input-border": "rgba(15, 23, 42, 0.12)", "--chip-bg": "rgba(37, 99, 235, 0.1)" } },
        "professional-grey": { label: "Professional Grey", colors: { "--bg": "#0f172a", "--bg-soft": "#1e293b", "--surface": "#273448", "--surface-soft": "#334155", "--border": "rgba(203, 213, 225, 0.2)", "--text": "#f8fafc", "--muted": "#cbd5e1", "--primary": "#94a3b8", "--primary-strong": "#64748b", "--accent": "#e2e8f0", "--accent-strong": "#cbd5e1", "--danger": "#fb7185", "--warning": "#f59e0b", "--success": "#34d399", "--button-text": "#020617", "--shadow": "0 18px 45px rgba(15, 23, 42, 0.28)", "--input-bg": "rgba(15, 23, 42, 0.7)", "--input-border": "rgba(203, 213, 225, 0.2)", "--chip-bg": "rgba(148, 163, 184, 0.14)" } },
        coffee: { label: "Coffee", colors: { "--bg": "#1f130d", "--bg-soft": "#2f1f12", "--surface": "#49301b", "--surface-soft": "#614325", "--border": "rgba(209, 133, 64, 0.28)", "--text": "#fff8f2", "--muted": "#e7c8a6", "--primary": "#d97706", "--primary-strong": "#b45309", "--accent": "#f59e0b", "--accent-strong": "#d97706", "--danger": "#fb7185", "--warning": "#fbbf24", "--success": "#34d399", "--button-text": "#140b05", "--shadow": "0 18px 45px rgba(31, 19, 13, 0.3)", "--input-bg": "rgba(31, 19, 13, 0.74)", "--input-border": "rgba(209, 133, 64, 0.24)", "--chip-bg": "rgba(217, 119, 6, 0.16)" } },
        golden: { label: "Golden", colors: { "--bg": "#231a04", "--bg-soft": "#3b2b06", "--surface": "#5b3d0d", "--surface-soft": "#725111", "--border": "rgba(251, 191, 36, 0.3)", "--text": "#fff9eb", "--muted": "#f5dfa1", "--primary": "#fbbf24", "--primary-strong": "#f59e0b", "--accent": "#f59e0b", "--accent-strong": "#d97706", "--danger": "#fb7185", "--warning": "#fbbf24", "--success": "#34d399", "--button-text": "#171102", "--shadow": "0 18px 45px rgba(35, 26, 4, 0.32)", "--input-bg": "rgba(35, 26, 4, 0.76)", "--input-border": "rgba(251, 191, 36, 0.24)", "--chip-bg": "rgba(251, 191, 36, 0.16)" } }
    };

    let activeTheme = localStorage.getItem(themeStorageKey) || "original";
    if (!themeDefinitions[activeTheme]) {
        activeTheme = "original";
    }

    function applyTheme(themeKey, persist = true) {
        const theme = themeDefinitions[themeKey];
        if (!theme) {
            return;
        }

        Object.entries(theme.colors).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        body.dataset.theme = themeKey;
        body.dataset.themeName = theme.label;

        document.querySelectorAll(".theme-chip").forEach((chip) => {
            chip.classList.toggle("is-active", chip.dataset.theme === themeKey);
        });

        if (persist) {
            localStorage.setItem(themeStorageKey, themeKey);
        }
        activeTheme = themeKey;
        if (themeToggle) {
            themeToggle.textContent = `🎨 ${theme.label}`;
        }
    }

    function renderThemeGrid() {
        if (!themePreviewGrid) {
            return;
        }

        const themeEntries = Object.entries(themeDefinitions);
        themePreviewGrid.innerHTML = "";

        themeEntries.forEach(([themeKey, theme]) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "theme-chip";
            chip.dataset.theme = themeKey;
            chip.innerHTML = `
                <span class="theme-chip-preview" aria-hidden="true">
                    <span style="background:${theme.colors["--primary"]}"></span>
                    <span style="background:${theme.colors["--accent"]}"></span>
                    <span style="background:${theme.colors["--success"]}"></span>
                </span>
                <span class="theme-chip-copy">
                    <strong>${theme.label}</strong>
                    <small>Preview</small>
                </span>
            `;
            chip.addEventListener("mouseenter", () => applyTheme(themeKey, false));
            chip.addEventListener("mouseleave", () => applyTheme(activeTheme, false));
            chip.addEventListener("click", () => applyTheme(themeKey, true));
            themePreviewGrid.appendChild(chip);
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", (event) => {
            event.preventDefault();
            themePanel?.classList.toggle("is-open");
            const expanded = themePanel?.classList.contains("is-open");
            themeToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        });
    }

    document.querySelectorAll("[data-close-theme-panel]").forEach((button) => {
        button.addEventListener("click", () => {
            themePanel?.classList.remove("is-open");
            if (themeToggle) {
                themeToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    applyTheme(activeTheme, false);
    renderThemeGrid();

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
            const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const target = document.getElementById(button.dataset.voiceTarget);
            const status = document.getElementById("voiceStatus");
            const confidence = document.getElementById("voiceConfidence");
            const transcriptHistory = document.getElementById("transcriptHistory");
            const sessionId = button.dataset.sessionId || "default";
            const questionId = button.dataset.questionId || "default";
            const transcriptStorageKey = `mockpro-transcript-${sessionId}-${questionId}`;
            const historyStorageKey = `mockpro-transcript-history-${sessionId}-${questionId}`;

            if (!SpeechRecognition) {
                if (status) {
                    status.textContent = "Unsupported browser";
                    status.className = "voice-status-badge is-error";
                }
                return;
            }

            if (!isSecure) {
                if (status) {
                    status.textContent = "HTTPS required for microphone access";
                    status.className = "voice-status-badge is-error";
                }
                return;
            }

            if (!target) {
                if (status) {
                    status.textContent = "Answer box not found";
                    status.className = "voice-status-badge is-error";
                }
                return;
            }

            function updateStatus(message, state) {
                if (!status) {
                    return;
                }
                status.textContent = message;
                status.className = `voice-status-badge ${state}`;
            }

            function updateConfidence(value) {
                if (!confidence) {
                    return;
                }
                if (typeof value === "number") {
                    confidence.textContent = `Confidence: ${(value * 100).toFixed(0)}%`;
                    return;
                }
                confidence.textContent = "Confidence: n/a";
            }

            function saveTranscript(value, historyEntries) {
                if (target) {
                    target.value = value;
                    target.focus();
                }
                if (transcriptStorageKey) {
                    localStorage.setItem(transcriptStorageKey, value);
                }
                if (historyStorageKey) {
                    localStorage.setItem(historyStorageKey, JSON.stringify(historyEntries));
                }
            }

            function renderHistory(historyEntries) {
                if (!transcriptHistory) {
                    return;
                }
                if (!historyEntries.length) {
                    transcriptHistory.innerHTML = '<div class="text-muted">No transcript yet. Start speaking to capture your answer in real time.</div>';
                    return;
                }
                transcriptHistory.innerHTML = historyEntries.map((entry) => `
                    <div class="transcript-item">
                        <div class="transcript-item-meta">${entry.timestamp}</div>
                        <div>${entry.text}</div>
                    </div>
                `).join("");
            }

            function normalizeText(text) {
                return (text || "").replace(/\s+/g, " ").trim();
            }

            function isDuplicateText(newText, existingText) {
                const fresh = normalizeText(newText).toLowerCase();
                const current = normalizeText(existingText).toLowerCase();
                if (!fresh || !current) {
                    return false;
                }
                if (fresh === current) {
                    return true;
                }
                const tail = current.split(/([.?!])/).pop()?.trim() || current;
                return fresh === tail || current.endsWith(fresh) || fresh.includes(tail);
            }

            const storedText = localStorage.getItem(transcriptStorageKey) || "";
            const storedHistory = JSON.parse(localStorage.getItem(historyStorageKey) || "[]");
            if (storedText) {
                target.value = storedText;
            }
            if (storedHistory.length) {
                renderHistory(storedHistory);
            }

            let recognition = null;
            let isListening = false;
            let interimText = "";
            let historyEntries = storedHistory;
            let restartTimer = null;

            function cleanupTimer() {
                if (restartTimer) {
                    window.clearTimeout(restartTimer);
                    restartTimer = null;
                }
            }

            function scheduleRestart() {
                cleanupTimer();
                restartTimer = window.setTimeout(() => {
                    if (isListening) {
                        try {
                            recognition?.start();
                        } catch (error) {
                            updateStatus("Mic restarted automatically", "is-listening");
                        }
                    }
                }, 700);
            }

            function appendTranscript(text) {
                const normalized = normalizeText(text);
                if (!normalized) {
                    return;
                }
                const existingText = normalizeText(target.value);
                if (isDuplicateText(normalized, existingText)) {
                    return;
                }
                const nextText = existingText ? `${existingText} ${normalized}`.trim() : normalized;
                target.value = nextText;
                const entry = {
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    text: normalized,
                };
                historyEntries = [...historyEntries.slice(-4), entry];
                renderHistory(historyEntries);
                saveTranscript(nextText, historyEntries);
            }

            function stopListening() {
                cleanupTimer();
                isListening = false;
                try {
                    recognition?.stop();
                } catch (error) {
                    // ignore stop errors
                }
                updateStatus("Voice capture paused", "is-ready");
                button.textContent = "🎙 Start Voice Capture";
                button.classList.remove("is-listening");
                interimText = "";
            }

            function startListening() {
                if (isListening) {
                    stopListening();
                    return;
                }

                button.textContent = "⏹ Stop Voice Capture";
                button.classList.add("is-listening");
                updateStatus("Requesting microphone access…", "is-listening");

                navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
                    recognition = new SpeechRecognition();
                    recognition.lang = navigator.language || "en-US";
                    recognition.interimResults = true;
                    recognition.continuous = true;
                    recognition.maxAlternatives = 1;

                    recognition.onstart = () => {
                        isListening = true;
                        updateStatus("Listening… speak naturally", "is-listening");
                    };

                    recognition.onresult = (event) => {
                        let nextInterim = "";
                        let finalText = "";
                        for (let index = event.resultIndex; index < event.results.length; index += 1) {
                            const result = event.results[index];
                            const text = normalizeText(result[0].transcript);
                            if (result.isFinal) {
                                finalText += `${text} `;
                            } else {
                                nextInterim = text;
                            }
                        }
                        interimText = nextInterim;
                        if (finalText) {
                            appendTranscript(finalText.trim());
                            updateStatus("Response captured", "is-ready");
                        }
                        if (interimText) {
                            updateStatus(`Listening… ${interimText}`, "is-listening");
                        }
                        if (event.results[event.results.length - 1]?.[0]?.confidence !== undefined) {
                            updateConfidence(event.results[event.results.length - 1][0].confidence);
                        }
                    };

                    recognition.onerror = (event) => {
                        const errorMessage = {
                            "not-allowed": "Microphone permission was blocked. Please allow access and try again.",
                            "no-speech": "No speech was detected. Please speak a little louder and continue.",
                            "audio-capture": "No microphone was detected. Please reconnect your microphone and try again.",
                            "network": "Network interruption detected. The capture will resume automatically when the connection is restored.",
                            "service-not-allowed": "Live speech capture is unavailable in this browser right now.",
                        }[event.error] || `Speech capture failed: ${event.error}`;
                        updateStatus(errorMessage, "is-error");
                        if (event.error === "network" || event.error === "aborted") {
                            scheduleRestart();
                            return;
                        }
                        stopListening();
                    };

                    recognition.onend = () => {
                        if (isListening) {
                            scheduleRestart();
                        }
                    };

                    try {
                        recognition.start();
                    } catch (error) {
                        updateStatus("The browser could not start recognition. Please try again.", "is-error");
                        stopListening();
                    }
                }).catch(() => {
                    updateStatus("Microphone permission was denied. Please allow access in the browser prompt and try again.", "is-error");
                    button.textContent = "🎙 Start Voice Capture";
                    button.classList.remove("is-listening");
                });
            }

            startListening();
        });
    });

    const videoToggle = document.getElementById("videoInterviewToggle");
    const videoRecordButton = document.getElementById("videoInterviewRecord");
    const videoPreview = document.getElementById("videoInterviewPreview");
    const videoPlaceholder = document.getElementById("videoPlaceholder");
    const videoStatus = document.getElementById("videoStatus");
    const videoHint = document.getElementById("videoCaptureHint");
    const videoSummary = document.getElementById("videoRecordingSummary");
    const videoDownloadLink = document.getElementById("videoDownloadLink");
    const proctoringWarnings = document.getElementById("proctoringWarnings");
    const proctoringScore = document.getElementById("proctoringScore");
    const uploadInput = document.getElementById("videoUploadInput");
    const uploadButton = document.getElementById("videoUploadButton");
    const uploadSummary = document.getElementById("videoUploadSummary");

    if (videoToggle) {
        let stream = null;
        let recorder = null;
        let chunks = [];
        let isRecording = false;
        let recordingUrl = null;
        let proctoringTimer = null;
        let lastProctoringSnapshot = null;

        const sessionId = videoToggle.dataset.sessionId || "default";
        const storageKey = `mockpro-video-${sessionId}`;
        const uploadStorageKey = `mockpro-upload-${sessionId}`;

        function setVideoStatus(message) {
            if (videoStatus) {
                videoStatus.textContent = message;
            }
        }

        function setSummary(message) {
            if (videoSummary) {
                videoSummary.textContent = message;
            }
        }

        function updateProctoring(messages, scoreLabel) {
            if (proctoringWarnings) {
                proctoringWarnings.innerHTML = messages.map((message) => {
                    const isSuccess = message.includes("ready") || message.includes("detected");
                    const isWarning = message.includes("warning") || message.includes("No face") || message.includes("Look");
                    const tone = isSuccess ? "is-success" : isWarning ? "is-warning" : "";
                    return `<div class="proctoring-warning ${tone}">${message}</div>`;
                }).join("");
            }
            if (proctoringScore) {
                proctoringScore.textContent = scoreLabel;
            }
        }

        function resetProctoring() {
            if (proctoringTimer) {
                window.clearInterval(proctoringTimer);
                proctoringTimer = null;
            }
            updateProctoring(["The camera will run lightweight presence checks while the interview is active."], "Ready");
        }

        function runProctoringCheck() {
            if (!videoPreview || !stream || !videoPreview.videoWidth || !videoPreview.videoHeight) {
                return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = videoPreview.videoWidth;
            canvas.height = videoPreview.videoHeight;
            const context = canvas.getContext("2d");
            if (!context) {
                return;
            }
            context.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
            const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

            let skinPixels = 0;
            let centerSkinPixels = 0;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.22;

            for (let index = 0; index < data.length; index += 4) {
                const red = data[index];
                const green = data[index + 1];
                const blue = data[index + 2];
                const alpha = data[index + 3];
                if (alpha < 120) {
                    continue;
                }
                const isSkin = red > 95 && green > 40 && blue > 20 && Math.abs(red - green) > 15 && red > green && red > blue;
                if (isSkin) {
                    skinPixels += 1;
                    const x = (index / 4) % canvas.width;
                    const y = Math.floor((index / 4) / canvas.width);
                    const distance = Math.hypot(x - centerX, y - centerY);
                    if (distance <= radius) {
                        centerSkinPixels += 1;
                    }
                }
            }

            if (skinPixels < 1800) {
                updateProctoring(["No face detected near the camera. Please move into view."], "Warning");
                return;
            }

            const centered = centerSkinPixels / Math.max(1, skinPixels);
            if (centered < 0.45) {
                updateProctoring(["Look toward the camera. Your face is drifting off-center."], "Warning");
                return;
            }

            updateProctoring(["Face detected and centered. Interview flow is in a good state."], "Stable");
        }

        function showPreview(streamToShow) {
            if (!videoPreview) {
                return;
            }
            videoPreview.srcObject = streamToShow;
            videoPreview.style.display = "block";
            videoPlaceholder.style.display = "none";
        }

        function hidePreview() {
            if (videoPreview) {
                videoPreview.style.display = "none";
                videoPreview.srcObject = null;
            }
            if (videoPlaceholder) {
                videoPlaceholder.style.display = "flex";
            }
        }

        function stopStream() {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                stream = null;
            }
        }

        function resetRecorder() {
            recorder = null;
            chunks = [];
        }

        function saveRecording(blob) {
            if (!blob) {
                return;
            }
            recordingUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = recordingUrl;
            link.download = `mockpro-video-${sessionId}.webm`;
            link.className = "video-download-link";
            link.textContent = "Download recording";
            if (videoDownloadLink) {
                videoDownloadLink.innerHTML = "";
                videoDownloadLink.appendChild(link);
            }
            localStorage.setItem(storageKey, recordingUrl);
            setSummary("Recording saved locally in this browser.");
            if (videoHint) {
                videoHint.textContent = "Your clip is ready to review or download.";
            }
        }

        videoToggle.addEventListener("click", async () => {
            if (isRecording) {
                if (recorder && recorder.state !== "inactive") {
                    recorder.stop();
                }
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setVideoStatus("Camera not supported");
                setSummary("This browser cannot access your camera.");
                return;
            }

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                showPreview(stream);
                setVideoStatus("Camera live");
                setSummary("Camera ready. Click record to capture a short clip.");
                if (videoRecordButton) {
                    videoRecordButton.disabled = false;
                }
                if (videoHint) {
                    videoHint.textContent = "Allow camera and microphone access to simulate a live interview session.";
                }
                resetProctoring();
                proctoringTimer = window.setInterval(() => {
                    runProctoringCheck();
                }, 1800);
                recorder = new MediaRecorder(stream);
                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "video/webm" });
                    saveRecording(blob);
                    stopStream();
                    hidePreview();
                    resetRecorder();
                    isRecording = false;
                    resetProctoring();
                    videoToggle.textContent = "Start Camera";
                    if (videoRecordButton) {
                        videoRecordButton.disabled = false;
                        videoRecordButton.textContent = "Record Clip";
                    }
                };
                videoToggle.textContent = "Stop Camera";
            } catch (error) {
                setVideoStatus("Camera blocked");
                setSummary("Please allow camera access and try again.");
            }
        });

        if (uploadButton) {
            uploadButton.addEventListener("click", () => {
                const file = uploadInput?.files?.[0];
                if (!file) {
                    if (uploadSummary) {
                        uploadSummary.textContent = "Select a video file first.";
                    }
                    return;
                }
                const uploadedUrl = URL.createObjectURL(file);
                localStorage.setItem(uploadStorageKey, uploadedUrl);
                if (uploadSummary) {
                    uploadSummary.textContent = `Uploaded ${file.name} for review.`;
                }
                if (videoHint) {
                    videoHint.textContent = `Uploaded ${file.name}. You can review and share it from this browser.`;
                }
            });
        }

        if (videoRecordButton) {
            videoRecordButton.addEventListener("click", () => {
                if (!recorder) {
                    setSummary("Start the camera first.");
                    return;
                }
                if (isRecording) {
                    recorder.stop();
                    isRecording = false;
                    setVideoStatus("Recording stopped");
                    videoRecordButton.textContent = "Record Clip";
                    return;
                }

                chunks = [];
                recorder.start();
                isRecording = true;
                setVideoStatus("Recording…");
                setSummary("Recording your mock interview clip.");
                videoRecordButton.textContent = "Stop Recording";
            });
        }
    }

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
