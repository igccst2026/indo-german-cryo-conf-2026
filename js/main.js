/* =========================================================
   IGCCST 2026
   INTERACTION & ANIMATION SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM ELEMENTS
    ===================================================== */
    const body = document.body;
    const loader = document.getElementById("pageLoader");
    const header = document.getElementById("siteHeader");

    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const backToTop = document.getElementById("backToTop");

    const speakersCarousel = document.getElementById("speakersCarousel");
    const speakersPrev = document.getElementById("speakersPrev");
    const speakersNext = document.getElementById("speakersNext");
    const speakerCurrent = document.getElementById("speakerCurrent");
    const speakerTotal = document.getElementById("speakerTotal");


    /* =====================================================
       PAGE LOADER
    ===================================================== */
    window.addEventListener("load", () => {
        window.setTimeout(() => {
            loader?.classList.add("loaded");
        }, 300);
    });


    /* =====================================================
       STICKY HEADER WITH SCROLL LISTENER
    ===================================================== */
    const updateHeader = () => {
        if (!header) return;
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */
    const closeMobileMenu = () => {
        if (!menuToggle || !mobileNav) return;
        menuToggle.classList.remove("active");
        mobileNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        body.classList.remove("menu-open");
    };

    const openMobileMenu = () => {
        if (!menuToggle || !mobileNav) return;
        menuToggle.classList.add("active");
        mobileNav.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");
        body.classList.add("menu-open");
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = mobileNav?.classList.contains("active");
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileNav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });


    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
    ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* =====================================================
       BACK TO TOP BUTTON
    ===================================================== */
    const updateBackToTop = () => {
        if (!backToTop) return;
        if (window.scrollY > 600) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    };

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });

    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    /* =====================================================
       SPEAKER CAROUSEL CONTROLLER
    ===================================================== */
    if (speakersCarousel && speakersPrev && speakersNext) {

        const cards = Array.from(speakersCarousel.querySelectorAll(".speaker-card"));
        let currentIndex = 0;
        let autoPlay = null;

        let isPointerDown = false;
        let pointerStartX = 0;
        let pointerStartScroll = 0;

        if (speakerTotal) {
            speakerTotal.textContent = String(cards.length).padStart(2, "0");
        }

        const getGap = () => {
            const track = speakersCarousel.querySelector(".speakers-track");
            if (!track) return 20;
            const styles = window.getComputedStyle(track);
            return parseFloat(styles.gap) || 20;
        };

        const getCardWidth = () => {
            const card = cards[0];
            if (!card) return 290;
            return card.getBoundingClientRect().width;
        };

        const getStep = () => {
            return getCardWidth() + getGap();
        };

        const updateCurrentCounter = () => {
            if (!speakerCurrent) return;
            const step = getStep();
            const rawIndex = Math.round(speakersCarousel.scrollLeft / step);
            currentIndex = Math.max(0, Math.min(rawIndex, cards.length - 1));
            speakerCurrent.textContent = String(currentIndex + 1).padStart(2, "0");
        };

        const scrollToIndex = index => {
            if (!cards.length) return;

            if (index < 0) {
                index = cards.length - 1;
            } else if (index >= cards.length) {
                index = 0;
            }

            currentIndex = index;
            speakersCarousel.scrollTo({
                left: getStep() * index,
                behavior: "smooth"
            });

            updateCurrentCounter();
        };

        const nextSpeaker = () => {
            const maxScroll = speakersCarousel.scrollWidth - speakersCarousel.clientWidth;
            if (speakersCarousel.scrollLeft >= maxScroll - 20) {
                scrollToIndex(0);
            } else {
                scrollToIndex(currentIndex + 1);
            }
        };

        const previousSpeaker = () => {
            if (speakersCarousel.scrollLeft <= 20) {
                scrollToIndex(cards.length - 1);
            } else {
                scrollToIndex(currentIndex - 1);
            }
        };

        speakersNext.addEventListener("click", nextSpeaker);
        speakersPrev.addEventListener("click", previousSpeaker);

        speakersCarousel.addEventListener("scroll", updateCurrentCounter, { passive: true });

        /* Auto-play Handler */
        const startAutoPlay = () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }
            stopAutoPlay();
            autoPlay = window.setInterval(nextSpeaker, 5000);
        };

        const stopAutoPlay = () => {
            if (autoPlay) {
                clearInterval(autoPlay);
                autoPlay = null;
            }
        };

        speakersCarousel.addEventListener("mouseenter", stopAutoPlay);
        speakersCarousel.addEventListener("mouseleave", startAutoPlay);
        speakersCarousel.addEventListener("focusin", stopAutoPlay);
        speakersCarousel.addEventListener("focusout", startAutoPlay);

        /* Touch & Pointer Drag Gestures */
        speakersCarousel.addEventListener("pointerdown", event => {
            isPointerDown = true;
            pointerStartX = event.clientX;
            pointerStartScroll = speakersCarousel.scrollLeft;
            speakersCarousel.setPointerCapture(event.pointerId);
            stopAutoPlay();
        });

        speakersCarousel.addEventListener("pointermove", event => {
            if (!isPointerDown) return;
            const distance = event.clientX - pointerStartX;
            speakersCarousel.scrollLeft = pointerStartScroll - distance;
        });

        const finishPointerDrag = () => {
            if (!isPointerDown) return;
            isPointerDown = false;
            updateCurrentCounter();
            startAutoPlay();
        };

        speakersCarousel.addEventListener("pointerup", finishPointerDrag);
        speakersCarousel.addEventListener("pointercancel", finishPointerDrag);

        /* Keyboard Navigation */
        speakersCarousel.addEventListener("keydown", event => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                nextSpeaker();
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                previousSpeaker();
            }
        });

        updateCurrentCounter();
        startAutoPlay();
    }


    /* =====================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    ===================================================== */
    const revealElements = document.querySelectorAll(
        ".section-intro, " +
        ".about-main, " +
        ".collaboration-card, " +
        ".theme-card, " +
        ".timeline-item, " +
        ".speaker-card, " +
        ".registration-copy, " +
        ".registration-action, " +
        ".venue-copy, " +
        ".map-frame"
    );

    if ("IntersectionObserver" in window && revealElements.length) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal", "is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION HIGHLIGHTER
    ===================================================== */
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".desktop-nav a[href^='#']"));

    if (sections.length && navLinks.length && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.id;
                        navLinks.forEach(link => {
                            const isMatch = link.getAttribute("href") === `#${currentId}`;
                            link.classList.toggle("active", isMatch);
                        });
                    }
                });
            },
            {
                rootMargin: "-25% 0px -65% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       IMAGE FALLBACK STATE (GRACEFUL DEGRADATION)
    ===================================================== */
    document.querySelectorAll("img").forEach(image => {
        image.addEventListener(
            "error",
            () => {
                image.classList.add("img-fallback");
                image.parentElement?.classList.add("has-img-fallback");
            },
            { once: true }
        );
    });


    /* =====================================================
       WINDOW RESIZE HANDLING
    ===================================================== */
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (speakersCarousel && speakerCurrent) {
                const card = speakersCarousel.querySelector(".speaker-card");
                if (!card) return;
                const gap = parseFloat(window.getComputedStyle(speakersCarousel.querySelector(".speakers-track")).gap) || 20;
                const step = card.getBoundingClientRect().width + gap;
                const safeIndex = Math.max(1, Math.round(speakersCarousel.scrollLeft / step) + 1);
                speakerCurrent.textContent = String(safeIndex).padStart(2, "0");
            }
        }, 150);
    });

});