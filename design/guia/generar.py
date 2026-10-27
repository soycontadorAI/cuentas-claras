"""Genera el PDF de "La guía" (guía gratis de Cuentas Claras) desde docs/guia-hoja-del-anio.md.

El texto vive en el .md (fuente única); aquí solo el diseño, con el design system "libreta viva".
    python3 design/guia/generar.py
deja design/guia/guia.html y design/salidas/guia/cuentas-claras-la-guia.pdf (Chrome sin interfaz), y copia
el PDF a sitio/public/descargas/la-guia.pdf, que es lo que liga el correo de bienvenida de Sendy.

Lo que se toma del .md: de "## Portada" hasta antes de "## Notas internas". Las comillas rectas
se vuelven curvas, las casillas "- [ ]" se dibujan y las ligas salen con utm.
"""
import re
import subprocess
from html import escape
from pathlib import Path

import markdown

RAIZ = Path(__file__).resolve().parents[2]
MD = RAIZ / "docs" / "guia-hoja-del-anio.md"
HTML = Path(__file__).with_name("guia.html")
PDF = RAIZ / "design" / "salidas" / "guia" / "cuentas-claras-la-guia.pdf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def utm(url: str, lugar: str) -> str:
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}utm_source=cuentas-claras&utm_medium=guia&utm_campaign=cuentas-claras&utm_content={lugar}"


AGENDAR = utm("https://cc.sicastro.com/agendar", "guia-pdf")
DESPACHO = utm("https://sicastro.com/", "guia-pdf")
CANAL = "https://www.youtube.com/@cuentasclaras_mx"
WHATSAPP = "https://wa.me/525544753602?text=" + "Hola%20Israel%2C%20vengo%20de%20la%20gu%C3%ADa%20y%20quiero%20pagar%20mi%20consulta%20por%20transferencia."


def secciones(md: str) -> dict[str, str]:
    cuerpo = md.split("\n## Portada", 1)[1].split("\n## Notas internas", 1)[0]
    partes = re.split(r"\n## ", "\n## Portada" + cuerpo)
    out = {}
    for p in partes:
        if not p.strip():
            continue
        titulo, _, texto = p.partition("\n")
        out[titulo.strip()] = texto.strip().removesuffix("---").strip()
    return out


def curvas(texto: str) -> str:
    n = texto.count('"')
    assert n % 2 == 0, f"comillas impares ({n})"
    return re.sub(r'"([^"]+)"', "“\\1”", texto)


def a_html(texto: str) -> str:
    # "**Enero**" seguido de su lista sin renglón en blanco: markdown lo pegaría como párrafo
    texto = re.sub(r"^(\*\*[^*\n]+\*\*)\n(- )", "\\1\n\n\\2", texto, flags=re.M)
    h = markdown.markdown(curvas(texto), extensions=["tables"])
    h = h.replace("<li>[ ] ", '<li class="casilla">')
    h = h.replace("<p><em>Fundamento", '<p class="fundamento"><em>Fundamento')
    h = h.replace("<p><em>Ejemplo", '<p class="fundamento"><em>Ejemplo')
    return h


def calendario(texto: str) -> str:
    filas = re.findall(r"^\| (\*\*)?([A-Za-zé]+)(?:\*\*)? \| (.+?) \|$", texto, re.M)
    meses = [(m, t, bool(b)) for b, m, t in filas if m != "Mes"]
    assert len(meses) == 12, meses
    items = "".join(
        f'<li class="{"clave" if clave else ""}"><span class="mes">{escape(m)}</span>'
        f'<span class="que">{escape(curvas(t))}</span></li>'
        for m, t, clave in meses
    )
    resto = texto.split("\n\n", 1)[0]  # párrafo de introducción
    pie = texto.rsplit("|", 1)[1].strip()
    return (
        f'<p class="intro">{a_html(resto)[3:-4]}</p><ol class="meses">{items}</ol>'
        f'<div class="cada-mes">{a_html(pie)[3:-4]}</div>'
    )


def parte4(texto: str) -> str:
    h = a_html(texto)
    h = h.replace(
        "Da clic en <strong>Agendar mi consulta</strong> (cc.sicastro.com/agendar)",
        f'Da clic en <a href="{AGENDAR}"><strong>Agendar mi consulta</strong></a> (cc.sicastro.com/agendar)',
    )
    h = h.replace("<strong>55 4475 3602</strong>", f'<a href="{WHATSAPP}"><strong>55 4475 3602</strong></a>')
    h = h.replace("en sicastro.com están", f'en <a href="{DESPACHO}">sicastro.com</a> están')
    h += (
        f'<p class="botones"><a class="btn" href="{AGENDAR}">Agendar mi consulta</a>'
        f'<a class="btn claro" href="{DESPACHO}">Ir al despacho</a></p>'
    )
    return h


def cierre(texto: str) -> str:
    h = a_html(texto)
    return h.replace("youtube.com/@cuentasclaras_mx", f'<a href="{CANAL}">youtube.com/@cuentasclaras_mx</a>')


BILLETE = (Path(RAIZ / "design" / "simbolo.svg").read_text()).replace('role="img"', 'aria-hidden="true" class="billete"')


def armar() -> str:
    s = secciones(MD.read_text())
    portada = s["Portada"].splitlines()
    titulo = portada[0].strip("* ")
    bajada, firma = portada[1], portada[2]
    p1 = s["Parte 1. Los impuestos sin rodeos: cinco preguntas"]
    p2 = s["Parte 2. El calendario de 12 meses"]
    p3 = s["Parte 3. El checklist del mes"]
    p4_titulo = next(k for k in s if k.startswith("Parte 4."))
    return PLANTILLA.format(
        titulo=escape(titulo),
        bajada=escape(bajada),
        firma=escape(firma),
        billete=BILLETE,
        foto=(RAIZ / "design" / "assets" / "israel-cruzado.webp").as_uri(),
        antes=a_html(s["Antes de empezar"]),
        p1=a_html(p1),
        p2=calendario(p2),
        p3=a_html(p3),
        p4_titulo=escape(p4_titulo.split(". ", 1)[1]),
        p4=parte4(s[p4_titulo]),
        cierre=cierre(s["Cierre"]),
        agendar=AGENDAR,
    )


PLANTILLA = """<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<title>La guía · Cuentas Claras</title>
<style>
@font-face {{ font-family: "Bricolage Grotesque"; font-weight: 200 800; font-stretch: 75% 100%; src: url(fuentes/bricolage-grotesque-latin-standard-normal.woff2) format("woff2-variations"); unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD; }}
@font-face {{ font-family: "Bricolage Grotesque"; font-weight: 200 800; font-stretch: 75% 100%; src: url(fuentes/bricolage-grotesque-latin-ext-standard-normal.woff2) format("woff2-variations"); unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF; }}
@font-face {{ font-family: "Shrikhand"; src: url(fuentes/shrikhand-latin-400-normal.woff2) format("woff2"); }}
:root {{
  --crema: #FFF6E8; --papel: #FFFBF3; --cacao: #3B2418; --cacao-70: rgba(59,36,24,.72);
  --cacao-12: rgba(59,36,24,.12); --rosa: #E4007C; --rosa-hondo: #B0005F; --maiz: #F6C343;
  --margen: #F2A3C7;
  --display: "Bricolage Grotesque", system-ui, sans-serif; --rotulo: "Shrikhand", cursive;
}}
@page {{ size: letter; margin: 16mm 16mm 18mm 24mm; background: #FFF6E8;
  @bottom-left {{ content: "Cuentas Claras · CP Israel Castro · cc.sicastro.com"; font-family: "Bricolage Grotesque"; font-size: 8pt; font-weight: 600; color: rgba(59,36,24,.72); }}
  @bottom-right {{ content: counter(page); font-family: "Bricolage Grotesque"; font-size: 8pt; font-weight: 800; color: #B0005F; }} }}
@page :first {{ margin: 0; @bottom-left {{ content: none; }} @bottom-right {{ content: none; }} }}
* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; background: var(--crema); }}
/* La libreta: fija, así se repite en cada página y cubre también los márgenes */
.libreta {{ position: fixed; top: -16mm; left: -24mm; width: 215.9mm; height: 279.4mm; z-index: -1;
  background-color: var(--crema);
  background-image: linear-gradient(90deg, transparent 13.5mm, var(--margen) 13.5mm, var(--margen) 14mm, transparent 14mm),
    linear-gradient(var(--cacao-12) 1px, transparent 1px), linear-gradient(90deg, var(--cacao-12) 1px, transparent 1px);
  background-size: 100% 100%, 8mm 8mm, 8mm 8mm; }}
body {{ margin: 0; font-family: var(--display); color: var(--cacao); font-size: 10.4pt; line-height: 1.46; }}

/* Portada */
.portada {{ position: relative; height: 279.4mm; padding: 26mm 20mm 20mm 30mm; overflow: hidden; break-after: page; background: var(--crema); }}
.portada::before {{ content: ""; position: absolute; inset: 0; background-image: linear-gradient(var(--cacao-12) 1px, transparent 1px), linear-gradient(90deg, var(--cacao-12) 1px, transparent 1px); background-size: 8mm 8mm; }}
.portada::after {{ content: ""; position: absolute; top: 0; bottom: 0; left: 18mm; border-left: 1.4pt solid var(--margen); }}
.portada > * {{ position: relative; z-index: 1; }}
.portada .marca {{ display: flex; align-items: center; gap: 3mm; font-weight: 800; font-size: 12pt; letter-spacing: .02em; }}
.portada .marca .billete {{ width: 13mm; height: 13mm; }}
.portada .etiqueta {{ display: inline-block; margin-top: 30mm; background: var(--rosa-hondo); color: var(--crema); font-weight: 800; font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; padding: 1.6mm 3.5mm; border-radius: 99px; }}
.portada h1 {{ font-family: var(--rotulo); font-weight: 400; color: var(--rosa); font-size: 88pt; line-height: .95; margin: 6mm 0 0; }}
.portada .bajada {{ font-size: 25pt; font-weight: 800; font-stretch: 92%; line-height: 1.12; max-width: 105mm; margin: 6mm 0 0; }}
.portada .bajada span {{ background: linear-gradient(transparent 52%, var(--maiz) 52%, var(--maiz) 92%, transparent 92%); }}
.portada .trae {{ margin: 12mm 0 0; padding: 0; list-style: none; max-width: 92mm; }}
.portada .trae li {{ display: flex; gap: 3mm; align-items: baseline; font-size: 11pt; font-weight: 600; margin-bottom: 2.6mm; }}
.portada .trae li::before {{ content: "✓"; color: var(--rosa); font-weight: 800; font-size: 13pt; }}
.portada .foto {{ position: absolute; right: -6mm; bottom: 0; width: 112mm; filter: drop-shadow(5mm 4mm 0 var(--maiz)); }}
.portada .firma {{ position: absolute; left: 30mm; bottom: 20mm; font-size: 10pt; font-weight: 700; color: var(--cacao-70); }}

/* Texto corrido */
h2 {{ font-weight: 800; font-stretch: 92%; font-size: 24pt; line-height: 1.05; margin: 0 0 5mm; }}
h2 .num {{ display: block; font-size: 9pt; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--rosa-hondo); margin-bottom: 2mm; }}
h3 {{ font-weight: 800; font-size: 14pt; line-height: 1.2; margin: 7mm 0 2.5mm; break-after: avoid; }}
h3 + p {{ break-before: avoid; }}
p:has(+ table) {{ break-after: avoid; }}
p {{ margin: 0 0 2.6mm; orphans: 3; widows: 3; }}
strong {{ font-weight: 800; }}
a {{ color: var(--rosa-hondo); font-weight: 700; }}
.seccion {{ break-before: page; }}
.antes {{ background: var(--papel); border: 1.2pt solid var(--cacao); border-radius: 4mm; padding: 6mm 7mm; box-shadow: 2mm 2mm 0 var(--cacao); margin-bottom: 9mm; }}
.antes h2 {{ font-size: 16pt; margin-bottom: 3mm; }}
.fundamento {{ font-size: 8.4pt; line-height: 1.4; color: var(--cacao-70); border-top: .8pt dashed var(--cacao-12); padding-top: 1.6mm; margin-top: 3mm; }}
table {{ width: 100%; border-collapse: collapse; margin: 3mm 0 4mm; font-size: 9.4pt; break-inside: avoid; background: var(--papel); }}
th {{ text-align: left; font-weight: 800; border-bottom: 1.6pt solid var(--cacao); padding: 1.8mm 2mm; }}
td {{ border-bottom: .7pt solid var(--cacao-12); padding: 1.6mm 2mm; vertical-align: top; }}
td strong {{ color: var(--rosa-hondo); }}
ul {{ padding-left: 5mm; margin: 0 0 3mm; }}
li {{ margin-bottom: 1.4mm; }}
li::marker {{ color: var(--rosa); }}

/* Parte 2: el calendario, para el refri */
.meses {{ list-style: none; padding: 0; margin: 5mm 0; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; }}
.meses li {{ background: var(--papel); border: 1.1pt solid var(--cacao); border-radius: 3mm; padding: 3.2mm 3.6mm; min-height: 33mm; margin: 0; }}
.meses .mes {{ display: block; font-weight: 800; font-size: 12pt; margin-bottom: 1.2mm; }}
.meses .que {{ font-size: 9.6pt; line-height: 1.35; }}
.meses .clave {{ border: 1.8pt solid var(--rosa); box-shadow: 1.6mm 1.6mm 0 var(--rosa); }}
.meses .clave .mes {{ color: var(--rosa-hondo); }}
.intro {{ font-size: 11.4pt; }}
.cada-mes {{ background: var(--maiz); border-radius: 3mm; padding: 3.6mm 5mm; font-size: 10.4pt; }}

/* Parte 3: las casillas */
.checklist p strong:only-child {{ display: block; font-size: 12.5pt; margin: 5mm 0 1.4mm; padding-bottom: 1mm; border-bottom: 1.4pt solid var(--cacao); break-after: avoid; }}
.checklist ul {{ list-style: none; padding: 0; break-before: avoid; break-inside: avoid; }}
.checklist li.casilla {{ position: relative; padding-left: 7mm; break-inside: avoid; }}
.checklist li.casilla::before {{ content: ""; position: absolute; left: 0; top: .9mm; width: 3.6mm; height: 3.6mm; border: 1.2pt solid var(--cacao); border-radius: 1mm; background: var(--papel); }}

/* Parte 4 y cierre */
.botones {{ display: flex; gap: 4mm; margin: 6mm 0 2mm; }}
.btn {{ display: inline-block; text-decoration: none; background: var(--cacao); color: var(--crema); font-weight: 800; font-size: 11pt; padding: 3mm 6mm; border-radius: 99px; box-shadow: 1.2mm 1.2mm 0 var(--rosa); }}
.btn.claro {{ background: var(--papel); color: var(--cacao); border: 1.2pt solid var(--cacao); box-shadow: none; }}
.cierre {{ margin-top: 12mm; background: var(--papel); border: 1.2pt dashed var(--cacao); border-radius: 4mm; padding: 6mm 7mm; }}
.cierre p:last-child {{ font-weight: 800; margin: 0; }}
</style>
</head>
<body>
<div class="libreta" aria-hidden="true"></div>

<section class="portada">
  <div class="marca">{billete}<span>Cuentas Claras</span></div>
  <span class="etiqueta">Guía gratis</span>
  <h1>{titulo}</h1>
  <p class="bajada"><span>{bajada}</span></p>
  <ul class="trae">
    <li>Los impuestos sin rodeos, en cinco preguntas</li>
    <li>El calendario de 12 meses, para el refri</li>
    <li>El checklist del mes: si tienes X, haz Y</li>
  </ul>
  <img class="foto" src="{foto}" alt="Israel Castro">
  <p class="firma">{firma}</p>
</section>

<section class="antes"><h2>Antes de empezar</h2>{antes}</section>

<section class="parte1"><h2><span class="num">Parte 1</span>Los impuestos sin rodeos: cinco preguntas</h2>{p1}</section>

<section class="seccion"><h2><span class="num">Parte 2</span>El calendario de 12 meses</h2>{p2}</section>

<section class="seccion checklist"><h2><span class="num">Parte 3</span>El checklist del mes</h2>{p3}</section>

<section class="seccion"><h2><span class="num">Parte 4</span>{p4_titulo}</h2>{p4}
  <div class="cierre">{cierre}</div>
</section>
</body>
</html>
"""

if __name__ == "__main__":
    HTML.write_text(armar())
    PDF.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [CHROME, "--headless=new", "--no-pdf-header-footer", "--virtual-time-budget=6000",
         f"--print-to-pdf={PDF}", HTML.as_uri()],
        check=True, capture_output=True,
    )
    # La copia que se sirve en cc.sicastro.com/descargas/la-guia.pdf (la liga del correo de Sendy)
    (RAIZ / "sitio" / "public" / "descargas" / "la-guia.pdf").write_bytes(PDF.read_bytes())
    print(PDF)
