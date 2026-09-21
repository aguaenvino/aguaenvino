(function () {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const file = path.split("/").pop() || "index.html";
  const base = (document.body.getAttribute("data-root") || "");

  function navLink(href, label) {
    const current = file === href || (file === "" && href === "index.html");
    return `<a href="${base}${href}" ${current ? 'aria-current="page"' : ""}>${label}</a>`;
  }

  const header = `
    <div class="wrap header-inner">
      <a class="logo" href="${base}index.html">Agua en Vino</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menú</button>
      <nav class="nav" id="site-nav">
        ${navLink("index.html", "Inicio")}
        ${navLink("historias.html", "Historias")}
        ${navLink("canales.html", "Escuchar")}
        ${navLink("recursos.html", "Para el camino")}
        ${navLink("acerca.html", "La casa")}
      </nav>
    </div>`;

  const footer = `
    <div class="wrap footer-grid">
      <div>
        <strong>Agua en Vino</strong>
        <p>Relatos, música y herramientas para que la fe no se quede solo en la pantalla.</p>
      </div>
      <div>
        <p><a href="${base}historias.html">Historias</a><br>
        <a href="${base}canales.html">Canales</a><br>
        <a href="${base}recursos.html">Recursos</a></p>
      </div>
      <div>
        <p><a href="${base}acerca.html">Quiénes somos</a><br>
        <a href="${base}aviso.html">Aviso de afiliados</a><br>
        <a data-social="youtube" href="#" target="_blank" rel="noopener">YouTube</a><br>
        <a data-social="tiktok" href="#" target="_blank" rel="noopener">TikTok</a></p>
      </div>
    </div>
    <p class="wrap tiny">Como asociado de Amazon, este sitio puede ganar por compras que califiquen. Los precios salen en Amazon. © ${new Date().getFullYear()} Agua en Vino.</p>`;

  const h = document.querySelector("[data-header]");
  const f = document.querySelector("[data-footer]");
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-social]").forEach((el) => {
    const key = el.getAttribute("data-social");
    if (window.AEV && AEV.social[key]) el.href = AEV.social[key];
  });

  const mount = document.querySelector("[data-mount]");
  if (mount && window.AEV) {
    const kind = mount.getAttribute("data-mount");
    if (kind === "stories-preview" || kind === "stories") {
      mount.innerHTML = previewStories();
    }
    if (kind === "resources") mount.innerHTML = resourceCards();
    if (kind === "channels") mount.innerHTML = channelCards();
  }

  function previewStories() {
    const list = (AEV.stories || []);
    return list.map((s) => `
      <a class="story-card" href="${base}historia.html?id=${encodeURIComponent(s.id)}">
        <img src="${s.image}" alt="${s.alt || s.title}">
        <div class="body">
          <p class="need">${s.ref || ""}</p>
          <h3>${s.title}</h3>
          <p class="muted">${s.summary || ""}</p>
        </div>
      </a>`).join("");
  }

  const storyMount = document.querySelector("[data-story]");
  if (storyMount && AEV.stories) {
    const id = new URLSearchParams(location.search).get("id");
    const s = AEV.stories.find((x) => x.id === id) || AEV.stories[0];
    if (s) {
      document.title = s.title + " | Agua en Vino";
      const paras = (s.paragraphs || []).map((p) => `<p>${p}</p>`).join("");
      const cta = s.ctaText ? `<div class="soft-cta"><p>${s.ctaText}</p><p><a class="btn btn-wine" href="${base}recursos.html#${s.ctaResource || ""}">Ver recurso</a></p></div>` : "";
      storyMount.innerHTML = `<p class="kicker">${s.ref || ""}</p><h1>${s.title}</h1>${paras}${cta}`;
    }
  }

  function resourceCards() {
    return AEV.resources.map((r) => `
      <article class="card resource" id="${r.id}">
        <img src="${r.image}" alt="${r.alt}">
        <div class="body">
          <p class="need">${r.need}</p>
          <h3>${r.title}</h3>
          <p>${r.text}</p>
          <p><a class="btn btn-wine" href="${aevAmazonUrl(r)}" target="_blank" rel="noopener sponsored nofollow">${r.cta}</a></p>
        </div>
      </article>`).join("");
  }

  function channelCards() {
    return AEV.channels.map((c) => {
      const src = c.image.startsWith("http") ? c.image : (base + c.image);
      const verse = c.verse ? `<p class="muted"><em>${c.verse}</em></p>` : "";
      return `
      <article class="channel-card channel-card--logo">
        <img class="channel-logo" src="${src}" alt="${c.name}">
        <div>
          <p class="need">${c.mood}</p>
          <h3>${c.name}</h3>
          <p class="handle">${c.handle}</p>
          <p>${c.blurb}</p>
          ${verse}
          <p><a class="btn btn-wine" href="${c.url}" target="_blank" rel="noopener">Ir al canal</a></p>
        </div>
      </article>`;
    }).join("");
  }

  if (file === 'panel.html') return;
  /* Música: los navegadores bloquean autoplay con sonido. Se inicia al primer toque si no la pausaron. */
  (function music() {
    if (document.getElementById("aev-player")) return;
    const src = base + "audio/padre-nuestro-reggae.mp3";
    const wrap = document.createElement("div");
    wrap.id = "aev-player";
    wrap.innerHTML = `
      <audio id="aev-audio" src="${src}" loop preload="metadata"></audio>
      <button type="button" id="aev-toggle" aria-pressed="false">▶ Padre Nuestro</button>
      <span class="aev-player-hint">Reggae · Agua en Vino</span>`;
    document.body.appendChild(wrap);
    const audio = wrap.querySelector("#aev-audio");
    const btn = wrap.querySelector("#aev-toggle");
    const pref = localStorage.getItem("aevMusic");

    function play() {
      audio.play().then(() => {
        btn.textContent = "❚❚ Pausa";
        btn.setAttribute("aria-pressed", "true");
        wrap.classList.add("is-on");
      }).catch(() => {});
    }
    function pause() {
      audio.pause();
      btn.textContent = "▶ Padre Nuestro";
      btn.setAttribute("aria-pressed", "false");
      wrap.classList.remove("is-on");
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) { localStorage.setItem("aevMusic", "on"); play(); }
      else { localStorage.setItem("aevMusic", "off"); pause(); }
    });
    if (pref !== "off") {
      const kick = () => { if (pref !== "off" && audio.paused) play(); };
      document.addEventListener("pointerdown", kick, { once: true });
      play();
    }
  })();
})();

