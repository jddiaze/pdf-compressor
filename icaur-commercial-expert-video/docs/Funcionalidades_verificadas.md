# Funcionalidades verificadas · iCAUR Commercial Expert

Exploración automatizada con Playwright/Chromium el **8 de noviembre de 2026** sobre https://icaur.commercialexpert.denivodigital.com/ (escritorio 1280 × 800).
No se envió ningún formulario, no se inició ningún pago y solo se aceptó la autorización obligatoria de datos (analítica y asesoría personalizada); no se autorizó contacto comercial ni publicidad.

## ✅ Verificado y mostrado en el video

| Área | Funcionalidad | Evidencia |
|---|---|---|
| Acceso | Pantalla de autorización de datos (iCAUR Colombia – Autovardí S.A.S.) que informa que el asesor es un sistema de IA; consentimientos obligatorio y opcionales. | Exploración (no se muestra en el video). |
| Acceso | Recorrido guiado (3 pasos en el hall, 10 en el visor 3D) con opción «Saltar». | Exploración. |
| Hall digital | Dos stands navegables (V23 1/2, V27 2/2), flechas, transiciones en video del pabellón, botón «Ver en 3D», barra de seguridad 2WD/4WD. | `grabaciones/C01_hall.mp4` |
| Visor 3D | Modelo 3D real (model-viewer): rotación por arrastre, colores del V23 (gris, plata, verde, blanco, negro, naranja), Exterior/Interior, «Restablecer vista», puntos de interés con vuelo de cámara, Vista 360°. | `C03a_visor3d_rotacion.mp4`, `C03b_visor3d_colores_hotspot.mp4` |
| Galería interior | 6 imágenes con descripción: cabina, pantalla central de 15,4" con Apple CarPlay y Android Auto, asientos, espacio frontal, acceso trasero, baúl. | `C04a_galeria_interior.mp4` |
| Menú | Cambiar de modelo, Características (Motor, Desempeño, Batería, Autonomía, Tiempo de carga, Conectividad, Seguridad, Modos de manejo, Colores, Rines, Garantía), Precio, Financiación, Ficha técnica, Vista 360°, Vista interior. | `C04b_menu_precio.mp4` |
| Precio | El botón envía una pregunta real al chat. Respuesta obtenida: V23 2WD 84.990.000 COP y 4WD 104.990.000 COP («precios oficiales verificados el 5 de noviembre de 2026 y pueden cambiar»). | `C04b_menu_precio.mp4` |
| Chat iCAUR Expert | «Asesor Comercial Experto», aviso «Respuestas generadas por IA», selector ES/EN, indicador «está escribiendo». | `C05_chat.mp4` |
| Chat · contexto | Sobre el stand V27, «¿Qué autonomía tiene este vehículo?» → «El V27 que estás viendo tiene una autonomía total publicada de 1.000 km en ciclo NEDC…». | `C05_chat.mp4`, `C05_chat_log.json` |
| Chat · comparación | «¿En qué se diferencian el V23 y el V27?» → V23 EV 100 % eléctrico vs. V27 REEV con motor a gasolina que genera electricidad; puestos y baúl. | ídem |
| Chat · perfilamiento | Ante un uso descrito (ciudad + viajes en familia) pregunta cuántas personas viajan y qué prioriza (espacio, autonomía o precio) antes de recomendar. | ídem |
| Chat · objeciones | Aclara que las autonomías son cifras de ensayo y no una promesa de alcance real; en financiación indica que las condiciones dependen del perfil y no se entregan por este canal. | ídem + exploración |
| Chat · conversión | «¿Cómo puedo agendar una prueba de manejo?» → remite al botón «Prueba de Manejo» del showroom. | ídem |
| Prueba de manejo | Modal con el formulario oficial de iCAUR (www.icaur.com.co/test-drive) embebido: «Tu cita queda registrada directamente con la marca»; formulario «Reserva tu experiencia» (vehículo, lugar, horario). | `C06a_testdrive_datos.mp4` |
| Envía tus datos | Formulario de contacto y perfilamiento: nombre, correo, teléfono, canal preferido, ciudad y sede, vehículo de interés, uso, características buscadas, presupuesto, interés en financiación, tiempo de compra, rango de edad, preferencias de seguimiento y autorización de contacto. | `C06a_testdrive_datos.mp4` |
| Reserva | «Reserva tu iCAUR» abre el portal oficial www.icaur.com.co/pedidos con el modelo activo preseleccionado y parámetros de atribución (`utm_source=commercial_expert`, `cx_ref`). Muestra precio vigente (V23 4x2: $84.990.000) y «Reserva tu iCAUR pagando hoy $1.000.000». | `C06b_reserva_portal.mp4` |

## ⚠️ No comprobado (y cómo se trató en el video)

| Tema | Situación | Tratamiento |
|---|---|---|
| Integración con CRM de extremo a extremo | No se enviaron datos reales; no hay acceso al CRM. La plataforma indica que la cita «queda registrada directamente con la marca» y que el contacto comercial requiere autorización. | Se muestra como **esquema ilustrativo** (rotulado así), condicionado a «Solo con tu autorización». No se inventan pantallas de CRM. |
| Disponibilidad real de horarios de test drive y pago de reserva | No se seleccionaron horarios ni se pulsó «Reservar». | Se muestra la navegación hasta el paso previo. |
| Traspaso a asesor humano | No se probó. | El chip final dice «Seguimiento de un asesor iCAUR» dentro del esquema ilustrativo, ligado a la autorización. |
| Ficha técnica | Abre un documento externo; no se grabó. | Solo se menciona en la locución y en la lista de opciones del menú (existe el botón). |
| Interior en 3D | El interior es una galería de imágenes, no un modelo 3D. | Se presenta como «Galería interior». |
| Actualizaciones en tiempo real (Pusher) | El servicio de WebSocket estaba bloqueado en el entorno de captura; el chat respondió igualmente por HTTP. | Sin efecto visible. |
| Variabilidad de respuestas | Las respuestas del asistente son generadas por IA y cambian en cada sesión. | Se usan respuestas reales capturadas el 8/11/2026 y se rotulan «Respuestas reales del asistente · IA». |

## Notas técnicas de captura

- El hall, el chat y la conversión se grabaron en tiempo real a 2560 × 1600 en «cámara lenta» (×3) y se devolvieron a velocidad normal; por eso la espera de la IA aparece comprimida (~1 s en lugar de ~4–6 s).
- El visor 3D y la galería interior se renderizan muy lento en una GPU por software; se capturaron fotograma a fotograma con reloj virtual (30 fps exactos) a 1280 × 800, por lo que esas escenas se encuadran con menos zoom.
- Se bloqueó Google Tag Manager durante la captura para no alterar la analítica del cliente.
