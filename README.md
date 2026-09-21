# Agua en Vino v1.5

Panel de edición (solo tú): abre `panel.html` a mano. Clave: primer-milagro (cámbiala en js/config.js → adminKey). No está en el menú público.

# Agua en Vino — sitio estático

HTML + CSS + JavaScript. Se publica gratis en GitHub Pages.

## Antes de publicar

1. Abre `js/config.js`.
2. Pon tu **Tracking ID** de Amazon Associates en `amazonTag` (ejemplo: `minombre-20`).  
   Eso no es el ASIN del producto. Tu tag real ya está en config: `aguenvino07-20`. El enlace corto de Amazon sirve si al expandirse conserva ese tag.
3. Si vendes en España/México, cambia `amazonHost` a `www.amazon.es` o `www.amazon.com.mx` y usa el tag de esa tienda.
4. Sustituye cada `asin` por el de tus productos reales (10 caracteres, en la ficha de Amazon).
5. Pega las URLs reales de YouTube, Instagram y Facebook en `social` y `channels`.

## Subir a GitHub Pages (gratis)

1. Crea una cuenta en github.com si no tienes.
2. New repository → nombre sugerido: `aguaenvino`. Público.
3. Upload files: sube **todo el contenido de esta carpeta** (index.html, css, js, historias…).
4. Settings → Pages → Source: Deploy from a branch → `main` / root → Save.
5. En unos minutos el sitio queda en `https://TUUSUARIO.github.io/aguaenvino/`.
6. Dominio propio: en el registrador de aguaenvino.com crea un registro CNAME hacia `TUUSUARIO.github.io`. En el repo, Settings → Pages → Custom domain: `www.aguaenvino.com`.

## Probar en el teléfono o PC sin GitHub

Abre `index.html` en el navegador. Si algún script se bloquea, usa un servidor local:

```bash
python3 -m http.server 8080
```

y visita http://localhost:8080

## Cómo ganar las 3 ventas del mes (sin gritar “compra”)

- Comparte **una historia** en YouTube/WhatsApp, no la tienda.
- Al final del video: “el relato completo está en la web”.
- El enlace suave de cada historia lleva a un solo recurso.
- Cambia el tag antes de compartir o Amazon no te atribuye la comisión.
