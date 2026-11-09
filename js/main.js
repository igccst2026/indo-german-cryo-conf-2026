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
        ".sponsorship-copy, " +
        ".sponsorship-action, " +
        ".venue-copy, " +
        ".map-frame, " +
        ".gallery-item, " +
        ".gallery-more-card, " +
        ".schedule-item, " +
        ".current-event-copy, " +
        ".current-event-details"
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

/* =====================================================
   EVENT SCHEDULE TAB SWITCHER ENGINE
===================================================== */
function switchScheduleDay(event, dayId) {
    // 1. Fetch all system component targets
    const panels = document.querySelectorAll('.schedule-day-panel');
    const tabButtons = document.querySelectorAll('.schedule-tab-btn');

    // 2. Clear out active classes down the structural line
    panels.forEach(panel => panel.classList.remove('active'));
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // 3. Inject active tokens safely into user selected elements
    document.getElementById(dayId).classList.add('active');
    event.currentTarget.classList.add('active');
}

/* =========================================================
   CONFERENCE SCHEDULE DATA
   Indo-German Conference on Cryogenics
   09–11 November 2026
========================================================= */

const conferenceSchedule = {

    /* =====================================================
       DAY 1 — 09 NOVEMBER 2026
    ===================================================== */

    day1: [

        {
            type: "admin",
            start: "08:00 AM",
            end: "10:00 AM",
            title: "Registration",
            duration: "120 mins"
        },
        {
            type: "admin",
            start: "10:00 AM",
            end: "10:30 AM",
            title: "Inaugural Programme",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "10:30 AM",
            end: "11:00 AM",
            title: "HIGH TEA",
            duration: "30 mins"
        },
        {
            type: "session",
            title: "Session 1 - Cooling and Liquefaction Technologies",
            chair: "Prof. T. S. Dutta"
        },
        {
            type: "talk",
            start: "11:00 AM",
            end: "11:30 AM",
            name: "Prof. Christoph Haberstroh",
            affiliation: "Professor, Technische Universität Dresden",
            topic: "General Aspects in Cryogenics",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "11:30 AM",
            end: "12:00 PM",
            name: "Dr. Anindya Chakraborty",
            affiliation: "Head, Cryo-Technology Division, Multidisciplinary Research Group, BARC",
            topic: "Recent Advances in Cryogenic Technology Development at BARC",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "12:00 PM",
            end: "12:30 PM",
            name: "Prof. Dirk Lindackers",
            affiliation: "Professor, Research Technology Department, IFW Dresden",
            topic: "Cryogenic Aspects in a Global Green Hydrogen Economy",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "12:30 PM",
            end: "01:00 PM",
            name: "Prof. Parthasarathi Ghosh",
            affiliation: "Professor & Head, Cryogenic Engineering Centre, IIT Kharagpur",
            topic: "A Novel Turboexpander for Cryogenic Liquefaction Applications",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "01:00 PM",
            end: "02:00 PM",
            title: "LUNCH BREAK",
            duration: "60 mins"
        },
        {
            type: "session",
            title: "Session 2 - Quantum Materials and Technology",
            chair: "Prof. Prasanna Kumar Sahoo"
        },
        {
            type: "talk",
            start: "02:00 PM",
            end: "02:30 PM",
            name: "Dr. Prashant C. Upadhya",
            affiliation: "Director, Wadhwani Innovation Network, Centre of Excellence for Quantum Technologies, IISc",
            topic: "The Cryogenic-Quantum Interface: Enabling Next-Generation Quantum Systems",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "02:30 PM",
            end: "03:00 PM",
            name: "Prof. Pratap Raychaudhuri",
            affiliation: "Senior Professor, Department of Condensed Matter Physics and Materials Science, Tata Institute of Fundamental Research, Mumbai",
            topic: "Classical and Quantum Effects on the Vortex State in Superconducting Thin Films",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "03:00 PM",
            end: "03:30 PM",
            name: "Dr. Avradeep Pal",
            affiliation: "Assistant Professor, Physics, Indian Institute of Technology Bombay",
            topic: "Non-volatile Josephson Memory Devices",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "03:30 PM",
            end: "04:00 PM",
            name: "Prof. Venimadhav Adyam",
            affiliation: "Professor, IIT Kharagpur",
            topic: "Quantum Materials for Cryogenic Applications",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "04:00 PM",
            end: "04:15 PM",
            title: "TEA BREAK",
            duration: "15 mins"
        },
        {
            type: "talk",
            start: "04:15 PM",
            end: "04:45 PM",
            name: "Prof. Chiranjib Mitra",
            affiliation: "Professor, Indian Institute of Science Education and Research (IISER) Kolkata",
            topic: "Pulse Schemes for Increasing Coherence Time in an Ensemble of Nitrogen-Vacancy Centres in Diamond",
            duration: "30 mins"
        },
        {
            type: "session",
            title: "Oral Presentations by Students & Faculty",
            chair: "10 min each"
        },
        {
            type: "student",
            start: "04:45 PM",
            end: "04:55 PM",
            name: "Arjun Garva",
            affiliation: "Research Scholar, IIT Kharagpur",
            topic: "CFD Investigation of Fluid Transient-Induced Cavitation in a Cryogenic Environment",
            duration: "10 mins"
        },
        {
            type: "student",
            start: "04:55 PM",
            end: "05:05 PM",
            name: "Jishad K.",
            affiliation: "Research Scholar, Indian Institute of Space Science and Technology",
            topic: "A Hybrid Mass Transfer Model for Direct Contact Condensation on Structured and Unstructured Meshes: Towards Cryogenic Applications",
            duration: "10 mins"
        },
        {
            type: "faculty",
            start: "05:05 PM",
            end: "05:15 PM",
            name: "Dr. Kishore Singh Patel",
            affiliation: "Assistant Professor Grade-1, Mechanical Engineering, NIT Rourkela",
            topic: "Transient CFD Investigation of Regenerator Thermal Non-Equilibrium in a Free-Piston Stirling Cryocooler",
            duration: "10 mins"
        },
        {
            type: "faculty",
            start: "05:15 PM",
            end: "05:25 PM",
            name: "Dr. B. Kiran Naik",
            affiliation: "Assistant Professor Grade-I, Mechanical Engineering, NIT Rourkela",
            topic: "Novel Magnetoresistive Heat Switch for Ultralow Temperature Refrigeration in Quantum Technologies: A Thermomagnetic Analysis",
            duration: "10 mins"
        },
        {
            type: "student",
            start: "05:25 PM",
            end: "05:35 PM",
            name: "Ayush Kori",
            affiliation: "Undergraduate Student, SVKM's Mithibai College",
            topic: "Development of a Fast-Response, High-Sensitivity, Transistor-Based Temperature Sensor for Cryogenic Applications",
            duration: "10 mins"
        },
        {
            type: "special",
            start: "05:35 PM",
            end: "06:35 PM",
            title: "Panel Discussion",
            topic: "Cryogenics for Energy Security and Sustainability - A Way Forward",
            duration: "60 mins"
        },
        {
            type: "special",
            start: "07:30 PM",
            end: "10:30 PM",
            title: "Gala Dinner",
            duration: "180 mins"
        }

    ],


    /* =====================================================
       DAY 2 — 10 NOVEMBER 2026
    ===================================================== */

    day2: [

        /* SESSION 3 */

        {
            type: "session",
            title: "Session 3 - Cryogenic Refrigeration Technology",
            chair: "Prof. Danny Baumann"
        },
        {
            type: "talk",
            start: "09:30 AM",
            end: "10:00 AM",
            name: "Dr. Soumen Kar",
            affiliation: "ScientistG-, Chief Investigator IMRI-IUAC; In-charge, Cryogenics & Applied Superconductivity Lab, Inter-University Accelerator Centre",
            topic: "Challenges in Cryogenic and Superconducting Technology in Whole-Body MRI Magnets",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "10:00 AM",
            end: "10:30 AM",
            name: "Dr. Vivek Singh",
            affiliation: "Scientist/Engineer-SF, Thermal Engineering Division, Space Applications Centre (SAC), ISRO, Ahmedabad",
            topic: "Adiabatic Demagnetization Refrigerators for Sub-Kelvin Applications",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "10:30 AM",
            end: "11:00 AM",
            name: "Dipl.-Ing. Christoph Mühsig",
            affiliation: "Engineering Manager, Scientific Vacuum Division, Leybold Dresden GmbH",
            topic: "Cryo- and Vacuum Solutions for Emerging and Sustainable Technologies",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "11:00 AM",
            end: "11:15 AM",
            title: "TEA BREAK",
            duration: "15 mins"
        },
        {
            type: "talk",
            start: "11:15 AM",
            end: "11:45 AM",
            name: "Dr. Tino Gottschall",
            affiliation: "Dresden High Magnetic Field Laboratory, Helmholtz-Zentrum Dresden-Rossendorf, Germany, and Magnotherm Solutions GmbH",
            topic: "Magnetocaloric Hydrogen Liquefaction - From Materials to Prototypes",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "11:45 AM",
            end: "12:15 PM",
            name: "Prof. Tapas Kumar Nandi",
            affiliation: "Professor, IIT Kharagpur",
            topic: "Investigations on a Novel Pressure Wave Refrigerator Using Three-Stage Cooling",
            duration: "30 mins"
        },
        {
            type: "session",
            title: "Session 4 - Cryogenic Infrastructure",
            chair: "Dr. Tino Gottschall"
        },
        {
            type: "talk",
            start: "12:15 PM",
            end: "12:45 PM",
            name: "Prof. Danny Baumann",
            affiliation: "Professor, Research Technology Department, IFW Dresden",
            topic: "Cryogenic Instruments for Material Science",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "12:45 PM",
            end: "01:45 PM",
            title: "LUNCH BREAK",
            duration: "60 mins"
        },
        {
            type: "talk",
            start: "01:45 PM",
            end: "02:15 PM",
            name: "Dr. Jedidiah Pradhan",
            affiliation: "Senior Scientific Officer (G) & Head, Helium Technology and Low Temperature Section, Variable Energy Cyclotron Centre (VECC)",
            topic: "Developmental Activities for Dry Dilution Refrigerator (DryDR) at VECC, Kolkata",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "02:15 PM",
            end: "02:45 PM",
            name: "Dr. Hagen Schmidt",
            affiliation: "Professor, Institute for Solid State Physics, IFW Dresden",
            topic: "Contactless Cryogenic Levelmeter Based on Surface Acoustic Wave Sensors",
            duration: "30 mins"
        },
        {
            type: "session",
            title: "Session 5 - Storage and Distribution of Cryogenic Fluids",
            chair: "Prof. Christoph Haberstroh"
        },
        {
            type: "talk",
            start: "02:45 PM",
            end: "03:15 PM",
            name: "Dr. Jegesh David",
            affiliation: "Scientist G, Group Director, IPRC, ISRO",
            topic: "Earth to Orbit: Cryogenic Production, Storage and Distribution",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "03:15 PM",
            end: "03:45 PM",
            name: "Dr. Hans Weber",
            affiliation: "Professor, IFW Dresden",
            topic: "LH2 Container Logistics Demand-Driven LH2 Supply for Future Applications",
            duration: "30 mins"
        },
        {
            type: "poster",
            start: "03:45 PM",
            end: "05:00 PM",
            title: "Poster and Tea Session",
            duration: "75 mins"
        },
        {
            type: "talk",
            start: "05:00 PM",
            end: "05:30 PM",
            name: "Prof. Indranil Ghosh",
            affiliation: "Professor, IIT Kharagpur",
            topic: "Hydrogen Storage by Cryosorption",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "05:30 PM",
            end: "06:00 PM",
            name: "Dr. Pavitra Sandilya",
            affiliation: "Associate Professor, IIT Kharagpur",
            topic: "Emerging Cryogenic Technologies for Clean Energy: Carbon Capture, Energy Recovery and Liquid Cryogenic Fuel Storage",
            duration: "30 mins"
        }

    ],


    /* =====================================================
       DAY 3 — 11 NOVEMBER 2026
    ===================================================== */

    day3: [

        /* SESSION 6 */

        {
            type: "session",
            title: "Session 6 - Applied Superconductivity",
            chair: "Prof. Anindya Chakraborty"
        },
        {
            type: "talk",
            start: "10:00 AM",
            end: "10:30 AM",
            name: "Prof. Tripti Sekhar Datta",
            affiliation: "Former Visiting Professor, IIT Kharagpur; Former Head, Cryogenics and Superconductivity Programme, IUAC, Delhi",
            topic: "Superconductivity and Cryogenics for High Energy Particle Accelerators: Present Trend",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "10:30 AM",
            end: "11:00 AM",
            name: "Dr. Paul Saß",
            affiliation: "ScIDre Scientific Instruments Dresden GmbH",
            topic: "Levitated Bearings Based on HTS Materials in Cryogenic Pumps: Potential and Challenges",
            duration: "30 mins"
        },
        {
            type: "talk",
            start: "11:00 AM",
            end: "11:30 AM",
            name: "Dr. Abhay Singh Gour",
            affiliation: "Associate Professor, IIT Kharagpur",
            topic: "Superconducting Technology for Power Applications: An Overview of Research at the Applied Superconductivity Lab",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "11:30 AM",
            end: "11:45 AM",
            title: "TEA BREAK",
            duration: "15 mins"
        },
        {
            type: "industry",
            start: "11:45 AM",
            end: "12:15 PM",
            title: "Industry Presentations by Linde and IHVP",
            duration: "30 mins"
        },
        {
            type: "admin",
            start: "12:15 PM",
            end: "12:45 PM",
            title: "Prize Distribution and Closing Remarks",
            duration: "30 mins"
        },
        {
            type: "admin",
            start: "12:45 PM",
            end: "01:15 PM",
            title: "Certificate Distribution by Volunteers",
            duration: "30 mins"
        },
        {
            type: "break",
            start: "01:30 PM",
            end: "02:30 PM",
            title: "LUNCH",
            duration: "60 mins"
        }

    ]

};


/* =========================================================
   SCHEDULE RENDERING
========================================================= */

function escapeScheduleHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

}


function renderScheduleEvent(item) {

    const type = item.type || "admin";

    const classes = {
        talk: "event-talk",
        break: "event-break",
        admin: "event-admin",
        student: "event-student",
        faculty: "event-faculty",
        poster: "event-poster",
        special: "event-special",
        industry: "event-industry"
    };

    const badges = {
        talk: "Invited Talk",
        break: "Break",
        admin: "Programme",
        student: "Student Presentation",
        faculty: "Faculty Presentation",
        poster: "Poster Session",
        special: "Special Event",
        industry: "Industry Session"
    };

    const time = item.start && item.end
        ? `${item.start} – ${item.end}`
        : "";

    const heading = item.name || item.title || "";

    const affiliation = item.affiliation
        ? `<p class="schedule-affiliation">
                ${escapeScheduleHTML(item.affiliation)}
           </p>`
        : "";

    const topic = item.topic
        ? `<p class="schedule-topic">
                <strong>Topic:</strong>
                ${escapeScheduleHTML(item.topic)}
           </p>`
        : "";

    const duration = item.duration
        ? `<span class="schedule-duration">
                ${escapeScheduleHTML(item.duration)}
           </span>`
        : "";

    return `

        <div class="schedule-item ${classes[type] || ""}">

            <div class="schedule-time">

                <span>
                    ${escapeScheduleHTML(time)}
                </span>

            </div>


            <div class="schedule-content">

                <div class="schedule-card-top">

                    <span class="schedule-badge badge-${type === "talk" ? "keynote" : type === "student" ? "student" : type === "faculty" ? "poster" : type === "break" ? "break" : type === "poster" ? "poster" : type === "industry" ? "industry" : type === "special" ? "special" : "admin"}">

                        ${escapeScheduleHTML(badges[type] || "Programme")}

                    </span>

                    ${duration}

                </div>


                <h3>
                    ${escapeScheduleHTML(heading)}
                </h3>

                ${affiliation}

                ${topic}

            </div>

        </div>

    `;

}


/* =========================================================
   SESSION HEADER RENDERING
========================================================= */

function renderSessionHeader(item) {

    return `

        <div class="schedule-session-header">

            <div class="session-heading">

                <h3>
                    ${escapeScheduleHTML(item.title)}
                </h3>

                <p>Technical Session</p>

            </div>

            ${
                item.chair
                ? `<div class="session-chair">
                        Session Chair: ${escapeScheduleHTML(item.chair)}
                   </div>`
                : ""
            }

        </div>

    `;

}


/* =========================================================
   GENERATE ALL THREE DAYS
========================================================= */

function generateConferenceSchedule() {

    Object.keys(conferenceSchedule).forEach(day => {

        const container = document.getElementById(day);

        if (!container) return;

        container.innerHTML = conferenceSchedule[day]
            .map(item => {

                if (item.type === "session") {
                    return renderSessionHeader(item);
                }

                return renderScheduleEvent(item);

            })
            .join("");

    });

}


/* =========================================================
   DAY SWITCHING
========================================================= */

function switchScheduleDay(event, dayId) {

    document.querySelectorAll(".schedule-tab-btn")
        .forEach(button => {

            button.classList.remove("active");

        });


    document.querySelectorAll(".schedule-day-panel")
        .forEach(panel => {

            panel.classList.remove("active");

        });


    event.currentTarget.classList.add("active");


    const selectedDay = document.getElementById(dayId);

    if (selectedDay) {

        selectedDay.classList.add("active");

    }

}


/* =========================================================
   PRINT / DOWNLOAD SCHEDULE
========================================================= */

function printConferenceSchedule() {

    window.print();

}


/* =========================================================
   INITIALIZE SCHEDULE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    generateConferenceSchedule();

});

/* =========================================================
   GALLERY FILTERS + RESPONSIVE LIGHTBOX
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("galleryLightbox");
    const archiveGrid = document.getElementById("galleryArchiveGrid");
    const filterButtons = document.querySelectorAll(".gallery-filter");
    const countLabel = document.getElementById("galleryPhotoCount");

    // Read image data from the visible gallery cards so the homepage and
    // archive page share the same lightbox behavior without hard-coded paths.
    const getVisibleCards = () => Array.from(document.querySelectorAll("[data-gallery-open]")).filter(card => {
        return !card.hidden && card.querySelector("img");
    });

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter || "all";
            filterButtons.forEach(item => {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });
            if (!archiveGrid) return;
            archiveGrid.querySelectorAll("[data-category]").forEach(card => {
                card.hidden = filter !== "all" && card.dataset.category !== filter;
            });
            const visibleCount = Array.from(archiveGrid.querySelectorAll("[data-category]")).filter(card => !card.hidden).length;
            if (countLabel) countLabel.textContent = `${String(visibleCount).padStart(2, "0")} PHOTOGRAPHS`;
        });
    });

    if (!lightbox) return;
    const image = lightbox.querySelector(".lightbox-image");
    const caption = lightbox.querySelector(".lightbox-caption");
    const counter = lightbox.querySelector(".lightbox-counter");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    let currentIndex = 0;

    const openAt = index => {
        const cards = getVisibleCards();
        if (!cards.length) return;
        currentIndex = (index + cards.length) % cards.length;
        const activeCard = cards[currentIndex];
        const source = activeCard.querySelector("img");
        image.src = source.currentSrc || source.src;
        image.alt = source.alt || "IGCCST 2026 gallery photograph";
        const title = activeCard.querySelector(".gallery-preview-caption strong, .gallery-card-caption strong");
        caption.textContent = title ? title.textContent : source.alt;
        counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        closeButton.focus();
    };

    const close = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
    };

    document.querySelectorAll("[data-gallery-open]").forEach(card => {
        card.addEventListener("click", () => {
            const cards = getVisibleCards();
            openAt(cards.indexOf(card));
        });
    });
    closeButton.addEventListener("click", close);
    lightbox.addEventListener("click", event => { if (event.target === lightbox) close(); });
    previousButton.addEventListener("click", () => openAt(currentIndex - 1));
    nextButton.addEventListener("click", () => openAt(currentIndex + 1));
    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("is-open")) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") openAt(currentIndex - 1);
        if (event.key === "ArrowRight") openAt(currentIndex + 1);
    });
});
