/* ================= SETTINGS (yahan apni details badlein) ================= */
const CONFIG = {
  email: "youremail@example.com",
  telegram: "https://t.me/yourusername",
  countdownSeconds: 5          // download se pehle kitne second ad dikhana hai
};
/* ========================================================================= */

const $ = (s, r = document) => r.querySelector(s);
let APPS = [];
let activeCat = "All";

// ---------- Basic setup ----------
$("#year").textContent = new Date().getFullYear();
$("#mailBtn").href = "mailto:" + CONFIG.email;
$("#tgBtn").href = CONFIG.telegram;

const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30));
$("#burger").onclick = () => $("#links").classList.toggle("open");
document.querySelectorAll("#links a").forEach(a => a.onclick = () => $("#links").classList.remove("open"));

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
}), { threshold: .12 });
const observeReveals = () => document.querySelectorAll(".reveal:not(.show)").forEach(el => io.observe(el));
observeReveals();

// ---------- Count-up stats ----------
function countUp(el, to, suffix = "") {
  let n = 0; const step = Math.max(1, Math.ceil(to / 40));
  const t = setInterval(() => {
    n = Math.min(to, n + step); el.textContent = n + suffix;
    if (n >= to) clearInterval(t);
  }, 35);
}
document.querySelectorAll(".stats b[data-count]").forEach(b => {
  if (b.id === "statApps") return;
  countUp(b, +b.dataset.count, b.dataset.suffix || "");
});

// ---------- Load apps ----------
fetch("apps.json?v=" + Date.now())
  .then(r => r.json())
  .then(d => { APPS = d; countUp($("#statApps"), APPS.length); buildChips(); render(); })
  .catch(() => { $("#grid").innerHTML = ""; $("#empty").hidden = false; $("#empty").textContent = "apps.json load nahi hua."; });

function buildChips() {
  const cats = ["All", ...new Set(APPS.map(a => a.category))];
  $("#chips").innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip" + (c === activeCat ? " active" : "");
    b.textContent = c;
    b.onclick = () => { activeCat = c; buildChips(); render(); };
    $("#chips").appendChild(b);
  });
}

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

function render() {
  const q = $("#search").value.trim().toLowerCase();
  const list = APPS.filter(a =>
    (activeCat === "All" || a.category === activeCat) &&
    (a.name + " " + a.description).toLowerCase().includes(q));
  const grid = $("#grid");
  grid.innerHTML = "";
  $("#empty").hidden = list.length > 0;
  $("#empty").textContent = "Koi app nahi mila 😕";

  list.forEach((a, i) => {
    const c = document.createElement("article");
    c.className = "card";
    c.style.animationDelay = i * 80 + "ms";
    c.innerHTML = `
      <div class="top">
        <img src="${esc(a.icon)}" alt="${esc(a.name)}" onerror="this.src='logo.png'">
        <div><h3>${esc(a.name)}</h3><span class="cat">${esc(a.category)}</span></div>
      </div>
      <p>${esc(a.description)}</p>
      <div class="meta"><span>⭐ ${esc(a.rating)}</span><span>📦 ${esc(a.size)}</span><span>v${esc(a.version)}</span></div>
      <button class="btn primary">⬇ Download APK</button>`;
    c.querySelector("button").onclick = () => openModal(a);
    // 3D tilt + glow follow
    c.addEventListener("mousemove", e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
      c.style.transform = `perspective(700px) rotateY(${(x / r.width - .5) * 8}deg) rotateX(${(.5 - y / r.height) * 8}deg)`;
    });
    c.addEventListener("mouseleave", () => c.style.transform = "");
    grid.appendChild(c);
  });
}
$("#search").addEventListener("input", render);

// ---------- Download modal (ad + countdown) ----------
let timer;
function openModal(a) {
  $("#mIcon").src = a.icon; $("#mIcon").onerror = function () { this.src = "logo.png"; };
  $("#mName").textContent = a.name;
  $("#mMeta").textContent = `Version ${a.version} • ${a.size}`;
  const btn = $("#mBtn");
  btn.classList.add("disabled");
  btn.href = a.apk;
  btn.setAttribute("download", (a.name || "app").replace(/\s+/g, "_") + ".apk");
  btn.innerHTML = `Please wait <span id="sec">${CONFIG.countdownSeconds}</span>s…`;
  $("#bar").style.transition = "none"; $("#bar").style.width = "0";
  $("#modal").classList.add("open");

  requestAnimationFrame(() => requestAnimationFrame(() => {
    $("#bar").style.transition = `width ${CONFIG.countdownSeconds}s linear`;
    $("#bar").style.width = "100%";
  }));

  let left = CONFIG.countdownSeconds;
  clearInterval(timer);
  timer = setInterval(() => {
    left--;
    const s = $("#sec"); if (s) s.textContent = left;
    if (left <= 0) {
      clearInterval(timer);
      btn.classList.remove("disabled");
      btn.textContent = "✅ Download Now";
    }
  }, 1000);
}
function closeModal() { clearInterval(timer); $("#modal").classList.remove("open"); }
$("#mClose").onclick = closeModal;
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
addEventListener("keydown", e => e.key === "Escape" && closeModal());

// ---------- Animated particle background ----------
(() => {
  const cv = $("#bg"), ctx = cv.getContext("2d");
  let W, H, P = [];
  const resize = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    P = Array.from({ length: Math.min(70, Math.floor(W / 20)) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 2 + .6
    }));
  };
  resize(); addEventListener("resize", resize);
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    P.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = "rgba(255,138,0,.7)"; ctx.fill();
      for (let j = i + 1; j < P.length; j++) {
        const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(255,100,0,${.15 * (1 - d / 120)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(loop);
  })();
})();
