"""Generate web-ready derivatives of the supplied assets.

Reads originals from images/assets (never modified) and writes to public/.
Requires Pillow:  python3 -m pip install Pillow
Run from the repo root:  python3 scripts/optimize-images.py
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "assets"
OUT = ROOT / "public"
IMG = OUT / "images"
IMG.mkdir(parents=True, exist_ok=True)

# Sampled from the supplied logo files.
NAVY = (25, 47, 81)  # background of NEAR_logo_dark_high_quality.png
BLUE = (41, 91, 159)  # mark colour in NEAR_logo_light_high_quality.png
LIGHT_BG = 245  # background of NEAR_logo_light_high_quality.png


def save_webp(im, name, quality=80):
    im.save(IMG / name, "WEBP", quality=quality, method=6)


def resize_w(im, width):
    if im.width <= width:
        return im.copy()
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


# --- Hero + About -----------------------------------------------------------
planet = Image.open(SRC / "planet.webp").convert("RGB")
for w in (960, 1600, 2500):
    save_webp(resize_w(planet, w), f"planet-{w}.webp", quality=78)

screen = Image.open(SRC / "screen.webp").convert("RGB")
for w in (640, 1179):
    save_webp(resize_w(screen, w), f"screen-{w}.webp")

# --- Leadership portraits ---------------------------------------------------
# Crop boxes (left, top, width) in source pixels, chosen by eye so each face
# sits at a similar scale and position inside a 4:5 frame.
PORTRAITS = {
    "francisco-martinez-de-velasco": ("Fransisco.png", 378, 0, 1134),
    "luis-sayeg-seade": ("Luis.png", 402, 0, 1134),
    "roger-ingles": ("Roger.png", 236, 0, 1134),
    "francisco-martinez-de-velasco-cortina": ("FransiscoCortina.png", 470, 150, 880),
    # Dean's photo is a wider half-body shot: crop tighter so the face scale matches.
    "dean-barker": ("Dean.png", 625, 10, 580),
}
for slug, (file, left, top, width) in PORTRAITS.items():
    im = Image.open(SRC / file).convert("RGB")
    height = round(width * 5 / 4)
    box = (left, top, left + width, min(top + height, im.height))
    crop = im.crop(box)
    crop = ImageOps.fit(crop, (4 * 160, 5 * 160), Image.LANCZOS, centering=(0.5, 0))
    save_webp(crop, f"{slug}-640.webp", quality=82)
    if slug == "francisco-martinez-de-velasco":
        big = ImageOps.fit(im.crop(box), (960, 1200), Image.LANCZOS, centering=(0.5, 0))
        save_webp(big, f"{slug}-960.webp", quality=82)


# --- Logo + favicon ---------------------------------------------------------
def alpha_from_dark_logo():
    """White NEAR wordmark on transparency, derived from the dark logo."""
    im = Image.open(SRC / "NEAR_logo_dark_high_quality.png").convert("L")
    bg = 0.299 * NAVY[0] + 0.587 * NAVY[1] + 0.114 * NAVY[2]
    alpha = im.point(lambda v: max(0, min(255, round((v - bg - 20) * 255 / (215 - bg)))))
    bbox = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
    alpha = alpha.crop(bbox)
    out = Image.new("RGBA", alpha.size, (255, 255, 255, 0))
    out.putalpha(alpha)
    return out


def alpha_from_light_logo():
    """Blue NEAR logo on transparency, derived from the light logo."""
    im = Image.open(SRC / "NEAR_logo_light_high_quality.png").convert("L")
    mark = 0.299 * BLUE[0] + 0.587 * BLUE[1] + 0.114 * BLUE[2]
    alpha = im.point(
        lambda v: max(0, min(255, round((LIGHT_BG - 12 - v) * 255 / (LIGHT_BG - 12 - mark))))
    )
    bbox = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
    return alpha.crop(bbox)


logo = alpha_from_dark_logo()
logo_h = 120
resize_h = lambda im, h: im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
resize_h(logo, logo_h).save(IMG / "near-logo-white.png", optimize=True)

# The circular symbol is the left-most, roughly square region of the lockup.
light_alpha = alpha_from_light_logo()
symbol = light_alpha.crop((0, 0, light_alpha.height, light_alpha.height))
symbol = symbol.crop(symbol.point(lambda v: 255 if v > 40 else 0).getbbox())
side = max(symbol.size)
square = Image.new("L", (side, side), 0)
square.paste(symbol, ((side - symbol.width) // 2, (side - symbol.height) // 2))


def symbol_icon(size, pad_ratio=0.04, bg=None):
    pad = round(size * pad_ratio)
    a = square.resize((size - 2 * pad, size - 2 * pad), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), bg + (255,) if bg else (0, 0, 0, 0))
    fg = Image.new("RGBA", a.size, BLUE + (255,))
    canvas.paste(fg, (pad, pad), a)
    return canvas


symbol_icon(256).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
symbol_icon(32).save(OUT / "favicon-32.png", optimize=True)
symbol_icon(192).save(OUT / "icon-192.png", optimize=True)
symbol_icon(180, pad_ratio=0.14, bg=(243, 245, 247)).save(OUT / "apple-touch-icon.png", optimize=True)

# --- Open Graph image (1200x630): planet + white wordmark --------------------
og = ImageOps.fit(planet, (1200, 630), Image.LANCZOS, centering=(0.5, 0.55))
shade = Image.new("RGBA", og.size, (5, 8, 13, 110))
og = Image.alpha_composite(og.convert("RGBA"), shade)
mark = resize_h(logo, 96)
og.alpha_composite(mark, ((1200 - mark.width) // 2, (630 - mark.height) // 2))
og.convert("RGB").save(OUT / "og-image.jpg", quality=84, optimize=True, progressive=True)

for p in sorted(list(IMG.iterdir()) + [p for p in OUT.iterdir() if p.is_file()]):
    print(f"{p.relative_to(ROOT)}  {p.stat().st_size // 1024} KB")
