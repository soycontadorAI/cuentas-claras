-- Correo de bienvenida de la lista "Cuentas Claras - La guía" (lista 46, brand 6).
-- Se manda en cuanto la persona confirma. Liga al PDF, no lo adjunta.
-- Antes de correrlo: respaldar las tablas ares y ares_emails.
SET NAMES utf8mb4;
INSERT INTO ares (name, type, list, custom_field) VALUES ('Bienvenida', 1, 46, '');
SET @a = LAST_INSERT_ID();
INSERT INTO ares_emails (ares_id, from_name, from_email, reply_to, title, plain_text, html_text, query_string,
  time_condition, timezone, created, wysiwyg, editor_mode, opens_tracking, links_tracking, enabled, segs, segs_excl)
VALUES (@a, 'Israel Castro · Cuentas Claras', 'israel@sicastro.com', 'israel@sicastro.com', 'Aquí está tu guía', '',
'<html>
<head>
	<title></title>
</head>
<body style="box-sizing: border-box; margin: 0;">
<p>Hola [Name,fallback=],</p>

<p>Aquí está la guía que pediste: qué hacer con el SAT, mes por mes.</p>

<p><a href="https://cc.sicastro.com/descargas/la-guia.pdf" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#3B2418;color:#FFF6E8;font-weight:bold;text-decoration:none;">Descargar la guía</a></p>

<p>Trae tres cosas:</p>

<ul>
	<li>Las cinco preguntas que más me hacen, sin rodeos.</li>
	<li>El calendario de 12 meses, para pegar en el refri.</li>
	<li>El checklist del mes: si tienes X, haz Y.</li>
</ul>

<p>Una sugerencia: ve directo al calendario y busca el mes en el que estamos. Con eso ya sabes qué te toca ahorita.</p>

<p>¿Qué sigue? Cada semana sale un video nuevo en <a href="https://www.youtube.com/@cuentasclaras_mx">Cuentas Claras</a>. Una duda, una serie. Y si algo de la guía te dejó con la duda en tu caso, en la última página te digo cómo agendar una consulta conmigo.</p>

<p>Israel Castro<br />
Contador público · Cuentas Claras</p>

<p><strong>PD.</strong> ¿Hay una duda que te gustaría ver en un video? Contéstame este correo. Leo todos.</p>

<p style="box-sizing: border-box;"></p>

<p style="box-sizing: border-box;"><span style="box-sizing: border-box; font-size: 12px;">Si deseas darte de baja, </span> <unsubscribe style="box-sizing: border-box;"><span style="box-sizing: border-box; font-size: 12px;">clic aquí</span></unsubscribe><span style="box-sizing: border-box; font-size: 12px;">.</span></p>
</body>
</html>',
'', 'immediately', NULL, UNIX_TIMESTAMP(), 1, 'wysiwyg', 1, 1, 1, '', '');
SELECT a.id, a.name, a.list, e.id AS eid, e.title, e.enabled FROM ares a JOIN ares_emails e ON e.ares_id = a.id WHERE a.list = 46;
