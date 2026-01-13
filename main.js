document.addEventListener("DOMContentLoaded", () => {

  const lang = navigator.language.startsWith("pt") ? "pt" : "es";

  const textos = {
    es: {
      titulo: "D Ocampos Emprendimientos",
      ubicacion: "Ciudad del Este – Paraguay",
      compra: "Compra BRL",
      venta: "Venta BRL",
      fecha: "Cotización válida",
      pix: "Comprar Reales (PIX)",
      gs: "Comprar Guaraníes",
      placeholderPix: "Ingrese monto en Reales (BRL)",
      placeholderGs: "Ingrese monto en Guaraníes (PYG)",
      notaZona: "Banca Web: transferencias bancarias y pagos de servicios",
      calcular: "CALCULAR",
      legal: `
        * Cotización referencial.<br>
        * Operaciones sujetas a disponibilidad.<br>
        * Tasas según zona de entrega.
      `
    },
    pt: {
      titulo: "D Ocampos Empreendimentos",
      ubicacion: "Ciudad del Este – Paraguai",
      compra: "Compra BRL",
      venta: "Venda BRL",
      fecha: "Cotação válida",
      pix: "Comprar Reais (PIX)",
      gs: "Comprar Guaranis",
      placeholderPix: "Digite o valor em Reais (BRL)",
      placeholderGs: "Digite o valor em Guaranis (PYG)",
      notaZona: "Banca Web: transferências bancárias e pagamentos",
      calcular: "CALCULAR",
      legal: `
        * Cotação referencial.<br>
        * Operações sujeitas à disponibilidade.<br>
        * Taxas conforme zona de entrega.
      `
    }
  };

  const t = textos[lang];

  // textos
  titulo.innerText = t.titulo;
  ubicacion.innerText = t.ubicacion;
  txtCompra.innerText = t.compra;
  txtVenta.innerText = t.venta;
  txtFecha.innerText = t.fecha;
  optPix.innerText = t.pix;
  optGs.innerText = t.gs;
  btnCalcular.innerText = t.calcular;
  notaZona.innerText = t.notaZona;
  legal.innerHTML = t.legal;

  compra.innerText = COMPRA_BRL_PYG.toLocaleString();
  venta.innerText = VENTA_BRL_PYG.toLocaleString();
  fecha.innerText = FECHA_COTIZACION;

  window.actualizarOpciones = function () {
    const tipo = document.getElementById("tipo").value;
    monto.value = "";
    if (tipo === "VENTA") {
      monto.placeholder = t.placeholderPix;
      zonaContainer.style.display = "none";
    } else {
      monto.placeholder = t.placeholderGs;
      zonaContainer.style.display = "block";
    }
  };

  actualizarOpciones();

  function tasaZona(z) {
    if (z === "CDE") return 10;
    if (z === "MINGA") return 20;
    if (z === "FRANCO") return 15;
    return 0;
  }

  window.convertir = function () {
    const tipo = document.getElementById("tipo").value;
    const montoNum = Number(monto.value.replace(/\./g, "").replace(",", "."));
    if (!montoNum) return alert("Monto inválido");

    let mensaje = "";

    if (tipo === "VENTA") {
      const pyg = montoNum * VENTA_BRL_PYG;
      resultado.innerText = pyg.toLocaleString() + " PYG";
      mensaje = `Consulta: Comprar PIX por ${montoNum.toLocaleString()} BRL`;
    } else {
      const zona = document.getElementById("zona").value;
      const tasa = tasaZona(zona);
      const brl = montoNum / COMPRA_BRL_PYG + tasa;
      resultado.innerText = brl.toFixed(2) + " BRL";
      mensaje = `Consulta: Comprar Guaraníes por ${montoNum.toLocaleString()} PYG (${zona})`;
    }

    whatsappLink.href =
      `https://wa.me/595982898734?text=${encodeURIComponent(mensaje)}`;
  };
});
