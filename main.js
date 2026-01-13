document.addEventListener("DOMContentLoaded", () => {

  const esPT = isPortuguese();

  // ===== Mostrar cotización =====
  document.getElementById("compra").innerText =
    `${COMPRA_BRL_PYG.toLocaleString("es-PY")} PYG`;

  document.getElementById("venta").innerText =
    `${VENTA_BRL_PYG.toLocaleString("es-PY")} PYG`;

  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  const ahora = new Date();
  document.getElementById("hora").innerText =
    ahora.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" }) + " hs";

  // ===== Textos automáticos ES / PT =====
  aplicarIdioma(esPT);

  actualizarOpciones();
  document.getElementById("monto").addEventListener("input", formatearMonto);
});

// ==============================
// IDIOMA
// ==============================
function isPortuguese() {
  const lang = navigator.language.toLowerCase();
  return lang.startsWith("pt");
}

function aplicarIdioma(pt) {
  const textos = pt ? {
    compra: "Compra",
    venta: "Venda",
    valida: "Cotação válida",
    tipo: "Tipo de operação",
    monto: "Valor",
    zona: "Selecione a zona de entrega",
    nota: "Banca Web: transferências bancárias e pagamentos de serviços",
    calcular: "CALCULAR",
    whatsapp: "Consultar no WhatsApp",
    optVenta: "Comprar Reais (PIX)",
    optCompra: "Comprar Guaranies",
    legal: `
      * Cotação referencial. Sujeita a alterações no momento da operação.<br>
      * Operações sujeitas à disponibilidade.<br>
      * Taxas conforme zona de entrega.
    `
  } : {
    compra: "Compra",
    venta: "Venta",
    valida: "Cotización válida",
    tipo: "Tipo de operación",
    monto: "Monto",
    zona: "Seleccione zona de entrega",
    nota: "Banca Web: transferencias bancarias y pagos de servicios",
    calcular: "CALCULAR",
    whatsapp: "Consultar por WhatsApp",
    optVenta: "Comprar Reales (PIX)",
    optCompra: "Comprar Guaraníes",
    legal: `
      * Cotización referencial. Sujeta a cambios al momento de concretar la operación.<br>
      * Operaciones sujetas a disponibilidad.<br>
      * Tasas según zona de entrega.
    `
  };

  setText("tCompra", textos.compra);
  setText("tVenta", textos.venta);
  setText("tValida", textos.valida);
  setText("tTipo", textos.tipo);
  setText("tMonto", textos.monto);
  setText("tZona", textos.zona);
  setText("tNotaBanca", textos.nota);
  setText("tCalcular", textos.calcular);
  setText("tWhatsapp", textos.whatsapp);
  setText("optVenta", textos.optVenta);
  setText("optCompra", textos.optCompra);

  const legal = document.getElementById("tLegal");
  if (legal) legal.innerHTML = `<p>${textos.legal}</p>`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ==============================
// UI / FORM
// ==============================
function actualizarOpciones() {
  const tipo = document.getElementById("tipo").value;
  const monto = document.getElementById("monto");
  const zona = document.getElementById("zona-container");

  monto.value = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("detalle").innerHTML = "";

  if (tipo === "VENTA") {
    monto.placeholder = isPortuguese()
      ? "Informe o valor em Reais (BRL)"
      : "Ingrese monto en Reales (BRL)";
    zona.style.display = "none";
  } else {
    monto.placeholder = isPortuguese()
      ? "Informe o valor em Guaraníes (PYG)"
      : "Ingrese monto en Guaraníes (PYG)";
    zona.style.display = "block";
  }
}

// ==============================
// FORMATO DE MONTO
// ==============================
function formatearMonto() {
  const tipo = document.getElementById("tipo").value;
  let valor = this.value.replace(/\D/g, "");

  if (!valor) {
    this.value = "";
    return;
  }

  if (tipo === "VENTA") {
    // BRL con decimales
    const v = (parseInt(valor) / 100);
    this.value = v.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    // PYG sin decimales
    this.value = Number(valor).toLocaleString("es-PY");
  }
}

// ==============================
// TASAS
// ==============================
function obtenerTasa(zona) {
  if (zona === "CDE") return 10;
  if (zona === "MINGA") return 20;
  if (zona === "FRANCO") return 15;
  return 0;
}

// ==============================
// WHATSAPP
// ==============================
function actualizarWhatsapp(mensaje) {
  const telefono = "595982898734";
  const texto = encodeURIComponent(mensaje.trim());
  document.getElementById("btnWhatsapp").href =
    `https://wa.me/${telefono}?text=${texto}`;
}

// ==============================
// CONVERSIÓN
// ==============================
function convertir() {
  const tipo = document.getElementById("tipo").value;
  const resultado = document.getElementById("resultado");
  const detalle = document.getElementById("detalle");

  let monto = document.getElementById("monto").value
    .replace(/\./g, "")
    .replace(",", ".");
  monto = parseFloat(monto);

  if (isNaN(monto) || monto <= 0) {
    alert(isPortuguese() ? "Informe um valor válido" : "Ingrese un monto válido");
    return;
  }

  // =============================
  // COMPRAR REALES (PIX)
  // =============================
  if (tipo === "VENTA") {
    const pyg = monto * VENTA_BRL_PYG;

    resultado.innerText = `${pyg.toLocaleString("es-PY")} PYG`;

    detalle.innerHTML = `
      ${isPortuguese() ? "Operação" : "Operación"}: ${isPortuguese() ? "Comprar Reais (PIX)" : "Comprar Reales (PIX)"}<br>
      ${isPortuguese() ? "Valor" : "Monto"}: ${monto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL<br>
      ${isPortuguese() ? "Cotação (Venda)" : "Cotización (Venta)"}: 1 BRL = ${VENTA_BRL_PYG} PYG<br>
      ${isPortuguese() ? "Taxa" : "Tasa"}: 0
    `;

    actualizarWhatsapp(
      isPortuguese()
        ? `Olá! Consulto para Comprar Reais (PIX)\nValor: ${monto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL\nTotal: ${pyg.toLocaleString("es-PY")} PYG`
        : `Hola, consulto para Comprar Reales (PIX)\nMonto: ${monto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL\nTotal: ${pyg.toLocaleString("es-PY")} PYG`
    );
    return;
  }

  // =============================
  // COMPRAR GUARANÍES
  // =============================
  const zona = document.getElementById("zona").value;
  const tasa = obtenerTasa(zona);

  const brlBase = monto / COMPRA_BRL_PYG;
  const brlFinal = brlBase + tasa;

  resultado.innerText =
    `${brlFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL`;

  detalle.innerHTML = `
    ${isPortuguese() ? "Operação" : "Operación"}: ${isPortuguese() ? "Comprar Guaranies" : "Comprar Guaraníes"}<br>
    ${isPortuguese() ? "Valor" : "Monto"}: ${monto.toLocaleString("es-PY")} PYG<br>
    ${isPortuguese() ? "Zona" : "Zona"}: ${zona}<br>
    ${isPortuguese() ? "Taxa de entrega" : "Tasa entrega"}: +${tasa.toFixed(2)} BRL<br>
    ${isPortuguese() ? "Total a pagar" : "Total a pagar"}: ${brlFinal.toFixed(2)} BRL
  `;

  actualizarWhatsapp(
    isPortuguese()
      ? `Olá! Consulto para Comprar Guaranies\nValor: ${monto.toLocaleString("es-PY")} PYG\nZona: ${zona}\nTotal a pagar: ${brlFinal.toFixed(2)} BRL`
      : `Hola, consulto para Comprar Guaraníes\nMonto: ${monto.toLocaleString("es-PY")} PYG\nZona: ${zona}\nTotal a pagar: ${brlFinal.toFixed(2)} BRL`
  );
}
