# Control de calidad · 8 de noviembre de 2026

## Técnico
- `Commercial_Expert_iCAUR_9x16_66s.mp4`: 66,0 s, 1080 × 1920, 30 fps CFR, H.264 High yuv420p, AAC 256 kbps 48 kHz, `+faststart`. FFmpeg decodifica el archivo completo sin errores.
- Sonoridad integrada −14,1 LUFS, pico −1,1 dBFS (estándar de redes sociales).
- Voz ≈ 12 dB por encima de la música durante la locución (*ducking* automático ≈ −8 dB); efectos por debajo de la voz.
- Render determinista fotograma a fotograma (sin fotogramas perdidos); los 7 tramos se revisaron con fotogramas cada 0,25 s en la escena del chat y cada 1 s en el resto (`final/control/`).

## Criterios del brief
| Criterio | Estado |
|---|---|
| Mayoría de demostraciones reales | ✅ 6 de 7 escenas son grabaciones reales en movimiento; la escena del CRM es un esquema explícitamente ilustrativo construido con fotogramas reales de las tres acciones. |
| Animaciones con propósito | ✅ Zooms y paneos siguen la acción (cursor, respuestas, botones); chips sincronizados con palabras de la locución. |
| Zoom al chat y a controles importantes | ✅ Zoom progresivo de la interfaz completa al chat, primer plano del campo de texto durante la escritura, vuelta a la respuesta; zoom al panel de características, al precio, al selector de color y a la reserva. |
| Flechas y señalizadores | ✅ Flecha + onda de clic en la navegación del hall; marcos sobre color, seguridad, autonomía, V27, puestos, reserva; subrayados sobre frases reales de las respuestas. |
| Zonas seguras 9:16 | ✅ Titulares entre y = 240 y 560 px; chips inferiores ≤ 1 640 px; subtítulos quemados con margen inferior de 430 px. |
| Narración coincide con la imagen | ✅ Tiempos por palabra con Whisper; cada frase se colocó sobre su acción (p. ej., «sabe qué modelo estás viendo» sobre la respuesta «El V27 que estás viendo…»). |
| Sin pantallas vacías, errores o pausas | ✅ La espera de la IA se comprimió (captura en cámara lenta); no aparecen errores ni ventanas emergentes del recorrido guiado. |
| Movimiento fluido | ✅ Cámara a 30 fps con curvas de aceleración; 3D capturado con reloj virtual a 30 fps exactos. |
| Identidad iCAUR | ✅ Paleta ocre / azul noche / arena / café, cierre claro, logos oficiales del propio sitio sin alterar, Inter. |

## Limitaciones conocidas
- Las escenas del visor 3D y de la galería interior provienen de capturas 1280 × 800 (render por software); se encuadraron con menos zoom para conservar nitidez.
- Las respuestas del asistente son reales pero cambian en cada sesión; si se vuelve a grabar, revise los subrayados.
- La narración es la toma de ElevenLabs entregada (voz «Lorena»). Si se requiere acento colombiano más marcado, se propone una nueva toma con el guion v2 de `Guion_y_tiempos.md`.
- La integración con CRM no se probó de extremo a extremo (ver `Funcionalidades_verificadas.md`).
