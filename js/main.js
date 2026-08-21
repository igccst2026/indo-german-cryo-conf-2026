document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // SPEAKERS CAROUSEL CONTROLS
    // ==========================================
    const spkCarousel = document.getElementById("speakersCarousel");
    const spkPrevBtn = document.getElementById("speakersPrev");
    const spkNextBtn = document.getElementById("speakersNext");

    if (spkCarousel && spkPrevBtn && spkNextBtn) {
        let spkTimer = null;

        const getStep = () => {
            const card = spkCarousel.querySelector(".speaker-card");
            return card ? card.offsetWidth + 20 : 280;
        };

        const moveNext = () => {
            const step = getStep();
            const maxScroll = spkCarousel.scrollWidth - spkCarousel.clientWidth;
            
            if (spkCarousel.scrollLeft >= maxScroll - 15) {
                spkCarousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                spkCarousel.scrollBy({ left: step, behavior: "smooth" });
            }
        };

        const movePrev = () => {
            const step = getStep();
            if (spkCarousel.scrollLeft <= 15) {
                const maxScroll = spkCarousel.scrollWidth - spkCarousel.clientWidth;
                spkCarousel.scrollTo({ left: maxScroll, behavior: "smooth" });
            } else {
                spkCarousel.scrollBy({ left: -step, behavior: "smooth" });
            }
        };

        spkNextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            moveNext();
            resetTimer();
        });

        spkPrevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            movePrev();
            resetTimer();
        });

        const startTimer = () => {
            spkTimer = setInterval(moveNext, 4000);
        };

        const stopTimer = () => {
            if (spkTimer) clearInterval(spkTimer);
        };

        const resetTimer = () => {
            stopTimer();
            startTimer();
        };

        spkCarousel.addEventListener("mouseenter", stopTimer);
        spkCarousel.addEventListener("mouseleave", startTimer);

        startTimer();
    }

    // ==========================================
    // THEMES CAROUSEL CONTROLS (IF PRESENT)
    // ==========================================
    const themesCarousel = document.getElementById("themesCarousel");
    const themesPrevBtn = document.getElementById("themesPrev");
    const themesNextBtn = document.getElementById("themesNext");

    if (themesCarousel && themesPrevBtn && themesNextBtn) {
        let themeTimer = null;

        const getThemeStep = () => {
            const card = themesCarousel.querySelector(".theme-card");
            return card ? card.offsetWidth + 24 : 320;
        };

        const moveThemeNext = () => {
            const step = getThemeStep();
            const maxScroll = themesCarousel.scrollWidth - themesCarousel.clientWidth;

            if (themesCarousel.scrollLeft >= maxScroll - 15) {
                themesCarousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                themesCarousel.scrollBy({ left: step, behavior: "smooth" });
            }
        };

        const moveThemePrev = () => {
            const step = getThemeStep();
            if (themesCarousel.scrollLeft <= 15) {
                const maxScroll = themesCarousel.scrollWidth - themesCarousel.clientWidth;
                themesCarousel.scrollTo({ left: maxScroll, behavior: "smooth" });
            } else {
                themesCarousel.scrollBy({ left: -step, behavior: "smooth" });
            }
        };

        themesNextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            moveThemeNext();
            resetThemeTimer();
        });

        themesPrevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            moveThemePrev();
            resetThemeTimer();
        });

        const startThemeTimer = () => {
            themeTimer = setInterval(moveThemeNext, 4500);
        };

        const stopThemeTimer = () => {
            if (themeTimer) clearInterval(themeTimer);
        };

        const resetThemeTimer = () => {
            stopThemeTimer();
            startThemeTimer();
        };

        themesCarousel.addEventListener("mouseenter", stopThemeTimer);
        themesCarousel.addEventListener("mouseleave", startThemeTimer);

        startThemeTimer();
    }
});