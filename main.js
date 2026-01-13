document.addEventListener("DOMContentLoaded", () => {

  // Mostrar cotización del día
  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  document.getElementById("compra").innerText =
    `${COMPRA_BRL_PYG} PYG`;

  document.getElementById("venta").innerText =
    `${VENTA_BRL_PYG} PYG`;

  function actualizarOpciones() {
    const tipo = document.getElementById("tipo").value;
    document.getElementById("zona-container").style.display =
      tipo === "COMPRA" ? "block" : "none";
  }

  actualizarOpciones();

  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0;
  }

  window.convertir = function () {
    const monto = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;
    const detalle = document.getElementById("detalle");

    if (isNaN(monto) || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    let resultado;

    if (tipo === "COMPRA") {
      const zona = document.getElementById("zona").value;
      const tasa = obtenerTasa(zona);
      const neto = monto - tasa;

      resultado = neto * VENTA_BRL_PYG;

      document.getElementById("resultado").innerText =
        `${resultado.toLocaleString()} PYG`;

      detalle.innerHTML = `
        Operación: Comprar Guaraníes<br>
        Monto: ${monto.toFixed(2)} BRL<br>
        Tasa entrega: -${tasa.toFixed(2)} BRL<br>
        Neto: ${neto.toFixed(2)} BRL<br>
        Cotización: 1 BRL = ${VENTA_BRL_PYG} PYG
      `;
    } else {
      resultado = monto / COMPRA_BRL_PYG;

      document.getElementById("resultado").innerText =
        `${resultado.toFixed(2)} BRL`;

      detalle.innerHTML = `
