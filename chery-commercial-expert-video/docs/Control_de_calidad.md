# Control de calidad · 8 de noviembre de 2026

## Técnico
- `Commercial_Expert_Chery_16x9_66s.mp4` (principal): 66,0 s, 1920 × 1080, 30 fps CFR, H.264 High yuv420p, AAC 256 kbps 48 kHz, `+faststart`. FFmpeg decodifica el archivo completo sin errores.
- Sonoridad integrada −14,1 LUFS, pico −1,2 dBFS (estándar de redes sociales).
- Voz ≈ 12 dB por encima de la música durante la locución (*ducking* automático ≈ −8 dB); efectos por debajo de la voz.
- Render determinista fotograma a fotograma (sin fotogramas perdidos); los 7 tramos se revisaron con fotogramas cada 0,25 s en la escena del chat y cada 1 s en el resto (`final/control/`).

## Criterios del brief
| Criterio | Estado |
|---|---|
| Mayoría de demostraciones reales | ✅ 6 de 7 escenas son grabaciones reales en movimiento; la escena del CRM es un esquema explícitamente ilustrativo construido con fotogramas reales de las tres acciones. |
| Animaciones con propósito | ✅ Zooms y paneos siguen la acción (cursor, respuestas, botones); chips sincronizados con palabras de la locución. |
| Zoom al chat y a controles importantes | ✅ Zoom progresivo de la interfaz completa al chat, primer plano del campo de texto durante la escritura, vuelta a la respuesta; zoom al panel de características, al precio, al selector de color y a la reserva. |
| Flechas y señalizadores | ✅ Flecha + ondas de clic en cada cambio de stand del hall; marcos sobre color, seguridad, autonomía, Tiggo 9 CSH, puestos, tracción, precio y botón Reservar; subrayados sobre frases reales de las respuestas. |
| Composición 16:9 / 9:16 | ✅ 16:9: interfaz a la derecha y textos en columna izquierda (x = 110 px), subtítulos con margen inferior de 60 px. 9:16: titulares entre y = 230 y 560 px, chips ≤ 1 640 px, subtítulos con margen de 430 px. |
| Narración coincide con la imagen | ✅ Tiempos por palabra con Whisper; cada frase se colocó sobre su acción (p. ej., «sabe qué modelo estás viendo» sobre la respuesta «El Tiggo 9 CSH que estás viendo…»). |
| Sin pantallas vacías, errores o pausas | ✅ La espera de la IA se comprimió (captura en cámara lenta); no aparecen errores ni ventanas emergentes del recorrido guiado. |
| Movimiento fluido | ✅ Cámara a 30 fps con curvas de aceleración; 3D capturado con reloj virtual a 30 fps exactos. |
| Identidad Chery | ✅ Paleta de la plataforma Chery (azul #0069FF sobre grafito y blanco), cierre claro, logos oficiales SVG del propio sitio sin alterar, Inter. Los modelos iCAR no son protagonistas. |

## Limitaciones conocidas
- Las escenas del visor 3D y de la galería interior provienen de capturas 1280 × 800 (render por software); se encuadraron con menos zoom para conservar nitidez.
- Las respuestas del asistente son reales pero cambian en cada sesión; si se vuelve a grabar, revise los subrayados.
- La narración es la toma de ElevenLabs entregada (voz «Lorena»).
- El desplazamiento de los formularios oficiales (sitio www.chery.com.co embebido) se capturó a pocos fotogramas por segundo; se suavizó con interpolación de movimiento.
- La integración con CRM no se probó de extremo a extremo (ver `Funcionalidades_verificadas.md`).
