# Funcionalidades verificadas · Chery Commercial Expert

Exploración automatizada con Playwright/Chromium el **8 de noviembre de 2026** sobre https://chery.commercialexpert.denivodigital.com/ (escritorio 1280 × 800).
No se envió ningún formulario, no se inició ningún pago y solo se aceptó la autorización obligatoria de datos (analítica y asesoría personalizada).

## ✅ Verificado y mostrado en el video

| Área | Funcionalidad | Evidencia |
|---|---|---|
| Acceso | Pantalla de autorización de datos y recorrido guiado con opción «Saltar» (misma plataforma que iCAUR, marca Chery). | Exploración |
| Hall digital | 8 stands navegables: iCAR 03T, iCAR 03, Chery E5, Tiggo 4 CSH, Tiggo 7 CSH, Tiggo 8 CSH, Tiggo 9 CSH y Tiggo 7 PRO MHEV, con transiciones en video y barra de seguridad por modelo. | `grabaciones/C01_hall.mp4` (recorrido E5 → Tiggo 4 → Tiggo 7 → Tiggo 8 → Tiggo 9) |
| Visor 3D | Tiggo 9 CSH en 3D: rotación por arrastre, zoom, 5 colores (Negro, Blanco, Gris Tecno, Gris Cósmico, Verde Aurora), puntos de interés con vuelo de cámara, Exterior/Interior, Restablecer vista, Vista 360°. | `C03a_visor3d_rotacion.mp4`, `C03b_visor3d_colores_hotspot.mp4` |
| Galería interior | Tiggo 9 CSH: 6 imágenes (cabina de 7 pasajeros 2+3+2 con cojinería en cuero sintético, puesto de conducción, consola, techo, rines, sistema híbrido). | `C04a_galeria_interior.mp4` |
| Menú | Cambiar de modelo, Características (Motor, Desempeño, Batería, Autonomía, Tiempo de carga, Conectividad, Seguridad, Modos de manejo, Colores, Rines, Garantía), Precio, Financiación, Ficha técnica, Vista 360°, Vista interior. | `C04b_menu_precio.mp4` |
| Precio | Pregunta real al chat. Respuesta: Tiggo 9 CSH, versión única, precio de lista 210.990.000 COP, verificado el 5 de noviembre de 2026. | `C04b_menu_precio.mp4` |
| Chat · contexto | Sobre el stand Tiggo 9 CSH: «¿Qué autonomía tiene este vehículo?» → «El Tiggo 9 CSH que estás viendo publica 140 km en modo 100 % eléctrico y hasta 1.400 km de autonomía total…», con la aclaración de que son valores de ensayo. | `C05_chat.mp4`, `C05_chat_log.json` |
| Chat · comparación | «¿En qué se diferencian el Tiggo 8 y el Tiggo 9?» → ambos híbridos enchufables de tres filas; el Tiggo 9 añade tracción integral con motor eléctrico trasero, masaje, volante calefactable, etc. | ídem |
| Chat · perfilamiento | Ante ciudad + viajes en familia: ambos de 7 puestos, Tiggo 8 tracción delantera y Tiggo 9 4WD; pregunta cuántas personas viajan y qué prioriza antes de recomendar. | ídem |
| Chat · conversión | «¿Cómo puedo agendar una prueba de manejo?» → remite al botón «Prueba de Manejo» del showroom. | ídem |
| Prueba de manejo | Modal con el formulario oficial de Chery (www.chery.com.co/test-drive) embebido: «Siente la diferencia al volante», «Completa tus datos». | `C06a_testdrive_datos.mp4` |
| Envía tus datos | Formulario de contacto y perfilamiento (datos básicos, sede, vehículo de interés, uso, presupuesto, tiempo de compra, preferencias de seguimiento y autorización). | `C06a_testdrive_datos.mp4` |
| Reserva | «Reserva tu Chery» abre www.chery.com.co/pedidos con el Tiggo 9 CSH (PHEV) preseleccionado y atribución (`utm_source=commercial_expert`, `cx_ref`): 1.400 km de autonomía, 422 HP, 580 Nm, colores, «Desde $210.990.000» y «Reserva tu Chery pagando hoy $1.000.000». | `C06b_reserva_portal.mp4` |

## ⚠️ No comprobado y tratamiento

| Tema | Situación | Tratamiento |
|---|---|---|
| Integración con CRM | No se enviaron datos reales. | Esquema rotulado «ilustrativo», condicionado a «Solo con tu autorización». |
| Horarios de test drive y pago de reserva | No se seleccionó horario ni se pulsó «Reservar». | Navegación hasta el paso previo. |
| Ficha técnica, Contacto, traspaso a asesor humano | No grabados / no probados. | Solo se mencionan (locución y menú). |
| Modelos iCAR 03T e iCAR 03 | Forman parte del portafolio del showroom Chery. | No se usan como protagonistas: según el lineamiento de marca recuperado, las piezas de iCAR 03/03T usan identidad iCAR. El recorrido del hall empieza en el Chery E5. |
| Actualizaciones en tiempo real (Pusher) | Bloqueadas en el entorno de captura; el chat respondió por HTTP. | Sin efecto visible. |
| Variabilidad de respuestas | Generadas por IA, cambian por sesión. | Se usan respuestas reales capturadas el 8/11/2026 y se rotulan como tales. |

## Notas técnicas
- Hall, chat, menú y conversión: captura en tiempo real 2560 × 1600 en cámara lenta (×3; formularios oficiales ×6 con interpolación de movimiento para suavizar el desplazamiento).
- Visor 3D y galería: fotograma a fotograma con reloj virtual a 1280 × 800.
- Se bloqueó Google Tag Manager durante la captura para no alterar la analítica del cliente.
