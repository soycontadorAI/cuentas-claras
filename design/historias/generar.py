"""Genera design/tableros/historias.html: las historias destacadas de @soyisraelcastro.

Cada destacada = una portada (el círculo que se ve en el perfil) + sus historias (1080 × 1920).
Los textos viven aquí abajo; el diseño, en CSS dentro de PLANTILLA. Para exportar:
    python3 design/historias/generar.py && design/historias/exportar.sh

Zonas seguras de Instagram en 1080 × 1920: arriba 250 px (barra de progreso y nombre) y abajo
340 px (responder y reacciones). Las cajas punteadas marcan dónde va el sticker de enlace: se
ponen en la app y no salen en el PNG.
"""
from html import escape
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "tableros" / "historias.html"

HANDLE = "@soyisraelcastro"

# Íconos de las portadas (viewBox 0 0 200 200). currentColor = trazo; var(--acento) = el detalle.
ICONOS = {
    "billete": '<use href="#simbolo"/>',
    "hoja": '<rect x="48" y="26" width="104" height="148" rx="12" fill="none" stroke="currentColor" stroke-width="10"/>'
            '<path d="M70 62h60M70 88h60M70 114h34" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>'
            '<path d="M112 128l12 12 24-28" fill="none" stroke="var(--acento)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
    "pregunta": '<text x="100" y="152" text-anchor="middle" font-family="Shrikhand" font-size="150" fill="currentColor">?</text>'
                '<circle cx="150" cy="52" r="16" fill="var(--acento)"/>',
    "calendario": '<rect x="34" y="46" width="132" height="120" rx="16" fill="none" stroke="currentColor" stroke-width="10"/>'
                  '<path d="M34 84h132M70 30v30M130 30v30" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>'
                  '<path d="M76 126l16 16 32-36" fill="none" stroke="var(--acento)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>',
    "maletin": '<rect x="30" y="66" width="140" height="98" rx="16" fill="none" stroke="currentColor" stroke-width="10"/>'
               '<path d="M76 66V50a10 10 0 0 1 10-10h28a10 10 0 0 1 10 10v16M30 104h140" stroke="currentColor" stroke-width="10" fill="none"/>'
               '<rect x="86" y="94" width="28" height="22" rx="5" fill="var(--acento)"/>',
    "globo": '<path d="M40 44h120a14 14 0 0 1 14 14v62a14 14 0 0 1-14 14H92l-34 28v-28H40a14 14 0 0 1-14-14V58a14 14 0 0 1 14-14z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/>'
             '<path d="M100 62l9 18 20 3-14 14 3 20-18-9-18 9 3-20-14-14 20-3z" fill="var(--acento)"/>',
    "compu": '<rect x="44" y="50" width="112" height="76" rx="10" fill="none" stroke="currentColor" stroke-width="10"/>'
             '<path d="M26 150h148" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>'
             '<path d="M100 68l7 14 14 7-14 7-7 14-7-14-14-7 14-7z" fill="var(--acento)"/>',
}

# Las cinco destacadas, en el orden en que aparecen en el perfil (el menú de la "landing"):
# quién soy, servicios, testimonios, preguntas y cómo agendar. Nombres de 12 caracteres o
# menos: más largos, Instagram los corta en el teléfono (soycontador-ai/docs/instagram/).
DESTACADAS = [
    {
        "id": "quien", "nombre": "Quién soy", "icono": "billete", "tono": "maiz",
        "historias": [
            {"tipo": "foto", "foto": "israel-cruzado.webp", "clase": "texto-largo",
             "kicker": "Hola", "titulo": 'Soy <span class="rem">Israel Castro.</span>',
             "texto": "Contador público. Creo contenido para explicarte, como en una consulta, temas del SAT, de contabilidad y de todo lo que afecta tu bolsillo."},
            {"tipo": "fichas", "kicker": "Qué hay aquí", "titulo": "Lo que te preguntas, resuelto.",
             "fichas": [("SAT", "maiz", "RFC, e.firma, constancia, buzón y cartas"),
                        ("Tu declaración", "rosa", "Obligación, deducciones y saldos a favor"),
                        ("Tus números", "cacao", "Ingresos extra, finanzas sanas y estados financieros")]},
            {"tipo": "enlace", "kicker": "Cada semana", "titulo": 'Un video nuevo en <span class="rem">Cuentas Claras.</span>',
             "texto": "Una duda, una serie. Búscanos en YouTube.", "enlace": True},
        ],
    },
    {
        "id": "servicios", "nombre": "Servicios", "icono": "maletin", "tono": "cacao",
        "historias": [
            {"tipo": "texto", "kicker": "Servicios",
             "titulo": 'Aprende con nosotros, o <span class="rem">déjalo en nuestras manos.</span>',
             "texto": "Con S & I Castro Consultores, el despacho familiar. 100% en línea en todo México."},
            {"tipo": "lista-enlace", "kicker": "Lo que hacemos", "titulo": "Lo del SAT, de principio a fin.",
             "items": [("Consulta 1:1", ""), ("Tu declaración anual", ""), ("Tu contabilidad cada mes", ""),
                       ("Trámites: RFC, e.firma, 32-D", ""), ("Ponerte al corriente", "")],
             "enlace": True},
            {"tipo": "lista-enlace", "clase": "compacta", "kicker": "¿Eres contador?", "titulo": 'Enseño IA <span class="rem">a contadores.</span>',
             "items": [("Jueves de ContadorIA", "Clase en vivo y gratis cada jueves"),
                       ("Talleres en vivo", "Usa y construye con IA sin ser programador"),
                       ("Capacitación para despachos", "Con tu equipo y tu operación"),
                       ("Ebook IA para Contadores", "")],
             "texto": "Todo en soycontador.ai.", "enlace": True},
            {"tipo": "enlace", "kicker": "Para tu despacho", "titulo": 'Tus CFDI del SAT, <span class="res">sin entrar al portal.</span>',
             "texto": "Eso hace TodoConta, la app que usamos en el despacho.", "enlace": True},
        ],
    },
    {
        "id": "testimonios", "nombre": "Testimonios", "icono": "globo", "tono": "maiz",
        "historias": [
            # Plantilla: se llena con un cliente real y su permiso. No se exporta mientras diga [ ].
            {"tipo": "testimonio", "plantilla": True, "kicker": "Testimonios",
             "cita": "[Lo que dijo el cliente, en sus palabras: una o dos frases]",
             "quien": "[Nombre], [ciudad o a qué se dedica]", "caso": "[Qué le resolvimos, en una línea]"},
        ],
    },
    {
        "id": "preguntas", "nombre": "Preguntas", "icono": "pregunta", "tono": "cacao",
        "historias": [
            {"tipo": "pregunta", "n": 1, "titulo": "¿Por qué pagamos impuestos?",
             "texto": "Porque así se paga lo que es de todos. Y quien gana más, paga más: por eso el ISR sube por escalones."},
            {"tipo": "pregunta", "n": 2, "titulo": "¿Por qué me retienen?",
             "texto": "Retener es cobrar por adelantado a nombre del SAT. No es un impuesto extra: en tu declaración se resta."},
            {"tipo": "pregunta", "n": 3, "titulo": "¿Por qué no lo puedo pagar en efectivo?",
             "texto": "Si lo quieres deducir, págalo con tarjeta o transferencia. En efectivo, la factura no te sirve."},
            {"tipo": "pregunta", "n": 4, "titulo": "¿Qué pasa si no presento?",
             "texto": "Multa, recargos y tu opinión del SAT en negativo. Si te pones al corriente antes de que te busquen, por lo general no hay multa."},
            {"tipo": "pregunta", "n": 5, "titulo": "¿Por qué a mi compañero sí le devuelven?",
             "texto": "Casi nunca es trampa. Pidió factura y la pagó con tarjeta. La diferencia es saber qué guardar."},
            {"tipo": "hoja", "kicker": "Gratis", "titulo": 'Las respuestas, <span class="res">en una guía.</span>',
             "texto": "Con el calendario y el checklist."},
            {"tipo": "foto-enlace", "foto": "israel-senala-abajo.webp", "clase": "grande", "kicker": "Pídela",
             "titulo": 'Tu nombre, tu correo <span class="rem">y listo.</span>',
             "texto": "Te llega en un minuto.", "enlace": True},
        ],
    },
    {
        "id": "agenda", "nombre": "Agenda", "icono": "calendario", "tono": "maiz",
        "historias": [
            {"tipo": "foto", "foto": "israel-duda.webp", "kicker": "Consulta 1:1",
             "titulo": '¿Tu caso no es <span class="rem">tan sencillo?</span>',
             "texto": "Lo revisamos juntos, con tus números. La consulta tiene costo."},
            {"tipo": "pasos", "kicker": "Cómo se agenda", "titulo": "Tres pasos.",
             "pasos": ["Toca el enlace", "Escoges tu hora y pagas en línea", "Te llega la invitación"], "enlace": True},
            {"tipo": "enlace", "kicker": "¿Transferencia?", "titulo": 'Escríbeme por <span class="rem">WhatsApp.</span>',
             "texto": "Al 55 4475 3602. Ahí te paso los datos y apartamos tu cita.", "enlace": True},
        ],
    },
]


def pie(i: int = 1) -> str:
    """El handle solo en la primera historia de cada destacada; de ahí en adelante, el billete y
    #CuentasClaras al centro (Israel, 2026-10-27)."""
    if i == 1:
        return (f'<div class="pie-h"><svg viewBox="0 0 200 200"><use href="#simbolo"/></svg>'
                f'<span>{HANDLE}</span></div>')
    return ('<div class="pie-h tag"><svg viewBox="0 0 200 200"><use href="#simbolo"/></svg>'
            '<span>#CuentasClaras</span></div>')


def cabeza(kicker: str, extra: str = "") -> str:
    return f'<span class="kick">{escape(kicker)}{extra}</span>'


def zona_enlace() -> str:
    """"Toca aquí" y el hueco donde Israel pone el sticker de enlace de Instagram (la caja azul
    es guía del tablero, no se exporta). Sin enlace dibujado: el de verdad es el sticker."""
    return ('<div class="enlace"><span class="rot">Toca aquí</span>'
            '<div class="hueco"><div class="guia caja-sticker">Aquí va el sticker de enlace</div></div></div>')


def historia(h: dict, d: dict, i: int, total: int) -> str:
    t = h["tipo"]
    num = f' <b>{i}/{total}</b>' if total > 1 else ''
    if t == "pregunta":
        return (f'<div class="h libreta preg">{cabeza("Preguntas", f" <b>{h["n"]}/5</b>")}'
                f'<span class="numerote rot">{h["n"]}</span>'
                f'<h3 class="disp tit">{escape(h["titulo"])}</h3><p class="txt">{escape(h["texto"])}</p>'
                f'<p class="remite">La respuesta completa, en <span class="res">la guía gratis.</span></p>{pie(i)}</div>')
    if t == "testimonio":
        return (f'<div class="h libreta testi">{cabeza(h["kicker"])}<span class="comillas rot">“</span>'
                f'<p class="cita">{escape(h["cita"])}</p><p class="quien">{escape(h["quien"])}</p>'
                f'<p class="caso">{escape(h["caso"])}</p>{pie(i)}</div>')
    cuerpo = ""
    if t in ("foto", "foto-enlace"):
        cuerpo = (f'<img class="recorte foto" src="../landing/img/{h["foto"]}" alt="">'
                  f'<div class="sobre">{cabeza(h["kicker"])}<h3 class="disp tit">{h["titulo"]}</h3>'
                  f'<p class="txt">{escape(h["texto"])}</p></div>')
        if t == "foto-enlace":
            cuerpo += zona_enlace()
        return f'<div class="h libreta con-foto {h.get("clase", "")}">{cuerpo}{pie(i)}</div>'
    cuerpo = f'{cabeza(h["kicker"])}<h3 class="disp tit">{h["titulo"]}</h3>'
    if t == "fichas":
        cuerpo += '<div class="fichas">' + "".join(
            f'<div class="ficha" style="--c: var(--{c})"><span class="pestana{" osc" if c != "maiz" else ""}">{escape(n)}</span>{escape(x)}</div>'
            for n, c, x in h["fichas"]) + '</div>'
    if t == "hoja":
        meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        clave = {"Feb", "Abr", "Nov", "Dic"}
        cuerpo += ('<div class="hojita"><div class="hojita-cab"><span class="rot">La guía</span></div><ol>' +
                   "".join(f'<li{" class=\"k\"" if m in clave else ""}><i></i>{m}</li>' for m in meses) + '</ol></div>')
        cuerpo += f'<p class="txt">{escape(h["texto"])}</p>'
    if t in ("lista", "lista-enlace"):
        cuerpo += '<ol class="lista">' + "".join(
            f'<li><span class="bola">{k + 1}</span><div><b>{escape(a)}</b>{f"<span>{escape(b)}</span>" if b else ""}</div></li>'
            for k, (a, b) in enumerate(h["items"])) + '</ol>'
    if t == "pasos":
        cuerpo += '<ol class="pasos">' + "".join(
            f'<li><span class="paso{" actual" if k == 0 else ""}"><span>{k + 1}</span></span>{escape(p)}</li>'
            for k, p in enumerate(h["pasos"])) + '</ol>'
    if t in ("texto", "enlace", "lista-enlace") and h.get("texto"):
        cuerpo += f'<p class="txt">{escape(h["texto"])}</p>'
    if h.get("enlace"):
        cuerpo += zona_enlace()
    # El tipo va con prefijo: sin él, la clase del contenedor ("enlace", "fichas", "pasos") chocaba con
    # la del bloque interno del mismo nombre y la historia dejaba de medir 1920 (2026-10-26)
    return f'<div class="h libreta tipo-{t} {h.get("clase", "")}">{cuerpo}{pie(i)}</div>'


# Las portadas van todas de un solo tono: Instagram reacomoda los destacados cada vez que se
# edita uno, así que una alternancia no se sostiene. Se probó maíz contra cacao y quedó maíz
# (Israel, 2026-10-26). Para volver a comparar, se agrega ("cacao", "Cacao") aquí.
TONOS_PORTADA = [("maiz", "Maíz")]


def portada(d: dict, tono: str) -> str:
    osc = tono == "cacao"
    return (f'<div class="portada libreta"><div class="circulo {"osc" if osc else ""}">'
            f'<svg viewBox="0 0 200 200" class="ico">{ICONOS[d["icono"]]}</svg></div></div>')


# Foto de perfil: el recorte sobre la libreta con la sombra dura desplazada ("sombra plumón",
# la misma idea que la de soycontador.ai en verde), aquí en maíz o en rosa.
FOTOS_PERFIL = [("maiz", "Maíz"), ("rosa", "Rosa")]


def foto_perfil(color: str) -> str:
    return (f'<div class="fperfil libreta"><img class="recorte-p" style="--sombra: var(--{color})" '
            f'src="../landing/img/israel-cruzado.webp" alt=""></div>')


def main() -> None:
    plantillas, secciones, perfil = [], [], []
    marcos_foto = []
    for color, nombre in FOTOS_PERFIL:
        fid = f't-perfil-{color}'
        plantillas.append(f'<template id="{fid}">{foto_perfil(color)}</template>')
        plantillas.append(f'<template id="{fid}-chica">{foto_perfil(color)}</template>')
        marcos_foto.append(f'<div class="pieza"><div class="frame redondo" style="--w:1080;--h:1080;--s:.36" data-tpl="{fid}"></div>'
                           f'<div class="fila" style="gap:14px;align-items:center"><div class="frame redondo" style="--w:1080;--h:1080;--s:.05" data-tpl="{fid}-chica"></div>'
                           f'<p class="nota">{nombre}. Así se ve junto a un comentario (54 px).</p></div></div>')
    secciones.append(f'<section><h2>Foto de perfil</h2><div class="fila">{"".join(marcos_foto)}</div></section>')
    for d in DESTACADAS:
        marcos = []
        for tono, nombre_tono in TONOS_PORTADA:
            pid = f't-{d["id"]}-portada-{tono}'
            plantillas.append(f'<template id="{pid}">{portada(d, tono)}</template>')
            plantillas.append(f'<template id="{pid}-perfil">{portada(d, tono)}</template>')
            perfil.append(f'<div class="dest"><div class="frame redondo" style="--w:1080;--h:1080;--s:.11" data-tpl="{pid}-perfil"></div><span>{escape(d["nombre"])}</span></div>')
            marcos.append(f'<div class="pieza"><div class="frame" style="--w:1080;--h:1920;--s:.24" data-tpl="{pid}"></div><p class="nota">Portada {nombre_tono} (se recorta al círculo del centro)</p></div>')
        total = len(d["historias"])
        for i, h in enumerate(d["historias"], 1):
            hid = f't-{d["id"]}-{i:02d}'
            plantillas.append(f'<template id="{hid}">{historia(h, d, i, total)}</template>')
            marcos.append(f'<div class="pieza"><div class="frame" style="--w:1080;--h:1920;--s:.24" data-tpl="{hid}">'
                          f'<div class="zona arriba"></div><div class="zona abajo"></div></div><p class="nota">{i} de {total}</p></div>')
        secciones.append(f'<section><h2>{escape(d["nombre"])}</h2><div class="fila">{"".join(marcos)}</div></section>')
    ids = [f't-perfil-{c}' for c, _ in FOTOS_PERFIL] + [f't-{d["id"]}-portada-{t}' for t, _ in TONOS_PORTADA for d in DESTACADAS] + [
        f't-{d["id"]}-{i:02d}' for d in DESTACADAS for i, h in enumerate(d["historias"], 1) if not h.get("plantilla")]
    html = PLANTILLA.replace("{{PLANTILLAS}}", "\n".join(plantillas)).replace("{{SECCIONES}}", "\n".join(secciones)) \
        .replace("{{PERFIL}}", "".join(perfil)).replace("{{HANDLE}}", HANDLE)
    SALIDA.write_text(html, encoding="utf-8")
    (RAIZ / "historias" / "ids.txt").write_text("\n".join(ids) + "\n", encoding="utf-8")
    print(f"{SALIDA.relative_to(RAIZ.parent)}: {len(ids)} piezas")


PLANTILLA = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Historias destacadas · Cuentas Claras</title>
<!-- Generado por design/historias/generar.py: los textos se cambian allá, no aquí. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Shrikhand&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../tokens.css">
<link rel="stylesheet" href="../componentes.css">
<link rel="stylesheet" href="tablero.css">
<style>
  /* Una historia: 1080 × 1920 sobre la libreta. Contenido entre y=250 y y=1580. */
  .h, .portada { position: absolute; inset: 0; color: var(--cacao); font-family: var(--font-display); }
  .h { padding: 280px 90px 380px; display: flex; flex-direction: column; align-items: flex-start; }
  .kick { display: inline-flex; gap: 14px; align-items: center; margin-left: -90px; padding: 16px 34px 16px 90px; border-radius: 0 999px 999px 0; background: var(--maiz); font-weight: 800; font-size: 38px; letter-spacing: .08em; text-transform: uppercase; }
  .kick b { color: var(--rosa-hondo); }
  .tit { margin: 50px 0 0; font-size: 110px; max-width: 9.5ch; text-wrap: balance; }
  .tit .rem { font-family: var(--font-rotulo); font-weight: 400; color: var(--rosa); font-size: .82em; letter-spacing: 0; line-height: 1.05; display: inline-block; }
  .res { background: linear-gradient(transparent 55%, var(--maiz) 55%, var(--maiz) 92%, transparent 92%); padding: 0 .06em; }
  .txt { margin: 40px 0 0; font-size: 46px; line-height: 1.3; font-weight: 600; color: rgba(59, 36, 24, .78); max-width: 20ch; }
  .pie-h { margin-top: auto; padding-top: 30px; display: flex; align-items: center; gap: 16px; font-weight: 800; font-size: 36px; }
  .pie-h svg { width: 70px; height: 70px; }

  /* Con foto: Israel abajo a la derecha, el texto encima a la izquierda */
  .con-foto .foto { position: absolute; right: -210px; bottom: 0; height: 1360px; width: auto; max-width: none; }
  .con-foto .sobre { position: relative; z-index: 2; }
  .con-foto .tit { max-width: 7.5ch; }
  .con-foto .txt { max-width: 12ch; }
  .con-foto .pie-h { position: relative; z-index: 4; margin-left: -14px; padding: 10px 26px 10px 14px; border-radius: 999px; background: var(--crema); }
  .con-foto .pie-h { margin-top: auto; } .con-foto .enlace + .pie-h { margin-top: 20px; }

  /* Enlace: la flecha rotulada y el lugar del sticker */
  .enlace { position: relative; align-self: stretch; margin-top: auto; display: grid; justify-items: center; gap: 18px; z-index: 3; padding-bottom: 30px; }
  .enlace + .pie-h { margin-top: 20px; }
  .enlace .rot { font-size: 64px; color: var(--rosa); transform: rotate(-4deg); }
  .enlace .rot::after { content: " ↓"; font-family: var(--font-display); font-weight: 800; }
  .hueco { position: relative; width: 520px; height: 110px; }
  .caja-sticker { position: absolute; inset: -10px; border: 6px dashed rgba(0,170,255,.9); border-radius: 30px; display: grid; place-items: center; font: 600 26px/1 system-ui; color: rgba(0,120,200,1); }
  .pie-h.tag { align-self: center; gap: 14px; font-size: 38px; letter-spacing: .01em; }
  .pie-h.tag span { color: var(--cacao); }
  .con-foto .enlace { justify-items: start; }
  /* Quién soy 1/3: el texto es largo (2026-10-27), así que la foto baja y se recorre para que el
     texto no se encime en el hombro */
  .con-foto.texto-largo .foto { height: 1180px; right: -260px; }
  .con-foto.texto-largo .txt { font-size: 40px; max-width: 14ch; }
  /* 7/7 de Preguntas: más grande, y el borde izquierdo del recorte (la manga viene cortada en la
     foto) se desvanece para que no se lea como brazo mocho */
  .con-foto.grande .foto { height: 1580px; right: -330px; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 14%); mask-image: linear-gradient(90deg, transparent 0, #000 14%); }
  .con-foto.grande .pie-h.tag { position: absolute; top: 290px; left: 50%; transform: translateX(-36%); margin: 0; }
  .con-foto.grande .enlace { margin-top: auto; padding-bottom: 0; }
  .compacta .tit { font-size: 96px; max-width: 12ch; margin-top: 40px; }
  .compacta .lista { margin-top: 36px; gap: 14px; }
  .compacta .lista li { font-size: 40px; }
  .compacta .lista span:not(.bola) { font-size: 34px; margin-top: 4px; }
  .compacta .txt { margin-top: 26px; }

  /* Fichas, lista, pasos, hojita */
  .fichas { display: grid; gap: 50px; margin-top: 76px; width: 100%; }
  .ficha { position: relative; padding: 30px 36px; background: #FFFBF3; border: 5px solid var(--cacao); border-radius: 12px 40px 40px 40px; box-shadow: 12px 12px 0 var(--cacao); font-size: 44px; font-weight: 700; line-height: 1.2; }
  .pestana { position: absolute; top: -5px; left: -5px; transform: translateY(-100%); padding: 10px 26px; border: 5px solid var(--cacao); border-bottom: 0; border-radius: 20px 20px 0 0; background: var(--c); font-size: 32px; font-weight: 800; }
  .pestana.osc { color: var(--crema); }
  .lista { list-style: none; margin: 56px 0 0; padding: 0; display: grid; gap: 30px; }
  .lista li { display: grid; grid-template-columns: 92px 1fr; gap: 28px; align-items: start; font-size: 46px; line-height: 1.2; }
  .lista b { display: block; font-weight: 800; }
  .lista span:not(.bola) { display: block; margin-top: 8px; font-size: 38px; font-weight: 600; color: rgba(59, 36, 24, .72); }
  .bola { display: grid; place-items: center; width: 92px; height: 92px; border-radius: 50%; background: var(--maiz); font-weight: 800; font-size: 44px; }
  .pasos { list-style: none; margin: 80px 0 0; padding: 0; display: grid; gap: 46px; }
  .pasos li { display: flex; align-items: center; gap: 34px; font-size: 54px; font-weight: 800; line-height: 1.1; }
  .pasos .paso { font-size: 120px; background: var(--cacao); color: var(--crema); }
  .pasos .paso.actual { background: var(--rosa); }
  .hojita { margin-top: 50px; width: 100%; padding: 40px 44px 30px; background: #FFFBF3; border-radius: 10px; transform: rotate(-3deg); box-shadow: 0 30px 60px -24px rgba(59,36,24,.5); }
  .hojita-cab { border-bottom: 5px solid var(--cacao); padding-bottom: 14px; }
  .hojita-cab .rot { font-size: 64px; color: var(--rosa); }
  .hojita ol { list-style: none; margin: 18px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 30px; }
  .hojita li { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 3px dashed rgba(59,36,24,.15); font-weight: 800; font-size: 38px; }
  .hojita li i { width: 30px; height: 30px; border: 4px solid var(--cacao); border-radius: 7px; }
  .hojita li.k { color: var(--rosa-hondo); }
  .hojita li.k i { background: var(--maiz); }

  /* Pregunta: el número gigante detrás */
  .preg .numerote { position: absolute; right: 40px; top: 230px; font-size: 520px; color: var(--maiz); opacity: .9; z-index: 0; }
  .preg .kick, .preg .tit, .preg .txt, .preg .remite { position: relative; z-index: 1; }
  .preg .tit { font-size: 112px; max-width: 8.5ch; margin-top: 100px; }
  .preg .txt { max-width: 19ch; }
  .remite { margin: 44px 0 0; font-size: 40px; font-weight: 700; }

  /* Portada de destacada: el círculo del centro es lo que se ve en el perfil */
  .portada .circulo { position: absolute; left: 50%; top: 50%; width: 760px; height: 760px; margin: -380px 0 0 -380px; border-radius: 50%; background: var(--maiz); display: grid; place-items: center; color: var(--cacao); --acento: var(--rosa); box-shadow: inset 0 0 0 14px var(--cacao); }
  .portada .circulo.osc { background: var(--cacao); color: var(--crema); --acento: var(--maiz); box-shadow: none; }
  .portada .ico { width: 470px; height: 470px; overflow: visible; }
  .portada .circulo.osc .ico use { filter: none; }
  .frame.redondo .portada .circulo { box-shadow: none; }

  .tipo-lista-enlace .lista { gap: 18px; margin-top: 44px; }
  .tipo-lista-enlace .lista li { font-size: 42px; }
  .tipo-lista-enlace .bola { width: 76px; height: 76px; font-size: 38px; }

  /* Testimonio */
  .testi .comillas { margin-top: 40px; font-size: 300px; line-height: .8; color: var(--rosa); height: 170px; }
  .testi .cita { margin: 0; font-weight: 800; font-size: 72px; line-height: 1.15; font-variation-settings: "wdth" 92; max-width: 15ch; }
  .testi .quien { margin: 50px 0 0; font-weight: 800; font-size: 44px; }
  .testi .caso { margin: 12px 0 0; padding: 14px 26px; border-radius: 999px; background: var(--maiz); font-weight: 700; font-size: 38px; }

  /* Foto de perfil (1080 × 1080, se ve en círculo) */
  .fperfil { position: absolute; inset: 0; }
  .recorte-p { position: absolute; left: 50%; top: 70px; width: 1010px; max-width: none; height: auto; transform: translateX(-52%); filter: drop-shadow(26px 26px 0 var(--sombra)); }

  /* Guías del tablero (no se exportan) */
  .zona { position: absolute; left: 0; right: 0; z-index: 40; background: rgba(0,0,0,.12); outline: 3px dashed rgba(0,0,0,.25); pointer-events: none; }
  .zona.arriba { top: 0; height: 250px; } .zona.abajo { bottom: 0; height: 340px; }
  .solo .zona { display: none; }
  .perfil { display: flex; gap: 22px; flex-wrap: wrap; background: #fff; padding: 22px 26px; border-radius: 22px; width: max-content; box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 10px 28px rgba(0,0,0,.08); }
  .dest { display: grid; justify-items: center; gap: 8px; font: 500 12px system-ui; color: #222; }
  .dest .frame { box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #DBDBDB; }
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="simbolo" viewBox="0 0 200 200">
    <rect x="14" y="50" width="172" height="100" rx="14" style="fill:var(--crema);stroke:var(--cacao);stroke-width:11"/>
    <rect x="32" y="66" width="136" height="68" rx="6" style="fill:none;stroke:var(--cacao);stroke-width:4"/>
    <circle cx="100" cy="100" r="27" style="fill:var(--rosa)"/>
    <path d="M86 101l10 10 19-21" style="fill:none;stroke:var(--crema);stroke-width:9;stroke-linecap:round;stroke-linejoin:round"/>
    <circle cx="48" cy="100" r="6" style="fill:var(--cacao)"/><circle cx="152" cy="100" r="6" style="fill:var(--cacao)"/>
  </symbol>
</svg>

{{PLANTILLAS}}

<main class="tablero">
  <header class="cab">
    <div>
      <div class="letra">Cuentas Claras · Instagram</div>
      <h1>Historias destacadas de {{HANDLE}}</h1>
    </div>
    <p>Cinco destacadas, como el menú de una landing: quién soy, servicios, testimonios, preguntas y cómo agendar. Las franjas grises son lo que tapa Instagram; las cajas azules, dónde se pone el sticker de enlace en la app. El testimonio es plantilla: se llena con un cliente real y su permiso, y no se exporta mientras tenga corchetes.</p>
  </header>

  <section>
    <h2>Así se ven en el perfil</h2>
    <div class="perfil">{{PERFIL}}</div>
  </section>

  {{SECCIONES}}
</main>
<script src="tablero.js"></script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
