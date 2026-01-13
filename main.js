document.addEventListener("DOMContentLoaded", () => {

  // Idioma automático
  const lang = navigator.language.startsWith("pt") ? "pt" : "es";

  // Mostrar cotización
  document.getElementById("compra").innerText =
    COMPRA_BRL_PYG.toLocaleString("es-PY");

  document.getElementById("venta").innerText =
    VENTA_BRL_PYG.toLocaleString("es-PY");

  document.getElementById("fecha").innerText = FECHA_COTIZACION;
  document.getElementById("hora").innerText = `(${HORA_COTIZACION} hs)`;

  // Cambios según tipo
  window.actualizarOpciones = function () {
    const tipo = document.getElementById("tipo").value;
    const monto = document.getElementById("monto");
    const zonaContainer = document.getElementById("zona-container");

    monto.value = "";

    if (tipo === "COMPRA") {
      monto.placeholder =
        lang === "pt"
          ? "Digite o valor em Guaranis (PYG)"
          : "Ingrese monto en Guaraníes (PYG)";
      zonaContainer.style.display = "block";
    } else {
      monto.placeholder =
        lang === "pt"
          ? "Digite o valor em Reais (BRL)"
          : "Ingrese monto en Reales (BRL)";
      zonaContainer.style.display = "none";
    }
  };

  actualizarOpciones();

  // Tasa por zona
  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0;
  }

  // Convertir
  window.convertir = function () {
    const tipo = document.getElementById("tipo").value;
    const montoInput = document.getElementById("monto").value;
    const zona = document.getElementById("zona").value;
    const resultadoEl = document.getElementById("resultado");
    const detalleEl = document.getElementById("detalle");
    const whatsappLink = document.getElementById("whatsappLink");

    // Limpiar separadores
    const monto = Number(
      montoInput.replace(/\./g, "").replace(",", ".")
    );

    if (!monto || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    let mensaje = "";

    // 🟢 Comprar Guaraníes (PYG → BRL)
    if (tipo === "COMPRA") {
      const tasa = obtenerTasa(zona);
      const brlBase = monto / COMPRA_BRL_PYG;
      const brlFinal = brlBase + tasa;

      resultadoEl.innerText =
        brlFinal.toFixed(2).replace(".", ",") + " BRL";

      detalleEl.innerHTML = `
        Operación: Comprar Guaraníes<br>
        Monto: ${monto.toLocaleString("es-PY")} PYG<br>
        Cotización (Compra): 1 BRL = ${COMPRA_BRL_PYG.toLocaleString("es-PY")} PYG<br>
        Tasa entrega: +${tasa.toFixed(2).replace(".", ",")} BRL<br>
        <b>Total: ${brlFinal.toFixed(2).replace(".", ",")} BRL</b>
      `;

      mensaje =
        `Hola, quiero consultar para comprar guaraníes.\n` +
        `Monto: ${monto.toLocaleString("es-PY")} PYG\n` +
        `Zona: ${zona}\n` +
        `Cotización: ${FECHA_COTIZACION} ${HORA_COTIZACION}\n` +
        `Total: ${brlFinal.toFixed(2).replace(".", ",")} BRL`;
    }

    // 🔵 Comprar PIX (BRL → PYG)
    else {
      const pyg = monto * VENTA_BRL_PYG;

      resultadoEl.innerText =
        pyg.toLocaleString("es-PY") + " PYG";

      detalleEl.innerHTML = `
        Operación: Comprar Reales (PIX)<br>
        Monto: ${monto.toFixed(2).replace(".", ",")} BRL<br>
        Cotización (Venta): 1 BRL = ${VENTA_BRL_PYG.toLocaleString("es-PY")} PYG<br>
        <b>Total: ${pyg.toLocaleString("es-PY")} PYG</b>
      `;

      mensaje =
        `Hola, quiero consultar para comprar PIX.\n` +
        `Monto: ${monto.toFixed(2).replace(".", ",")} BRL\n` +
        `Cotización: ${FECHA_COTIZACION} ${HORA_COTIZACION}\n` +
        `Total: ${pyg.toLocaleString("es-PY")} PYG`;
    }

    // WhatsApp
    whatsappLink.href =
      "https://wa.me/595982898734?text=" + encodeURIComponent(mensaje);
  };
});
