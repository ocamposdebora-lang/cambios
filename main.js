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
});

function actualizarOpciones() {
  const tipo = document.getElementById("tipo").value;
  const monto = document.getElementById("monto");
  const zona = document.getElementById("zona-container");

  monto.value = "";

  if (tipo === "VENTA") {
    monto.placeholder = "Ingrese monto en Reales (BRL)";
    zona.style.display = "none";
  } else {
    monto.placeholder = "Ingrese monto en Guaraníes (PYG)";
    zona.style.display = "block";
  }
}

function formatearMonto() {
  const tipo = document.getElementById("tipo").value;
  let valor = this.value.replace(/\D/g, "");

  if (!valor) {
    this.value = "";
    return;
  }

  if (tipo === "VENTA") {
    // BRL con decimales
    valor = (parseInt(valor) / 100).toFixed(2);
    this.value = Number(valor).toLocaleString("es-PY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    // PYG sin decimales
    this.value = Number(valor).toLocaleString("es-PY");
  }
}

function obtenerTasa(zona) {
  if (zona === "CDE") return 10;
  if (zona === "MINGA") return 20;
  if (zona === "FRANCO") return 15;
  return 0;
}

function convertir() {
  const tipo = document.getElementById("tipo").value;
  const detalle = document.getElementById("detalle");
  const resultado = document.getElementById("resultado");

  let monto = document.getElementById("monto").value.replace(/\./g, "").replace(",", ".");
  monto = parseFloat(monto);

  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto válido");
    return;
  }

  if (tipo === "VENTA") {
    // Comprar Reales (PIX)
    const pyg = monto * VENTA_BRL_PYG;

    resultado.innerText = `${pyg.toLocaleString("es-PY")} PYG`;

    detalle.innerHTML = `
      Operación: Comprar Reales (PIX)<br>
      Monto: ${monto.toLocaleString("es-PY", { minimumFractionDigits: 2 })} BRL<br>
      Cotización (Venta): 1 BRL = ${VENTA_BRL_PYG} PYG<br>
      Tasa: 0
    `;
  } else {
    // Comprar Guaraníes
    const zona = document.getElementById("zona").value;
    const tasa = obtenerTasa(zona);

    const brlBruto = monto / COMPRA_BRL_PYG;
    const brlFinal = brlBruto + tasa;

    resultado.innerText = `${brlFinal.toFixed(2)} BRL`;

    detalle.innerHTML = `
      Operación: Comprar Guaraníes<br>
      Monto: ${monto.toLocaleString("es-PY")} PYG<br>
      Cotización (Compra): 1 BRL = ${COMPRA_BRL_PYG} PYG<br>
      BRL base: ${brlBruto.toFixed(2)} BRL<br>
      Tasa entrega: +${tasa.toFixed(2)} BRL<br>
      Total a pagar: ${brlFinal.toFixed(2)} BRL
    `;
  }
}
