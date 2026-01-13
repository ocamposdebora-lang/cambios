let whatsappURL = ""; // URL final segura para WhatsApp

document.addEventListener("DOMContentLoaded", () => {

  // Mostrar cotización
  document.getElementById("compra").innerText =
    `${COMPRA_BRL_PYG.toLocaleString("es-PY")} PYG`;
  document.getElementById("venta").innerText =
    `${VENTA_BRL_PYG.toLocaleString("es-PY")} PYG`;

  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  const ahora = new Date();
  document.getElementById("hora").innerText =
    ahora.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" }) + " hs";

  actualizarOpciones();
  document.getElementById("monto").addEventListener("input", formatearMonto);

  // Botón WhatsApp: redirección directa (MÓVILES OK)
  const btn = document.getElementById("btnWhatsapp");
  btn.addEventListener("click", (e) => {
    if (!whatsappURL) {
      e.preventDefault();
      alert("Primero realice el cálculo");
      return;
    }
    window.location.href = whatsappURL;
  });
});

// =====================
// UI
// =====================
function actualizarOpciones() {
  const tipo = document.getElementById("tipo").value;
  const monto = document.getElementById("monto");
  const zona = document.getElementById("zona-container");

  monto.value = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("detalle").innerHTML = "";
  whatsappURL = "";

  if (tipo === "VENTA") {
    monto.placeholder = "Ingrese monto en Reales (BRL)";
    zona.style.display = "none";
  } else {
    monto.placeholder = "Ingrese monto en Guaraníes (PYG)";
    zona.style.display = "block";
  }
}

// =====================
// FORMATO MONTO
// =====================
function formatearMonto() {
  const tipo = document.getElementById("tipo").value;
  let v = this.value.replace(/\D/g, "");

  if (!v) {
    this.value = "";
    return;
  }

  if (tipo === "VENTA") {
    const n = parseInt(v, 10) / 100;
    this.value = n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    this.value = Number(v).toLocaleString("es-PY");
  }
}

// =====================
// TASAS
// =====================
function obtenerTasa(zona) {
  if (zona === "CDE") return 10;
  if (zona === "MINGA") return 20;
  if (zona === "FRANCO") return 15;
  return 0;
}

// =====================
// CONVERSIÓN + WHATSAPP
// =====================
function convertir() {
  const tipo = document.getElementById("tipo").value;
  const resultado = document.getElementById("resultado");
  const detalle = document.getElementById("detalle");

  let monto = document.getElementById("monto").value
    .replace(/\./g, "")
    .replace(",", ".");
  monto = parseFloat(monto);

  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto válido");
    return;
  }

  // =========================
  // COMPRAR REALES (PIX)
  // BRL → PYG
  // =========================
  if (tipo === "VENTA") {
    const pyg = monto * VENTA_BRL_PYG;

    resultado.innerText = `${pyg.toLocaleString("es-PY")} PYG`;

    detalle.innerHTML = `
      Operación: Comprar Reales (PIX)<br>
      Monto: ${monto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL<br>
      Cotización: 1 BRL = ${VENTA_BRL_PYG} PYG<br>
      Tasa: 0
    `;

    const msg = `
Hola, consulto para Comprar Reales (PIX)
Monto: ${monto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL
Cotización: 1 BRL = ${VENTA_BRL_PYG} PYG
Total: ${pyg.toLocaleString("es-PY")} PYG
    `;

    whatsappURL =
      "https://wa.me/595982898734?text=" +
      encodeURIComponent(msg.trim());

    return;
  }

  // =========================
  // COMPRAR GUARANÍES
  // PYG → BRL
  // =========================
  const zona = document.getElementById("zona").value;
  const tasa = obtenerTasa(zona);

  const brlBase = monto / COMPRA_BRL_PYG;
  const brlFinal = brlBase + tasa;

  resultado.innerText = `${brlFinal.toFixed(2)} BRL`;

  detalle.innerHTML = `
    Operación: Comprar Guaraníes<br>
    Monto: ${monto.toLocaleString("es-PY")} PYG<br>
    Cotización: 1 BRL = ${COMPRA_BRL_PYG} PYG<br>
    Zona: ${zona}<br>
    Tasa entrega: +${tasa.toFixed(2)} BRL<br>
    Total a pagar: ${brlFinal.toFixed(2)} BRL
  `;

  const msg2 = `
Hola, consulto para Comprar Guaraníes
Monto: ${monto.toLocaleString("es-PY")} PYG
Cotización: 1 BRL = ${COMPRA_BRL_PYG} PYG
Zona: ${zona}
Total a pagar: ${brlFinal.toFixed(2)} BRL
  `;

  whatsappURL =
    "https://wa.me/595982898734?text=" +
    encodeURIComponent(msg2.trim());
}
