from dataclasses import dataclass
from pathlib import Path
import os
import shutil
import subprocess

@dataclass(frozen=True)
class CompressionPreset:
    name: str
    color_dpi: int
    gray_dpi: int
    mono_dpi: int
    jpeg_quality: int

PRESETS = {
    "ultra": CompressionPreset("Máxima compresión", 96, 96, 200, 55),
    "small": CompressionPreset("Archivo pequeño", 120, 120, 250, 68),
    "balanced": CompressionPreset("Equilibrada", 150, 150, 300, 82),
    "quality": CompressionPreset("Alta calidad", 200, 200, 400, 88),
}

def find_ghostscript():
    explicit = os.getenv("GS_EXECUTABLE")
    if explicit and Path(explicit).exists():
        return explicit

    for candidate in ("gs", "gswin64c", "gswin32c"):
        found = shutil.which(candidate)
        if found:
            return found

    raise RuntimeError("No se encontró Ghostscript.")

def compress_pdf(input_path: Path, output_path: Path, preset_key: str):
    preset = PRESETS.get(preset_key, PRESETS["balanced"])
    gs = find_ghostscript()

    cmd = [
        gs,
        "-sDEVICE=pdfwrite",
        "-dNOPAUSE",
        "-dBATCH",
        "-dQUIET",
        "-dSAFER",
        "-dCompatibilityLevel=1.7",
        "-dAutoFilterColorImages=false",
        "-dAutoFilterGrayImages=false",
        "-dColorImageFilter=/DCTEncode",
        "-dGrayImageFilter=/DCTEncode",
        f"-dJPEGQ={preset.jpeg_quality}",
        "-dDownsampleColorImages=true",
        f"-dColorImageResolution={preset.color_dpi}",
        "-dColorImageDownsampleType=/Bicubic",
        "-dColorImageDownsampleThreshold=1.0",
        "-dDownsampleGrayImages=true",
        f"-dGrayImageResolution={preset.gray_dpi}",
        "-dGrayImageDownsampleType=/Bicubic",
        "-dGrayImageDownsampleThreshold=1.0",
        "-dDownsampleMonoImages=true",
        f"-dMonoImageResolution={preset.mono_dpi}",
        "-dMonoImageDownsampleType=/Subsample",
        "-dMonoImageFilter=/CCITTFaxEncode",
        "-dDetectDuplicateImages=true",
        "-dCompressFonts=true",
        "-dSubsetFonts=true",
        "-dEmbedAllFonts=true",
        "-dCompressPages=true",
        f"-sOutputFile={output_path}",
        str(input_path),
    ]

    completed = subprocess.run(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=110,
    )

    if completed.returncode != 0 or not output_path.exists():
        raise RuntimeError(completed.stderr.strip() or "Ghostscript no produjo salida.")

    return preset
