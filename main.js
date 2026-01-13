document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     🌍 IDIOMA AUTOMÁTICO
  ========================= */
  const esPT = navigator.language.startsWith("pt");

  const textos = {
    es: {
      placeholderPYG: "Ingrese monto en Guaraníes (PYG)",
      placeholderBRL: "Ingrese monto en Reales (BRL)",
      comprarGs: "Comprar Guaraníes",
      comprarPix: "Comprar Reales (PIX)",
      opGs: "Comprar Guaraníes",
      opPix: "Comprar PIX",
      consultaGs: "Consulta – Comprar Guaraníes",
      consultaPix: "Consulta – Comprar PIX"
    },
    pt: {
      placeholderPYG: "Digite o valor em Guaranis (PYG)",
      placeholderBRL: "Digite o valor em Reais (BRL)",
      comprarGs: "Comprar Guaranis",
      comprarPix: "Comprar Reais (PIX)",
      opGs: "Comprar Guaranis",
      opPix: "Comprar PIX",
      consultaGs: "Consulta – Comprar Guaranis",
      consultaPix: "Consulta – Comprar PIX"
    }
  };

  const t = esPT ? textos.pt : textos.es;

  /* =========================
     📊 COTIZACIÓN BASE
  ========================= */
  document.getElementById("compra").innerText = formatoPYG(COMPRA_BRL_PYG);
  document.getElementById("venta").innerText = formatoPYG(VENTA_BRL_PYG);
  document.getElementById("fecha").innerText = FECHA_COTIZACION;

  /* =========================
     🧮 INPUT FORMATEADO
  ========================= */
  const inputMonto = document.getElementById("monto");

  inputMonto.addEventListener("input", () => {
    const tipo = document.getElementById("tipo").value;
    inputMonto.value = formatearInput(inputMonto.value, tipo);
  });

  /* =========================
     🔄 CAMBIO DE OPERACIÓN
  ========================= */
  window.actualizarOpciones = function () {
    const tipo = document.getElementById("tipo").value;
    const zonaContainer = document.getElementById("zona-container");

    inputMonto.value = "";

    if (tipo === "COMPRA") {
      inputMonto.placeholder = t.placeholderPYG;
      zonaContainer.style.display = "block";
    } else {
      inputMonto.placeholder = t.placeholderBRL;
      zonaContainer.style.display = "none";
    }
  };

  actualizarOpciones();

  /* =========================
     🚚 TASA POR ZONA
  ========================= */
  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0;
  }

  /* =========================
     🔢 CONVERTIR
  ========================= */
  window.convertir = function () {
    const tipo = document.getElementById("tipo").value;
    const zona = document.getElementById("zona").value;
    const raw = inputMonto.value;
    const resultadoEl = document.getElementById("resultado");
    const detalleEl = document.getElementById("detalle");
    const whatsappLink = document.getElementById("whatsappLink");

    const monto = limpiarNumero(raw);

    if (!monto || monto <= 0) {
      alert(esPT ? "Digite um valor válido" : "Ingrese un monto válido");
      return;
    }

    /* ⏰ hora real */
    const ahora = new Date();
    const horaConsulta =
      ahora.getHours().toString().padStart(2, "0") + ":" +
      ahora.getMinutes().toString().padStart(2, "0");

    document.getElementById("hora").innerText = `(${horaConsulta} hs)`;

    let mensaje = "";

    /* 🟢 COMPRAR GUARANÍES */
    if (tipo === "COMPRA") {
      const tasa = obtenerTasa(zona);
      const brlBase = monto / COMPRA_BRL_PYG;
      const brlFinal = brlBase + tasa;

      resultadoEl.innerText = `${formatoBRL(brlFinal)} BRL`;

      detalleEl.innerHTML = `
        Operación: ${t.opGs}<br>
        Monto: ${formatoPYG(monto)} PYG<br>
        Cotización: 1 BRL = ${formatoPYG(COMPRA_BRL_PYG)} PYG<br>
        Tasa entrega: +${formatoBRL(tasa)} BRL<br>
        <b>Total: ${formatoBRL(brlFinal)} BRL</b>
      `;

      mensaje =
        `${t.consultaGs}\n` +
        `Monto: ${formatoPYG(monto)} PYG\n` +
        `Zona: ${zona}\n` +
        `Cotización: ${FECHA_COTIZACION} ${horaConsulta}\n` +
        `Total: ${formatoBRL(brlFinal)} BRL`;
    }

    /* 🔵 COMPRAR PIX */
    else {
      const pyg = monto * VENTA_BRL_PYG;

      resultadoEl.innerText = `${formatoPYG(pyg)} PYG`;

      detalleEl.innerHTML = `
        Operación: ${t.opPix}<br>
        Monto: ${formatoBRL(monto)} BRL<br>
        Cotización: 1 BRL = ${formatoPYG(VENTA_BRL_PYG)} PYG<br>
        <b>Total: ${formatoPYG(pyg)} PYG</b>
      `;

      mensaje =
        `${t.consultaPix}\n` +
        `Monto: ${formatoBRL(monto)} BRL\n` +
        `Cotización: ${FECHA_COTIZACION} ${horaConsulta}\n` +
        `Total: ${formatoPYG(pyg)} PYG`;
    }

    whatsappLink.href =
      "https://wa.me/595982898734?text=" + encodeURIComponent(mensaje);
  };
});

/* =========================
   🧮 FUNCIONES DE FORMATO
========================= */

function limpiarNumero(valor) {
  return Number(valor.replace(/\./g, "").replace(",", "."));
}

function formatearInput(valor, tipo) {
  let num = limpiarNumero(valor);
  if (isNaN(num)) return "";

  if (tipo === "COMPRA") {
    return num.toLocaleString("es-PY");
  } else {
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
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

