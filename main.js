const idioma = navigator.language.startsWith("pt") ? "pt" : "es";

const txt = {
  es: {
    compra: "Compra BRL",
    venta: "Venta BRL",
    fecha: "Cotización:",
    gs: "Comprar Guaraníes",
    pix: "Comprar PIX",
    entrega: "Entrega física",
    transf: "Transferencia bancaria",
    servicios: "Pago de facturas y servicios",
    chave: "PIX por chave",
    qr: "PIX con QR / Link",
    enviar: "Solicitar operación por WhatsApp",
    legal:
      "• Cotización referencial.\n• Operaciones sujetas a disponibilidad.\n• Transferencias y pagos sin costo adicional."
  },
  pt: {
    compra: "Compra BRL",
    venta: "Venda BRL",
    fecha: "Cotação:",
    gs: "Comprar Guaranis",
    pix: "Comprar PIX",
    entrega: "Entrega física",
    transf: "Transferência bancária",
    servicios: "Pagamento de contas e serviços",
    chave: "PIX por chave",
    qr: "PIX com QR / Link",
    enviar: "Solicitar operação pelo WhatsApp",
    legal:
      "• Cotação referencial.\n• Operações sujeitas à disponibilidade.\n• Transferências e pagamentos sem custo."
  }
};

const $ = id => document.getElementById(id);

$("lblCompra").innerText = txt[idioma].compra;
$("lblVenta").innerText = txt[idioma].venta;
$("lblFecha").innerText = txt[idioma].fecha;
$("btnGS").innerText = txt[idioma].gs;
$("btnPIX").innerText = txt[idioma].pix;
$("formaGS").options[0].text = txt[idioma].entrega;
$("formaGS").options[1].text = txt[idioma].transf;
$("formaGS").options[2].text = txt[idioma].servicios;
$("formaPIX").options[0].text = txt[idioma].chave;
$("formaPIX").options[1].text = txt[idioma].qr;
$("btnEnviar").innerText = txt[idioma].enviar;
$("legal").innerText = txt[idioma].legal;

$("compra").innerText = COMPRA_BRL_PYG.toLocaleString("es-PY");
$("venta").innerText = VENTA_BRL_PYG.toLocaleString("es-PY");
$("fecha").innerText = FECHA_COTIZACION;

let operacion = "";

document.querySelectorAll(".opcion").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".opcion").forEach(x => x.classList.remove("activo"));
    b.classList.add("activo");
    operacion = b.dataset.op;
    $("bloqueGS").style.display = operacion === "GS" ? "block" : "none";
    $("bloquePIX").style.display = operacion === "PIX" ? "block" : "none";
    $("monto").value = "";
  };
});

$("monto").addEventListener("input", () => {
  let v = $("monto").value.replace(/\D/g, "");
  if (operacion === "PIX") {
    if (v.length < 3) v = v.padStart(3, "0");
    $("monto").value =
      v.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
      "," +
      v.slice(-2);
  } else {
    $("monto").value = v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
});

$("btnEnviar").onclick = () => {
  if (!operacion || !$("monto").value) return alert("Complete los datos");

  const ahora = new Date();
  $("hora").innerText =
    "(" +
    ahora.toLocaleTimeString(idioma === "pt" ? "pt-BR" : "es-PY", {
      hour: "2-digit",
      minute: "2-digit"
    }) +
    ")";

  let msg = `📩 ${txt[idioma].enviar}\n\n`;

  msg +=
    (operacion === "GS" ? "💱 " + txt[idioma].gs : "💳 " + txt[idioma].pix) +
    "\n";

  msg += `Monto: ${$("monto").value}\n`;

  if (operacion === "GS") {
    msg += `Forma: ${$("formaGS").selectedOptions[0].text}\n`;
    msg += `Zona: ${$("zona").value}\n`;
    if ($("detalleGS").value) msg += `Detalle: ${$("detalleGS").value}\n`;
  }

  if (operacion === "PIX") {
    msg += `Forma: ${$("formaPIX").selectedOptions[0].text}\n`;
    if ($("pixDato").value) msg += `Dato: ${$("pixDato").value}\n`;
  }

  msg += `\n📅 ${FECHA_COTIZACION}`;

  $("whatsappLink").href =
    "https://wa.me/595982898734?text=" +
    encodeURIComponent(msg);

  $("whatsappLink").click();
};
