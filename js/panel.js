
(function () {
  const key = (window.AEV && AEV.adminKey) || "primer-milagro";
  const gate = document.getElementById("gate");
  const editor = document.getElementById("editor");
  const ok = sessionStorage.getItem("aevAdmin") === "1";
  function show(ed) {
    if (gate) gate.hidden = ed;
    if (editor) editor.hidden = !ed;
  }
  show(ok);
  const entrar = document.getElementById("entrar");
  if (entrar) entrar.onclick = () => {
    const v = (document.getElementById("clave") || {}).value || "";
    if (v === key) {
      sessionStorage.setItem("aevAdmin", "1");
      show(true);
    } else {
      const err = document.getElementById("gate-err");
      if (err) err.textContent = "Clave incorrecta.";
    }
  };
  const salir = document.getElementById("salir");
  if (salir) salir.onclick = () => {
    sessionStorage.removeItem("aevAdmin");
    location.reload();
  };
})();

(function () {
  if (!window.AEV) return;
  const data = JSON.parse(JSON.stringify(window.AEV));

  const $ = (id) => document.getElementById(id);
  $("amazonTag").value = data.amazonTag || "";
  $("amazonHost").value = data.amazonHost || "www.amazon.com";
  $("youtube").value = (data.social && data.social.youtube) || data.youtubeOficial || "";
  $("tiktok").value = (data.social && data.social.tiktok) || "";
  $("instagram").value = (data.social && data.social.instagram) || "";

  function slug(s) {
    return (s || "item")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item";
  }

  function storyBox(s, i) {
    return `<div class="item-box" data-story="${i}">
      <label>Título</label><input class="s-title" value="${esc(s.title || "")}">
      <label>Cita (ej. Juan 2)</label><input class="s-ref" value="${esc(s.ref || "")}">
      <label>Resumen corto (tarjeta)</label><input class="s-sum" value="${esc(s.summary || "")}">
      <label>Foto (URL)</label><input class="s-img" value="${esc(s.image || "")}">
      <label>Texto (un párrafo por línea)</label><textarea class="s-body">${esc((s.paragraphs || []).join("\n"))}</textarea>
      <label>Frase del botón suave</label><input class="s-cta" value="${esc(s.ctaText || "")}">
      <label>ID del producto al que enlaza (ej. biblia)</label><input class="s-res" value="${esc(s.ctaResource || "")}">
      <p class="row"><button type="button" class="btn btn-line del-story">Quitar</button></p>
    </div>`;
  }

  function resBox(r, i) {
    return `<div class="item-box" data-res="${i}">
      <label>Título del recurso</label><input class="r-title" value="${esc(r.title || "")}">
      <label>Necesidad (una línea)</label><input class="r-need" value="${esc(r.need || "")}">
      <label>Texto</label><textarea class="r-text">${esc(r.text || "")}</textarea>
      <label>Texto del botón</label><input class="r-cta" value="${esc(r.cta || "Ver en Amazon")}">
      <label>Pega aquí la URL larga de Amazon (se extrae el ASIN solo)</label><input class="r-url" placeholder="https://www.amazon.com/.../dp/B0XXXXXXXX">
      <label>ASIN (10 caracteres — esto cobra mejor)</label><input class="r-asin" value="${esc(r.asin || "")}">
      <label>Búsqueda solo si no hay ASIN</label><input class="r-search" value="${esc(r.search || "")}">
      <label>Foto (URL)</label><input class="r-img" value="${esc(r.image || "")}">
      <p class="row"><button type="button" class="btn btn-line del-res">Quitar</button></p>
    </div>`;
  }

  function esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  }

  function render() {
    $("stories").innerHTML = (data.stories || []).map(storyBox).join("");
    $("resources").innerHTML = (data.resources || []).map(resBox).join("");
  }
  render();

  document.body.addEventListener("input", (e) => {
    if (!e.target.classList.contains("r-url")) return;
    const box = e.target.closest("[data-res]");
    const parsed = aevParseAmazon(e.target.value);
    if (parsed.asin) box.querySelector(".r-asin").value = parsed.asin;
    if (parsed.search && !parsed.asin) box.querySelector(".r-search").value = parsed.search;
  });

  $("add-story").onclick = () => {
    data.stories = data.stories || [];
    data.stories.push({ id: "nueva", ref: "", title: "Nueva historia", summary: "", image: "", alt: "", paragraphs: [""], ctaText: "", ctaResource: "biblia" });
    render();
  };
  $("add-res").onclick = () => {
    data.resources = data.resources || [];
    data.resources.push({ id: "nuevo", title: "Nuevo recurso", need: "", text: "", cta: "Ver en Amazon", asin: "", search: "", image: "", alt: "" });
    render();
  };

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("del-story")) {
      const box = e.target.closest("[data-story]");
      data.stories.splice(+box.dataset.story, 1);
      render();
    }
    if (e.target.classList.contains("del-res")) {
      const box = e.target.closest("[data-res]");
      data.resources.splice(+box.dataset.res, 1);
      render();
    }
  });

  function collect() {
    data.amazonTag = $("amazonTag").value.trim();
    data.amazonHost = $("amazonHost").value.trim();
    data.social = data.social || {};
    data.social.youtube = $("youtube").value.trim();
    data.social.tiktok = $("tiktok").value.trim();
    data.social.instagram = $("instagram").value.trim();
    data.youtubeOficial = data.social.youtube;
    data.stories = [...document.querySelectorAll("[data-story]")].map((box) => {
      const title = box.querySelector(".s-title").value.trim();
      return {
        id: slug(title),
        ref: box.querySelector(".s-ref").value.trim(),
        title,
        summary: box.querySelector(".s-sum").value.trim(),
        image: box.querySelector(".s-img").value.trim(),
        alt: title,
        paragraphs: box.querySelector(".s-body").value.split("\n").map((x) => x.trim()).filter(Boolean),
        ctaText: box.querySelector(".s-cta").value.trim(),
        ctaResource: box.querySelector(".s-res").value.trim()
      };
    });
    data.resources = [...document.querySelectorAll("[data-res]")].map((box) => {
      const title = box.querySelector(".r-title").value.trim();
      return {
        id: slug(title),
        title,
        need: box.querySelector(".r-need").value.trim(),
        text: box.querySelector(".r-text").value.trim(),
        cta: box.querySelector(".r-cta").value.trim(),
        asin: box.querySelector(".r-asin").value.trim(),
        search: box.querySelector(".r-search").value.trim(),
        image: box.querySelector(".r-img").value.trim(),
        alt: title
      };
    });
  }

  $("save").onclick = () => {
    collect();
    const body =
      "/* Agua en Vino — generado por panel.html */\n" +
      "window.AEV = " + JSON.stringify(data, null, 2) + ";\n\n" +
      "window.aevParseAmazon = " + String(window.aevParseAmazon) + ";\n" +
      "window.aevAmazonUrl = " + String(window.aevAmazonUrl) + ";\n";
    const blob = new Blob([body], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "config.js";
    a.click();
    URL.revokeObjectURL(a.href);
  };
})();
