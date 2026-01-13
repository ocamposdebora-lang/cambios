document.addEventListener("DOMContentLoaded", () => {

  // Detectar idioma
  const lang = navigator.language.startsWith("pt") ? "pt" : "es";

  // Textos
  const textos = {
    es: {
      comprarGs: "Comprar Guaraníes",
      comprarPix: "Comprar Reales (PIX)",
      placeholderGs: "Ingrese monto en Guaraníes (PYG)",
      placeholderPix: "Ingrese monto en Reales (BRL)",
      notaZona: "Banca Web: transferencias bancarias y pagos de servicios"
    },
    pt: {
      comprarGs: "Comprar Guaranis",
      comprarPix: "Comprar Reais (PIX)",
      placeholderGs: "Digite o valor em Guaranis (PYG)",
      placeholderPix: "Digite o valor em Reais (BRL)",
      notaZona: "Banca Web: transferências bancárias e pagamentos"
    }
  };

  const t = textos[lang];

  // Mostrar cotización
  document.getElementById("compra").innerText =
    COMPRA_BRL_PYG.toLocaleString("es-PY");

  document.getElementById("venta").innerText =
    VENTA_BRL_PYG.toLocaleString("es-PY");

  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  // Actualizar placeholders y zona
  window.actualizarOpciones = function () {
    const tipo = document.getElementById("tipo").value;
    const monto = document.getElementById("monto");
    const zonaContainer = document.getElementById("zona-container");

    monto.value = "";

    if (tipo === "COMPRA") {
      monto.placeholder = t.placeholderGs;
      zonaContainer.style.display = "block";
    } else {
      monto.placeholder = t.placeholderPix;
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

  // Función principal
  window.convertir = function () {
    const tipo = document.getElementById("tipo").value;
    const montoInput = document.getElementById("monto").value;
    const zona = document.getElementById("zona").value;
    const resultadoEl = document.getElementById("resultado");
    const detalleEl = document.getElementById("detalle");
    const whatsappLink = document.getElementById("whatsappLink");

    // LIMPIAR SEPARADORES
    const monto = Number(
      montoInput.replace(/\./g, "").replace(",", ".")
    );

    if (!monto || monto <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    let mensaje = "";

    // 🟢 COMPRAR GUARANÍES (cliente ingresa PYG → recibe BRL)
    if (tipo === "COMPRA") {
      const tasa = obtenerTasa(zona);
      const brlBruto = monto / COMPRA_BRL_PYG;
      const brlFinal = brlBruto + tasa; // 👉 SE SUMA LA TASA

      resultadoEl.innerText =
        brlFinal.toFixed(2).replace(".", ",") + " BRL";

      detalleEl.innerHTML = `
        Operación: Comprar Guaraníes<br>
        Monto: ${monto.toLocaleString("es-PY")} PYG<br>
        Cotización (Compra): 1 BRL = ${COMPRA_BRL_PYG.toLocaleString("es-PY")} PYG<br>
        BRL calculado: ${brlBruto.toFixed(2).replace(".", ",")} BRL<br>
        Tasa entrega: +${tasa.toFixed(2).replace(".", ",")} BRL<br>
        <b>Total a pagar: ${brlFinal.toFixed(2).replace(".", ",")} BRL</b>
      `;

      mensaje =
        `Hola, quiero consultar para comprar guaraníes.\n` +
        `Monto: ${monto.toLocaleString("es-PY")} PYG\n` +
        `Zona: ${zona}\n` +
        `Total: ${brlFinal.toFixed(2).replace(".", ",")} BRL`;

    }
    // 🔵 COMPRAR PIX (cliente ingresa BRL → recibe PYG)
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
        `Total: ${pyg.toLocaleString("es-PY")} PYG`;
    }

    // WhatsApp con mensaje
    whatsappLink.href =
      "https://wa.me/595982898734?text=" + encodeURIComponent(mensaje);
  };

});
