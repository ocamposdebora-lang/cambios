document.addEventListener("DOMContentLoaded", () => {
  // Mostrar cotización y fecha
  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  document.getElementById("compra").innerText = `${COMPRA_BRL_PYG} PYG`;
  document.getElementById("venta").innerText = `${VENTA_BRL_PYG} PYG`;

  function actualizarOpciones() {
  const tipo = document.getElementById("tipo").value;
  const montoInput = document.getElementById("monto");
  const zonaContainer = document.getElementById("zona-container");

  if (tipo === "COMPRA") {
    // Comprar Guaraníes → el cliente ingresa PYG
    montoInput.placeholder = "Ingrese monto en Guaraníes (PYG)";
    zonaContainer.style.display = "block";
  } else {
    // Comprar PIX → el cliente ingresa BRL
    montoInput.placeholder = "Ingrese monto en Reales (BRL)";
    zonaContainer.style.display = "none";
  }
}

  actualizarOpciones();

  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0; // BANCA
  }

  window.convertir = function () {
    const monto = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;
    const detalle = document.getElementById("detalle");
    const resultadoEl = document.getElementById("resultado");

    if (isNaN(monto) || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    // ✅ Caso 1: Comprar Guaraníes (cliente ingresa PYG, recibe BRL)
    // Fórmula: BRL = PYG / COMPRA_BRL_PYG
    // Si hay tasa de entrega (en BRL), se descuenta del BRL resultante
    if (tipo === "COMPRA") {
      const zona = document.getElementById("zona").value;
      const tasa = obtenerTasa(zona);

      const brlBruto = monto / COMPRA_BRL_PYG;   // BRL antes de tasa
      const brlNeto = brlBruto - tasa;           // BRL final después de tasa

      if (brlNeto <= 0) {
        alert("El monto no cubre la tasa de entrega");
        return;
      }

      resultadoEl.innerText = `${brlNeto.toFixed(2)} BRL`;

      detalle.innerHTML = `
        Operación: Comprar Guaraníes<br>
        Monto: ${monto.toLocaleString()} PYG<br>
        Cotización (Compra): 1 BRL = ${COMPRA_BRL_PYG} PYG<br>
        BRL bruto: ${brlBruto.toFixed(2)} BRL<br>
        Tasa entrega: -${tasa.toFixed(2)} BRL<br>
        BRL neto: ${brlNeto.toFixed(2)} BRL
      `;
      return;
    }

    // ✅ Caso 2: Comprar Reales (PIX) (cliente ingresa BRL, recibe PYG)
    // Fórmula: PYG = BRL * VENTA_BRL_PYG
    // Tasa: 0
    const pyg = monto * VENTA_BRL_PYG;

    resultadoEl.innerText = `${pyg.toLocaleString()} PYG`;

    detalle.innerHTML = `
      Operación: Comprar Reales (PIX)<br>
      Monto: ${monto.toFixed(2)} BRL<br>
      Cotización (Venta): 1 BRL = ${VENTA_BRL_PYG} PYG<br>
      Tasa: 0<br>
      Total: ${pyg.toLocaleString()} PYG
    `;
  };
});
