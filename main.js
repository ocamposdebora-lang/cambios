document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     COTIZACIÓN DEL DÍA
  =============================== */

  document.getElementById("fecha").innerText = FECHA_COTIZACION;

// Hora de actualización
const ahora = new Date();
const horaFormateada = ahora.toLocaleTimeString("es-PY", {
  hour: "2-digit",
  minute: "2-digit"
});
document.getElementById("hora").innerText = `${horaFormateada} hs`;

  document.getElementById("compra").innerText =
    `${COMPRA_BRL_PYG.toLocaleString()} PYG`;

  document.getElementById("venta").innerText =
    `${VENTA_BRL_PYG.toLocaleString()} PYG`;


  /* ===============================
     OPCIONES Y PLACEHOLDER
  =============================== */

  function actualizarOpciones() {
    const tipo = document.getElementById("tipo").value;
    const montoInput = document.getElementById("monto");
    const zonaContainer = document.getElementById("zona-container");

    // Limpiar resultados al cambiar tipo
    document.getElementById("resultado").innerText = "";
    document.getElementById("detalle").innerHTML = "";

    if (tipo === "COMPRA") {
      // Comprar Guaraníes → cliente ingresa PYG
      montoInput.placeholder = "Ingrese monto en Guaraníes (PYG)";
      zonaContainer.style.display = "block";
    } else {
      // Comprar Reales (PIX) → cliente ingresa BRL
      montoInput.placeholder = "Ingrese monto en Reales (BRL)";
      zonaContainer.style.display = "none";
    }
  }

  actualizarOpciones();


  /* ===============================
     TASAS DE ENTREGA
  =============================== */

  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0; // Banca Web
  }


  /* ===============================
     CONVERSIÓN
  =============================== */

  window.convertir = function () {
    const monto = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;
    const detalle = document.getElementById("detalle");
    const resultadoEl = document.getElementById("resultado");

    if (isNaN(monto) || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    /* ===========================
       CASO 1: COMPRAR GUARANÍES
       Cliente ingresa PYG
       Recibe BRL
       BRL = (PYG / COMPRA) + TASA
    =========================== */

    if (tipo === "COMPRA") {
      const zona = document.getElementById("zona").value;
      const tasa = obtenerTasa(zona);

      const brlBruto = monto / COMPRA_BRL_PYG;
      const brlNeto = brlBruto + tasa;

      resultadoEl.innerText =
        `${brlNeto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL`;

      detalle.innerHTML = `
        Operación: Comprar Guaraníes<br>
        Monto: ${monto.toLocaleString("es-PY")} PYG<br>
        Cotización (Compra): 1 BRL = ${COMPRA_BRL_PYG.toLocaleString()} PYG<br>
        BRL bruto: ${brlBruto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL<br>
        Tasa entrega: +${tasa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL<br>
        BRL neto: ${brlNeto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL
      `;
      return;
    }

    /* ===========================
       CASO 2: COMPRAR REALES (PIX)
       Cliente ingresa BRL
       Recibe PYG
       PYG = BRL * VENTA
       TASA = 0
    =========================== */

    const pyg = monto * VENTA_BRL_PYG;

    resultadoEl.innerText =
      `${pyg.toLocaleString("es-PY")} PYG`;

    detalle.innerHTML = `
      Operación: Comprar Reales (PIX)<br>
      Monto: ${monto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRL<br>
      Cotización (Venta): 1 BRL = ${VENTA_BRL_PYG.toLocaleString()} PYG<br>
      Tasa: 0<br>
      Total: ${pyg.toLocaleString("es-PY")} PYG
    `;
  };

});
