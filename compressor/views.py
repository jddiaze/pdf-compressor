from pathlib import Path
import tempfile

from django.http import FileResponse, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .engine import PRESETS, compress_pdf

MAX_FILE_SIZE = 50 * 1024 * 1024

def health(request):
    return HttpResponse("ok", content_type="text/plain")

def home(request):
    return render(request, "compressor/index.html", {"presets": PRESETS})

@require_POST
def compress(request):
    upload = request.FILES.get("pdf")
    preset_key = request.POST.get("preset", "balanced")

    if not upload:
        return JsonResponse({"error": "Selecciona un archivo PDF."}, status=400)

    if upload.size > MAX_FILE_SIZE:
        return JsonResponse({"error": "El archivo supera 50 MB."}, status=400)

    filename = upload.name or "documento.pdf"
    if not filename.lower().endswith(".pdf"):
        return JsonResponse({"error": "El archivo debe ser PDF."}, status=400)

    header = upload.read(5)
    upload.seek(0)
    if header != b"%PDF-":
        return JsonResponse({"error": "El archivo no parece ser un PDF válido."}, status=400)

    tempdir = tempfile.TemporaryDirectory(prefix="pdfcompress_")
    temp_path = Path(tempdir.name)
    input_path = temp_path / "input.pdf"
    output_path = temp_path / "compressed.pdf"

    with input_path.open("wb") as destination:
        for chunk in upload.chunks():
            destination.write(chunk)

    original_size = input_path.stat().st_size

    try:
        compress_pdf(input_path, output_path, preset_key)
    except Exception as exc:
        tempdir.cleanup()
        return JsonResponse({"error": f"No fue posible comprimir: {exc}"}, status=500)

    compressed_size = output_path.stat().st_size
    reduction = (1 - compressed_size / original_size) * 100 if original_size else 0

    download_name = f"{Path(filename).stem}_comprimido.pdf"
    file_handle = output_path.open("rb")

    response = FileResponse(
        file_handle,
        as_attachment=True,
        filename=download_name,
        content_type="application/pdf",
    )
    response["X-Original-Size"] = str(original_size)
    response["X-Compressed-Size"] = str(compressed_size)
    response["X-Reduction-Percent"] = f"{reduction:.2f}"
    response._tempdir = tempdir
    return response
