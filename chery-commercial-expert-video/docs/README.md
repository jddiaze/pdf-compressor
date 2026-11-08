# Chery Commercial Expert · Video promocional 16:9 y 9:16

Demostración de producto basada en **interacciones reales** grabadas en https://chery.commercialexpert.denivodigital.com/ (8 de noviembre de 2026): recorrido por el portafolio en el hall digital (Chery E5, Tiggo 4, 7, 8 y 9 CSH), visor 3D del Tiggo 9 CSH, galería interior, menú de producto, chat Chery Expert con preguntas y respuestas reales, prueba de manejo, formulario de datos y portal oficial de reserva.

Proyecto duplicado del de iCAUR Commercial Expert y adaptado a Chery. **La versión prioritaria es la horizontal 16:9.**

## Entregables

| Archivo | Contenido |
|---|---|
| `final/Commercial_Expert_Chery_16x9_66s.mp4` | **Versión principal horizontal** 1920 × 1080, 30 fps, 66 s, H.264 + AAC 256 kbps, −14 LUFS / −1 dBTP (YouTube, LinkedIn, web, presentaciones y pantallas). |
| `final/Commercial_Expert_Chery_16x9_66s_subtitulado.mp4` | Horizontal con subtítulos quemados. |
| `final/Commercial_Expert_Chery_16x9_66s_sin_textos.mp4` | Horizontal sin textos, chips ni flechas (para rotular en otro editor); conserva logos y resaltados. |
| `final/Commercial_Expert_Chery_9x16_66s.mp4` | Versión vertical 1080 × 1920 (Reels, TikTok, Shorts). |
| `final/Commercial_Expert_Chery_9x16_66s_subtitulado.mp4` | Vertical con subtítulos quemados. |
| `final/Commercial_Expert_Chery_subtitulos_ES.srt` | Subtítulos en español, sincronizados con transcripción Whisper. |
| `final/control/` | Storyboards de ambas versiones. |
| `audio/narracion_original_chery_lorena.mp3` | Toma original de ElevenLabs entregada por el cliente. |
| `audio/narracion_editada.wav` | Narración sola en la línea de tiempo final. |
| `audio/musica/` | Música original + stems. |
| `audio/efectos/efectos_sonido.wav` | Efectos alineados al video. |
| `audio/mezcla_final.wav` | Mezcla final 48 kHz. |
| `grabaciones/` | Grabaciones originales de la plataforma + marcas de tiempo + registro del chat. `C06a_testdrive_datos.mp4` es la versión con interpolación de movimiento; la captura original es `C06a_testdrive_datos_orig.mp4`. |
| `premiere_capcut/` | Secuencia XML 16:9 para Premiere Pro y guía de cortes CSV para CapCut. |
| `source/` | Scripts de captura, composición (16:9: `timeline_16x9.js` + `comp_16x9.html`; 9:16: `timeline.js` + `comp.html`), audio y subtítulos. |
| `docs/` | Guion con tiempos, funcionalidades verificadas, control de calidad. |

## Cómo se construyó

1. **Captura** (`source/capture/`, Playwright + Chromium): un cursor visible y ondas de clic se inyectan en la página. Hall, chat y conversión se graban en tiempo real (CDP screencast 2560 × 1600) en cámara lenta ×3. El visor 3D y la galería, que en GPU por software renderizan a ~1 fps, se graban fotograma a fotograma con reloj virtual (30 fps exactos).
2. **Composición** (`source/compose/`): página HTML 1080 × 1920 renderizada fotograma a fotograma. `engine.js` contiene la cámara (zoom, paneo, inclinación 3D, desenfoque de movimiento), textos cinéticos, chips, flechas, marcos y subrayados; `timeline.js` define las 7 escenas.
3. **Audio** (`source/audio/`): `music.py` sintetiza la banda (sin muestras de terceros); `align.py` toma los tiempos por palabra de Whisper; `mix.py` coloca las frases de la narración, sintetiza los efectos, aplica *ducking* a la música y normaliza a −14 LUFS; `srt.py` genera SRT y ASS.

## Volver a exportar

Requisitos: Node 18+ con `playwright`, Python 3.10+ con `numpy scipy`, FFmpeg con libx264 y libass, fuente Inter instalada.

```bash
python source/compose/prep.py              # extrae fotogramas de grabaciones/ y genera data.js
node source/compose/render.js --comp comp_16x9.html --w 1920 --h 1080 --workers 4 --sfx-out source/sfx_events.json --out final/_video_16x9_sin_audio.mp4   # versión principal
node source/compose/render.js --workers 4 --out final/_video_9x16_sin_audio.mp4   # versión vertical
python source/audio/music.py               # música
python source/audio/mix.py                 # narración + efectos + mezcla final
python source/audio/srt.py                 # SRT + ASS
ffmpeg -i final/_video_16x9_sin_audio.mp4 -i audio/mezcla_final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart final/Commercial_Expert_Chery_16x9_66s.mp4
```

Versión horizontal 16:9 (usa `timeline_16x9.js` y `comp_16x9.html`; mismo audio):

```bash
node source/compose/render.js --comp comp_16x9.html --w 1920 --h 1080 --workers 4 --out final/_video_16x9_sin_audio.mp4
ffmpeg -i final/_video_16x9_sin_audio.mp4 -i audio/mezcla_final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart final/Commercial_Expert_Chery_16x9_66s.mp4
```

Vista previa de fotogramas sueltos: `node source/compose/render.js --stills 5,20,36.5` (crea `final/_still_*.jpg`). Versión sin textos: añadir `--notext 1 --out final/x.mp4`.

## Modificar el video

**Cambiar textos en pantalla:** edite el objeto `TEXTOS` al inicio de `source/compose/timeline.js` (9:16) y de `source/compose/timeline_16x9.js` (16:9).

**Reemplazar la narración:**
1. Coloque la nueva toma en `audio/` y actualice `narration.file` en `source/timeline_master.json`.
2. Ajuste por frase `src` (inicio/fin dentro del archivo) y `dst` (momento en el video) de cada fragmento en `narration.chunks`.
3. Para recalcular los tiempos por palabra, transcriba con Whisper a `source/narration_asr.json` (formato del archivo actual) y ejecute `python source/audio/align.py`. Los textos y chips sincronizados usan esos tiempos automáticamente.
4. Ejecute `mix.py`, `srt.py` y vuelva a renderizar.

**Cambiar la duración de una escena:** modifique `t0`/`t1` de la escena en `timeline_master.json` y los tiempos internos de la misma escena en `timeline.js` (cada escena usa tiempos absolutos; los mapas `seg()` relacionan tiempo de video con tiempo de grabación). Luego ajuste `hits` para que la música marque los cortes y regenere música y mezcla.

**Cambiar el encuadre:** cada `browserWin(...)` recibe la cámara `{ fx, fy, s, px, py }`: `fx, fy` es el punto de la grabación (px CSS de una página 1280 × 800) que se coloca en `px, py` del lienzo, con escala `s`. Las animaciones se definen con `kf(t, [[tiempo, valor, curva], ...])`.

**Nuevas grabaciones:** los scripts `source/capture/c0*.js` repiten cada recorrido (`SLOW=3 node source/capture/c05_chat.js`). Las respuestas de la IA cambian en cada sesión: revise `grabaciones/C05_chat_log.json`, ya que los subrayados se ubican por frase con expresiones regulares.

## Premiere Pro y CapCut

- **Premiere Pro:** Archivo › Importar › `premiere_capcut/Commercial_Expert_Chery_Premiere_16x9.xml` (secuencia 1920 × 1080). Si pide ubicar medios, apunte a las carpetas `final/` y `audio/` del ZIP. V1 trae el video sin textos cortado por escenas, V2 el final con textos (desactivado, como referencia), A1 las frases de la narración (cada una movible), A2 la música y A3 los efectos. Hay marcadores por escena.
- **CapCut:** importe `final/Commercial_Expert_Chery_16x9_66s_sin_textos.mp4`, `audio/narracion_editada.wav`, `audio/musica/musica_original_Chery.wav` y `audio/efectos/efectos_sonido.wav`; use `premiere_capcut/guia_cortes_CapCut.csv` para los puntos de corte y `final/…subtitulos_ES.srt` para los subtítulos automáticos. Baje la música unos 8 dB bajo la voz (o use la mezcla final).

## Identidad visual aplicada

Paleta tomada de la propia plataforma Chery Commercial Expert (variable CSS `--color-accent: #0069FF`): azul #0069FF para acentos y resaltados (#3B8CFF en textos sobre fondo oscuro, por legibilidad), grafito #0B0E14 / #15171C como base y blanco frío #F4F6F9 en el cierre. Tipografía Inter. Logos oficiales servidos por el sitio (`logo-chery-blanco.svg` sobre oscuro, `logo-chery-negro.svg` sobre claro), sin alteraciones. No se usa la paleta ocre de iCAUR; los modelos iCAR no son protagonistas de esta pieza (ver `Funcionalidades_verificadas.md`).
