"use strict";

/* ═══════════════════════════════════════════════════════════
   EMAILJS SETUP
   1. Go to https://www.emailjs.com — sign up free
   2. Add Gmail service  → copy Service ID
   3. Create template with variables:
      {{from_name}}, {{from_email}}, {{subject}}, {{message}}
   4. Copy Template ID + Public Key
   5. Replace the three constants below
═══════════════════════════════════════════════════════════ */
const EJ_SERVICE  = "YOUR_SERVICE_ID";
const EJ_TEMPLATE = "YOUR_TEMPLATE_ID";
const EJ_KEY      = "YOUR_PUBLIC_KEY";

/* ── PRELOADER ────────────────────────────────────────────── */
window.addEventListener("load", () => {
  const el = document.getElementById("preloader");
  if (el) setTimeout(() => el.classList.add("done"), 480);
});

/* ── SCROLL PROGRESS ──────────────────────────────────────── */
const $progress = document.getElementById("scroll-progress");
const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if ($progress && total > 0)
    $progress.style.width = (window.scrollY / total * 100).toFixed(1) + "%";
};
window.addEventListener("scroll", updateProgress, { passive: true });

/* ── HEADER SCROLL ────────────────────────────────────────── */
const $header = document.getElementById("header");
window.addEventListener("scroll", () => {
  $header?.classList.toggle("scrolled", window.scrollY > 55);
}, { passive: true });

/* ── MOBILE NAV ───────────────────────────────────────────── */
const $navToggle = document.getElementById("nav-toggle");
const $navMenu   = document.getElementById("nav-menu");

const closeNav = () => {
  $navMenu?.classList.remove("open");
  $navToggle?.classList.remove("open");
  $navToggle?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};

$navToggle?.addEventListener("click", () => {
  const open = $navMenu.classList.toggle("open");
  $navToggle.classList.toggle("open", open);
  $navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

document.querySelectorAll(".nav__link").forEach(l => l.addEventListener("click", closeNav));

document.addEventListener("click", e => {
  if ($navMenu?.classList.contains("open") &&
      !$navMenu.contains(e.target) &&
      !$navToggle.contains(e.target)) closeNav();
});

/* ── ACTIVE NAV LINK ──────────────────────────────────────── */
const $sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $sections.forEach(s => {
    const top = s.offsetTop - 150;
    const link = document.querySelector(`.nav__link[href="#${s.id}"]`);
    if (link) link.classList.toggle("active-link", y >= top && y < top + s.offsetHeight);
  });
}, { passive: true });

/* ── BACK TO TOP ──────────────────────────────────────────── */
const $backTop = document.getElementById("back-top");
window.addEventListener("scroll", () => {
  $backTop?.classList.toggle("show", window.scrollY > 500);
}, { passive: true });
$backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ── SKILL BAR ANIMATION ──────────────────────────────────── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + "%";
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".skill-bar-fill").forEach(el => barObs.observe(el));

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" });
document.querySelectorAll("[data-reveal]").forEach(el => revObs.observe(el));

/* ════════════════════════════════════════════════════════════
   CERTIFICATE MODAL
════════════════════════════════════════════════════════════ */
const $certModal  = document.getElementById("cert-modal");
const $certClose  = document.getElementById("modal-close");

const CERT_ICONS = {
  ibm:   `<i class="bx bx-data"></i>`,
  hr:    `<i class="bx bxl-python"></i>`,
  udemy: `<i class="bx bxl-python"></i>`,
};

function openCertModal(card) {
  const { certTitle: title, certIssuer: issuer, certLevel: level,
          certVerify: verify, certIcon: iconKey } = card.dataset;

  document.getElementById("modal-issuer").textContent = issuer;
  document.getElementById("modal-title").textContent  = title;
  document.getElementById("modal-level").textContent  = "✓ " + level;

  const $icon = document.getElementById("modal-icon");
  $icon.className = `modal-icon modal-icon--${iconKey}`;
  $icon.innerHTML = CERT_ICONS[iconKey] || `<i class="bx bx-certification"></i>`;

  document.getElementById("modal-preview").innerHTML = `
    <div class="cert-placeholder">
      <i class="bx bx-certification"></i>
      <p>${title}</p>
      <p style="color:var(--muted);font-size:0.83rem;font-weight:400;margin-top:0.25rem;">${issuer} · ${level}</p>
      <small style="margin-top:0.5rem;display:block;">Add your certificate image to assets/img/certs/ to display it here.</small>
    </div>`;

  const $actions = document.getElementById("modal-actions");
  $actions.innerHTML = "";

  if (verify) {
    const a = document.createElement("a");
    a.href = verify; a.target = "_blank"; a.rel = "noreferrer";
    a.className = "btn btn--primary btn--sm";
    a.innerHTML = `<i class="bx bx-link-external"></i> Verify Certificate`;
    $actions.appendChild(a);
  }

  const PLATFORM_URLS = {
    HackerRank: "https://www.hackerrank.com/certificates/",
    IBM:        "https://courses.cognitiveclass.ai/certificates/",
    Udemy:      "https://www.udemy.com/certificate/",
  };
  const b = document.createElement("a");
  b.href = PLATFORM_URLS[issuer] || "#";
  b.target = "_blank"; b.rel = "noreferrer";
  b.className = "btn btn--secondary btn--sm";
  b.innerHTML = `<i class="bx bx-show"></i> View on ${issuer}`;
  $actions.appendChild(b);

  $certModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCertModal() {
  $certModal?.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".cert-card[data-cert-title]").forEach(card => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.addEventListener("click", () => openCertModal(card));
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openCertModal(card); });
});

$certClose?.addEventListener("click", closeCertModal);
$certModal?.addEventListener("click", e => { if (e.target === $certModal) closeCertModal(); });

/* ════════════════════════════════════════════════════════════
   PROJECT MODAL
════════════════════════════════════════════════════════════ */
const PROJECTS = {
  sangamner: {
    title: "Sangamner AI",
    type:  "Client Project · Backend · AI Platform",
    badges: [["Client Project","badge--blue"],["Backend","badge--yellow"]],
    overview: "Worked on backend development for an AI-driven platform as part of my internship at The Baap Company. The project involved building REST APIs, managing a PostgreSQL database, implementing authentication systems, and developing business logic for AI workflows.",
    responsibilities: [
      "REST API development and third-party API integration",
      "JWT-based authentication and authorization implementation",
      "PostgreSQL database management and query optimization",
      "Business logic implementation for AI workflows",
      "Backend debugging, testing, and performance optimization",
      "Code reviews and team collaboration",
    ],
    tech: ["Python","FastAPI","PostgreSQL","JWT Auth","REST APIs","Git"],
    contribution: "Backend Development Intern at The Baap Company — contributed to API development, database management, and authentication systems.",
  },
  sjs: {
    title: "SJS Hospital",
    type:  "Client Project · Backend · Healthcare",
    badges: [["Client Project","badge--blue"],["Healthcare","badge--yellow"]],
    overview: "Worked on backend development for a hospital management system as part of my internship. The project involved REST API development, authentication systems, PostgreSQL database management, and business logic for hospital workflows.",
    responsibilities: [
      "REST API development for patient, doctor, and appointment management",
      "Multi-role authentication and authorization system (admin, doctor, staff)",
      "PostgreSQL database schema design and management",
      "Business logic for appointments, billing, and records",
      "API integration and endpoint testing with Postman",
      "Debugging and performance optimization",
    ],
    tech: ["Python","FastAPI","PostgreSQL","JWT Auth","REST APIs","RBAC","Git"],
    contribution: "Backend Development Intern at The Baap Company — contributed to API development, database design, and multi-role authentication.",
  },
  leave: {
    title: "Leave Management System",
    type:  "Academic Project",
    badges: [["Academic","badge--yellow"]],
    overview: "A role-based leave management system built as an academic project. Features multi-level authentication, leave workflow state management, and an approval chain system with full database persistence.",
    responsibilities: [
      "Role-based access control design (admin, manager, employee)",
      "Leave application and approval workflow implementation",
      "Database schema design for leave records and users",
      "Multi-level authentication and session management",
      "Approval chain logic for leave escalation",
    ],
    tech: ["Python","Role-Based Access","Database Design","Authentication","Workflow Logic"],
    contribution: "Designed and developed independently as an academic project.",
  },
  interviewbot: {
    title: "Interview Bot",
    type:  "Project · Backend",
    badges: [["Project","badge--blue"]],
    overview: "A backend-driven interview management system that handles question management, answer storage, and user authentication for conducting structured interviews.",
    responsibilities: [
      "Backend architecture and API development",
      "Question management system implementation",
      "Answer storage and retrieval functionality",
      "User authentication and session management",
      "Database schema design for interview data",
    ],
    tech: ["Python","Backend","Authentication","Database","REST APIs"],
    contribution: "Designed and developed independently.",
  },
};

const $projModal  = document.getElementById("proj-modal");
const $projClose  = document.getElementById("proj-modal-close");

function openProjModal(key) {
  const p = PROJECTS[key];
  if (!p) return;

  document.getElementById("proj-modal-content").innerHTML = `
    <div class="proj-modal-badges">
      ${p.badges.map(([label, cls]) => `<span class="badge ${cls}">${label}</span>`).join("")}
    </div>
    <h3 class="proj-modal-title">${p.title}</h3>
    <p class="proj-modal-type">${p.type}</p>
    <div class="proj-modal-section">
      <h4>Project Overview</h4>
      <p>${p.overview}</p>
    </div>
    <div class="proj-modal-section">
      <h4>Responsibilities</h4>
      <ul class="proj-modal-list">
        ${p.responsibilities.map(r => `<li>${r}</li>`).join("")}
      </ul>
    </div>
    <div class="proj-modal-section">
      <h4>Technologies Used</h4>
      <div class="tag-list">${p.tech.map(t => `<span class="tag tag--accent">${t}</span>`).join("")}</div>
    </div>
    <div class="proj-modal-section">
      <h4>My Contribution</h4>
      <p>${p.contribution}</p>
    </div>
    <div class="proj-modal-actions">
      <a href="https://github.com/Shreyash1106" target="_blank" rel="noreferrer" class="btn btn--secondary btn--sm">
        <i class="bx bxl-github"></i> GitHub Profile
      </a>
      <button class="btn btn--ghost btn--sm" onclick="closeProjModalAndScroll()">
        <i class="bx bx-envelope"></i> Discuss This Project
      </button>
    </div>`;

  $projModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProjModal() {
  $projModal?.classList.remove("open");
  document.body.style.overflow = "";
}

function closeProjModalAndScroll() {
  closeProjModal();
  setTimeout(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, 180);
}
window.closeProjModalAndScroll = closeProjModalAndScroll;

document.querySelectorAll(".proj-details-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    openProjModal(btn.dataset.proj);
  });
});

$projClose?.addEventListener("click", closeProjModal);
$projModal?.addEventListener("click", e => { if (e.target === $projModal) closeProjModal(); });

/* Close modals on Escape */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeCertModal(); closeProjModal(); }
});

/* ════════════════════════════════════════════════════════════
   CONTACT FORM — EmailJS with mailto fallback
════════════════════════════════════════════════════════════ */
const $form   = document.getElementById("contact-form");
const $status = document.getElementById("form-status");

const setErr = (id, errId, msg) => {
  document.getElementById(id)?.classList.add("is-error");
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
};
const clrErr = (id, errId) => {
  document.getElementById(id)?.classList.remove("is-error");
  const el = document.getElementById(errId);
  if (el) el.textContent = "";
};
const $val = id => document.getElementById(id)?.value.trim() ?? "";

const validateForm = () => {
  let ok = true;
  ["name","email","subject","message"].forEach(id => clrErr(id, "err-" + id));

  if (!$val("name"))    { setErr("name",    "err-name",    "Full name is required."); ok = false; }
  if (!$val("email"))   { setErr("email",   "err-email",   "Email is required."); ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($val("email")))
                        { setErr("email",   "err-email",   "Enter a valid email address."); ok = false; }
  if (!$val("subject")) { setErr("subject", "err-subject", "Subject is required."); ok = false; }
  if (!$val("message")) { setErr("message", "err-message", "Message is required."); ok = false; }
  else if ($val("message").length < 10)
                        { setErr("message", "err-message", "Message must be at least 10 characters."); ok = false; }
  return ok;
};

const showStatus = (type, msg) => {
  if (!$status) return;
  $status.className = `form-status ${type} show`;
  $status.textContent = msg;
};

$form?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateForm()) return;

  const $btn = document.getElementById("submit-btn");
  $btn.disabled = true;
  const originalBtnHTML = $btn.innerHTML;
  $btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> Sending...`;
  if ($status) $status.className = "form-status";

  const formData = new FormData();
  formData.append("Full Name", $val("name"));
  formData.append("Email", $val("email"));
  formData.append("Subject", $val("subject"));
  formData.append("Message", $val("message"));

  try {
    const response = await fetch("https://formspree.io/f/meewevjw", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });
    const result = await response.json();
    if (response.ok) {
      showStatus("success", "Thank you! Your message has been sent successfully.");
      $form.reset();
    } else {
      const errMsg = result.errors?.[0]?.message || "Failed to send message.";
      showStatus("fail", errMsg);
    }
  } catch (error) {
    showStatus("fail", "An error occurred. Please try again later.");
  } finally {
    $btn.disabled = false;
    $btn.innerHTML = originalBtnHTML;
    setTimeout(() => {
      if ($status) $status.className = "form-status";
    }, 8000);
  }
});
