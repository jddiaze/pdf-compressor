# iCAUR Commercial Expert · Video promocional 9:16 (v2)

Demostración de producto basada en **interacciones reales** grabadas en https://icaur.commercialexpert.denivodigital.com/ (8 de noviembre de 2026): hall digital, visor 3D, galería interior, menú de producto, chat iCAUR Expert con preguntas y respuestas reales, prueba de manejo, formulario de datos y portal de reserva.

## Entregables

| Archivo | Contenido |
|---|---|
| `final/Commercial_Expert_iCAUR_9x16_66s.mp4` | **Video final** 1080 × 1920, 30 fps, 66 s, H.264 + AAC 256 kbps, −14 LUFS / −1 dBTP. Listo para Reels, TikTok, Shorts y LinkedIn. |
| `final/Commercial_Expert_iCAUR_9x16_66s_subtitulado.mp4` | Igual, con subtítulos quemados (zona segura inferior). |
| `final/Commercial_Expert_iCAUR_9x16_66s_sin_textos.mp4` | Misma edición y cámara, sin textos, chips ni flechas (para rotular en otro editor). Conserva logos y resaltados. |
| `final/Commercial_Expert_iCAUR_subtitulos_ES.srt` | Subtítulos en español, sincronizados con transcripción Whisper. |
| `final/control/` | Fotogramas de control por escena y storyboard. |
| `audio/narracion_original_lorena.mp3` | Toma original de ElevenLabs entregada por el cliente. |
| `audio/narracion_editada.wav` | Narración sola, ya colocada en la línea de tiempo final. |
| `audio/musica/` | Música original + stems (pad, bajo, batería, arpegio, transiciones). |
| `audio/efectos/efectos_sonido.wav` | Efectos (clics, tecleo, transiciones), alineados al video. |
| `audio/mezcla_final.wav` | Mezcla final 48 kHz. |
| `grabaciones/` | Grabaciones originales de la plataforma (MP4) + marcas de tiempo (`*.marks.json`) + registro del chat. |
| `premiere_capcut/` | Secuencia XML para Premiere Pro y guía de cortes CSV para CapCut. |
| `source/` | Scripts de captura, composición, audio y subtítulos (proyecto editable). |
| `docs/` | Guion con tiempos, funcionalidades verificadas, control de calidad. |

## Cómo se construyó

1. **Captura** (`source/capture/`, Playwright + Chromium): un cursor visible y ondas de clic se inyectan en la página. Hall, chat y conversión se graban en tiempo real (CDP screencast 2560 × 1600) en cámara lenta ×3. El visor 3D y la galería, que en GPU por software renderizan a ~1 fps, se graban fotograma a fotograma con reloj virtual (30 fps exactos).
2. **Composición** (`source/compose/`): página HTML 1080 × 1920 renderizada fotograma a fotograma. `engine.js` contiene la cámara (zoom, paneo, inclinación 3D, desenfoque de movimiento), textos cinéticos, chips, flechas, marcos y subrayados; `timeline.js` define las 7 escenas.
3. **Audio** (`source/audio/`): `music.py` sintetiza la banda (sin muestras de terceros); `align.py` toma los tiempos por palabra de Whisper; `mix.py` coloca las frases de la narración, sintetiza los efectos, aplica *ducking* a la música y normaliza a −14 LUFS; `srt.py` genera SRT y ASS.

## Volver a exportar

Requisitos: Node 18+ con `playwright`, Python 3.10+ con `numpy scipy`, FFmpeg con libx264 y libass, fuente Inter instalada.

```bash
python source/compose/prep.py              # extrae fotogramas de grabaciones/ y genera data.js
node source/compose/render.js --workers 4  # video sin audio -> final/_video_sin_audio.mp4 (y source/sfx_events.json)
python source/audio/music.py               # música
python source/audio/mix.py                 # narración + efectos + mezcla final
python source/audio/srt.py                 # SRT + ASS
ffmpeg -i final/_video_sin_audio.mp4 -i audio/mezcla_final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart final/Commercial_Expert_iCAUR_9x16_66s.mp4
```

Vista previa de fotogramas sueltos: `node source/compose/render.js --stills 5,20,36.5` (crea `final/_still_*.jpg`). Versión sin textos: añadir `--notext 1 --out final/x.mp4`.

## Modificar el video

**Cambiar textos en pantalla:** edite el objeto `TEXTOS` al inicio de `source/compose/timeline.js`.

**Reemplazar la narración:**
1. Coloque la nueva toma en `audio/` y actualice `narration.file` en `source/timeline_master.json`.
2. Ajuste por frase `src` (inicio/fin dentro del archivo) y `dst` (momento en el video) de cada fragmento en `narration.chunks`.
3. Para recalcular los tiempos por palabra, transcriba con Whisper a `source/narration_asr.json` (formato del archivo actual) y ejecute `python source/audio/align.py`. Los textos y chips sincronizados usan esos tiempos automáticamente.
4. Ejecute `mix.py`, `srt.py` y vuelva a renderizar.

**Cambiar la duración de una escena:** modifique `t0`/`t1` de la escena en `timeline_master.json` y los tiempos internos de la misma escena en `timeline.js` (cada escena usa tiempos absolutos; los mapas `seg()` relacionan tiempo de video con tiempo de grabación). Luego ajuste `hits` para que la música marque los cortes y regenere música y mezcla.

**Cambiar el encuadre:** cada `browserWin(...)` recibe la cámara `{ fx, fy, s, px, py }`: `fx, fy` es el punto de la grabación (px CSS de una página 1280 × 800) que se coloca en `px, py` del lienzo, con escala `s`. Las animaciones se definen con `kf(t, [[tiempo, valor, curva], ...])`.

**Nuevas grabaciones:** los scripts `source/capture/c0*.js` repiten cada recorrido (`SLOW=3 node source/capture/c05_chat.js`). Las respuestas de la IA cambian en cada sesión: revise `grabaciones/C05_chat_log.json`, ya que los subrayados se ubican por frase con expresiones regulares.

## Premiere Pro y CapCut

- **Premiere Pro:** Archivo › Importar › `premiere_capcut/Commercial_Expert_iCAUR_Premiere.xml`. Si pide ubicar medios, apunte a las carpetas `final/` y `audio/` del ZIP. V1 trae el video sin textos cortado por escenas, V2 el final con textos (desactivado, como referencia), A1 las frases de la narración (cada una movible), A2 la música y A3 los efectos. Hay marcadores por escena.
- **CapCut:** importe `final/…_sin_textos.mp4`, `audio/narracion_editada.wav`, `audio/musica/musica_original_iCAUR.wav` y `audio/efectos/efectos_sonido.wav`; use `premiere_capcut/guia_cortes_CapCut.csv` para los puntos de corte y `final/…subtitulos_ES.srt` para los subtítulos automáticos. Baje la música unos 8 dB bajo la voz (o use la mezcla final).

## Identidad visual aplicada

Paleta iCAUR de trabajo: ocre #D58D0F para destacados, azul noche #1B1F28 y negro cálido #272421 como base, arena #C5A57B en etiquetas y café #5B3629 en resplandores; cierre sobre fondo claro #F8F7F4. Tipografía Inter (provisional). Logos oficiales tomados del propio sitio (`logo-icaur-blanco.png` sobre oscuro y `logo-icaur-negro.png` sobre claro), sin alteraciones.
