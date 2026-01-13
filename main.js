document.addEventListener("DOMContentLoaded", () => {

  // ===== MOSTRAR COTIZACIÓN =====
  document.getElementById("compra").innerText = formatoPYG(COMPRA_BRL_PYG);
  document.getElementById("venta").innerText = formatoPYG(VENTA_BRL_PYG);
  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  const inputMonto = document.getElementById("monto");

  // ===== AJUSTES SEGÚN OPERACIÓN =====
  window.actualizarOpciones = function () {
    const tipo = document.getElementById("tipo").value;
    const zonaContainer = document.getElementById("zona-container");

    inputMonto.value = "";

    if (tipo === "COMPRA") {
      inputMonto.placeholder = "Ingrese monto en Guaraníes (PYG)";
      zonaContainer.style.display = "block";
    } else {
      inputMonto.placeholder = "Ingrese monto en Reales (BRL)";
      zonaContainer.style.display = "none";
    }
  };

  actualizarOpciones();

  // ===== PERMITIR ESCRIBIR NORMAL =====
  inputMonto.addEventListener("input", () => {
    inputMonto.value = inputMonto.value.replace(/[^\d.,]/g, "");
  });

  // ===== FORMATEAR SOLO AL SALIR =====
  inputMonto.addEventListener("blur", () => {
    const tipo = document.getElementById("tipo").value;
    const valor = limpiarNumero(inputMonto.value);
    if (!valor) return;

    if (tipo === "COMPRA") {
      inputMonto.value = valor.toLocaleString("es-PY");
    } else {
      inputMonto.value = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  });

  // ===== TASAS =====
  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0;
  }

  // ===== CALCULAR =====
  window.convertir = function () {
    const tipo = document.getElementById("tipo").value;
    const zona = document.getElementById("zona").value;
    const resultadoEl = document.getElementById("resultado");
    const detalleEl = document.getElementById("detalle");
    const whatsappLink = document.getElementById("whatsappLink");

    const monto = limpiarNumero(inputMonto.value);

    if (!monto || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    // ⏰ Hora real de la consulta
    const ahora = new Date();
    const horaConsulta =
      ahora.getHours().toString().padStart(2, "0") + ":" +
      ahora.getMinutes().toString().padStart(2, "0");

    document.getElementById("hora").innerText = `(${horaConsulta} hs)`;

    let mensaje = "";

    // 🟢 COMPRAR GUARANÍES (PYG → BRL)
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
        `Hola, quisiera consultar una cotización.\n` +
        `Monto: ${formatoPYG(monto)} PYG\n` +
        `Zona: ${zona}\n` +
        `Cotización: ${FECHA_COTIZACION} ${horaConsulta}\n` +
        `Total: ${formatoBRL(brlFinal)} BRL`;
    }

    // 🔵 COMPRAR PIX (BRL → PYG)
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
        `Hola, quisiera consultar una cotización.\n` +
        `Monto: ${formatoBRL(monto)} BRL\n` +
        `Cotización: ${FECHA_COTIZACION} ${horaConsulta}\n` +
        `Total: ${formatoPYG(pyg)} PYG`;
    }

    whatsappLink.href =
      "https://wa.me/595982898734?text=" + encodeURIComponent(mensaje);
  };

});

// ===== UTILIDADES =====
function limpiarNumero(valor) {
  return Number(valor.replace(/\./g, "").replace(",", "."));
}

function formatoBRL(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatoPYG(valor) {
  return valor.toLocaleString("es-PY");
}
