document.addEventListener("DOMContentLoaded", () => {

  // Mostrar cotización base
  document.getElementById("compra").innerText = formatoPYG(COMPRA_BRL_PYG);
  document.getElementById("venta").innerText = formatoPYG(VENTA_BRL_PYG);
  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  // Ajustar inputs según operación
  window.actualizarOpciones = function () {
    const tipo = document.getElementById("tipo").value;
    const monto = document.getElementById("monto");
    const zonaContainer = document.getElementById("zona-container");

    monto.value = "";

    if (tipo === "COMPRA") {
      monto.placeholder = "Ingrese monto en Guaraníes (PYG)";
      zonaContainer.style.display = "block";
    } else {
      monto.placeholder = "Ingrese monto en Reales (BRL)";
      zonaContainer.style.display = "none";
    }
  };

  actualizarOpciones();

  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0; // BANCA WEB
  }

  window.convertir = function () {
    const tipo = document.getElementById("tipo").value;
    const zona = document.getElementById("zona").value;
    const montoRaw = document.getElementById("monto").value;
    const resultadoEl = document.getElementById("resultado");
    const detalleEl = document.getElementById("detalle");
    const whatsappLink = document.getElementById("whatsappLink");

    const monto = Number(montoRaw.replace(/\./g, "").replace(",", "."));

    if (!monto || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    // ⏰ Hora real de la consulta
    const ahora = new Date();
    const horaConsulta =
      ahora.getHours().toString().padStart(2, "0") + ":" +
      ahora.getMinutes().toString().padStart(2, "0");

    const horaEl = document.getElementById("hora");
    if (horaEl) {
      horaEl.innerText = `(${horaConsulta} hs)`;
    }

    let mensaje = "";

    // 🟢 Comprar Guaraníes (PYG → BRL)
    if (tipo === "COMPRA") {
      const tasa = obtenerTasa(zona);
      const brlBase = monto / COMPRA_BRL_PYG;
      const brlFinal = brlBase + tasa;

      resultadoEl.innerText = `${formatoBRL(brlFinal)} BRL`;

      detalleEl.innerHTML = `
        Operación: Comprar Guaraníes<br>
        Monto: ${formatoPYG(monto)} PYG<br>
        Cotización (Compra): 1 BRL = ${formatoPYG(COMPRA_BRL_PYG)} PYG<br>
        Tasa entrega: +${formatoBRL(tasa)} BRL<br>
        <b>Total: ${formatoBRL(brlFinal)} BRL</b>
      `;

      mensaje =
        `Consulta – Comprar Guaraníes\n` +
        `Monto: ${formatoPYG(monto)} PYG\n` +
        `Zona: ${zona}\n` +
        `Cotización: ${FECHA_COTIZACION} ${horaConsulta}\n` +
        `Total: ${formatoBRL(brlFinal)} BRL`;
    }

    // 🔵 Comprar PIX (BRL → PYG)
    else {
      const pyg = monto * VENTA_BRL_PYG;

      resultadoEl.innerText = `${formatoPYG(pyg)} PYG`;

      detalleEl.innerHTML = `
        Operación: Comprar Reales (PIX)<br>
        Monto: ${formatoBRL(monto)} BRL<br>
        Cotización (Venta): 1 BRL = ${formatoPYG(VENTA_BRL_PYG)} PYG<br>
        <b>Total: ${formatoPYG(pyg)} PYG</b>
      `;

      mensaje =
        `Consulta – Comprar PIX\n` +
        `Monto: ${formatoBRL(monto)} BRL\n` +
        `Cotización: ${FECHA_COTIZACION} ${horaConsulta}\n` +
        `Total: ${formatoPYG(pyg)} PYG`;
    }

    // 📲 WhatsApp con mensaje
    whatsappLink.href =
      "https://wa.me/595982898734?text=" + encodeURIComponent(mensaje);
  };

});

// 🧮 FORMATOS
function formatoBRL(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatoPYG(valor) {
  return valor.toLocaleString("es-PY");
}
