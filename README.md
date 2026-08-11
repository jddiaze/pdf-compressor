# PDF Compressor

Django + Ghostscript, listo para Render mediante Docker.

## Deploy

1. Crea un repositorio nuevo en GitHub.
2. Sube todos estos archivos a la raíz.
3. En Render: New > Blueprint.
4. Conecta el repositorio.
5. Render detectará `render.yaml`.
6. Confirma el servicio Free.
7. Render construirá Docker e instalará Ghostscript automáticamente.

No necesitas instalar Ghostscript en tu PC.

## Local

Si algún día tienes Ghostscript disponible:

```bash
python -m venv .venv
pip install -r requirements.txt
python manage.py runserver
```
