document.addEventListener("DOMContentLoaded", () => {
  // ========= Idioma automático =========
  const isPT = (navigator.language || "").toLowerCase().startsWith("pt");
  const locale = isPT ? "pt-BR" : "es-PY";

  const T = getTexts(isPT);

  // Textos UI
  setText("txtUbicacion", T.ubicacion);
  setText("txtCompra", T.compra);
  setText("txtVenta", T.venta);
  setText("txtCotAct", T.cotAct);
  setText("txtOperacion", T.operacion);
  setText("txtBtnGs", T.btnGs);
  setText("txtBtnPix", T.btnPix);
  setText("txtMontoLabel", T.montoLabel);
  setText("txtForma", T.forma);
  setText("txtZona", T.zona);
  setText("txtZonaHint", T.zonaHint);
  setText("txtTransferTitle", T.transferTitle);
  setText("txtConAlias", T.conAlias);
  setText("txtSinAlias", T.sinAlias);
  setText("txtAlias", T.alias);
  setText("txtTitular1", T.titular);
  setText("txtNroCuenta", T.nroCuenta);
  setText("txtBanco", T.banco);
  setText("txtDoc", T.doc);
  setText("txtTitular2", T.titular);
  setText("txtServiciosTitle", T.servTitle);
  setText("txtTipoServicio", T.tipoServicio);
  setText("optTelco", T.telco);
  setText("optOtros", T.otros);
  setText("txtNis", T.nis);
  setText("txtContrato", T.contrato);
  setText("txtDetallePago", T.detallePago);
  setText("txtServiciosHint", T.servHint);

  setText("txtPixTitle", T.pixTitle);
  setText("txtChave", T.chave);
  setText("txtTitularPix", T.titular);
  setText("txtObsPix", T.obs);

  setText("btnCalcular", T.calcular);
  setText("txtResumen", T.resumen);
  setText("txtBtnWhatsapp", T.btnWhatsapp);
  setText("txtCtaHint", T.ctaHint);

  // Cotización
  document.getElementById("compra").innerText = fmtInt(COMPRA_BRL_PYG, locale);
  document.getElementById("venta").innerText = fmtInt(VENTA_BRL_PYG, locale);
  document.getElementById("fecha").innerText = FECHA_COTIZACION;
  document.getElementById("hora").innerText = `(${HORA_COTIZACION} hs)`;

  // ========= Estado =========
  let operacion = "GS"; // "GS" o "PIX"

  // ========= Elementos =========
  const btnGs = document.getElementById("btnGs");
  const btnPix = document.getElementById("btnPix");
  const montoEl = document.getElementById("monto");
  const panelFormaGs = document.getElementById("panelFormaGs");
  const panelPix = document.getElementById("panelPix");

  const formaGs = document.getElementById("formaGs");
  const panelZona = document.getElementById("panelZona");
  const panelTransfer = document.getElementById("panelTransfer");
  const panelServicios = document.getElementById("panelServicios");

  const tipoServicio = document.getElementById("tipoServicio");
  const servAnde = document.getElementById("servAnde");
  const servTelco = document.getElementById("servTelco");
  const servOtros = document.getElementById("servOtros");

  const transferAlias = document.getElementById("transferAlias");
  const transferCuenta = document.getElementById("transferCuenta");

  const btnCalcular = document.getElementById("btnCalcular");
  const resultadoValor = document.getElementById("resultadoValor");
  const resumenTexto = document.getElementById("resumenTexto");
  const btnWhatsapp = document.getElementById("btnWhatsapp");

  // ========= Input mask (formatea mientras escribe) =========
  montoEl.addEventListener("input", () => {
    if (operacion === "PIX") {
      // BRL con 2 decimales (centavos)
      montoEl.value = maskMoneyBRL(montoEl.value, locale);
    } else {
      // PYG entero
      montoEl.value = maskMoneyPYG(montoEl.value, locale);
    }
  });

  // ========= Botones operación =========
  btnGs.addEventListener("click", () => setOperacion("GS"));
  btnPix.addEventListener("click", () => setOperacion("PIX"));

  function setOperacion(op) {
    operacion = op;

    btnGs.classList.toggle("active", op === "GS");
    btnPix.classList.toggle("active", op === "PIX");

    // Reset
    montoEl.value = "";
    resultadoValor.innerText = "—";
    resumenTexto.innerHTML = "";
    btnWhatsapp.href = "#";

    // UI
    if (op === "PIX") {
      panelFormaGs.classList.add("hidden");
      panelPix.classList.remove("hidden");

      montoEl.inputMode = "decimal";
      montoEl.placeholder = T.pixPlaceholder;
      setText("txtMontoHint", T.pixHint);
    } else {
      panelFormaGs.classList.remove("hidden");
      panelPix.classList.add("hidden");

      montoEl.inputMode = "numeric";
      montoEl.placeholder = T.gsPlaceholder;
      setText("txtMontoHint", T.gsHint);

      // Ajusta subpaneles por defecto
      syncFormaGs();
    }
  }

  // ========= Forma GS =========
  formaGs.addEventListener("change", syncFormaGs);

  function syncFormaGs() {
    const v = formaGs.value;

    panelZona.classList.toggle("hidden", v !== "EFECTIVO");
    panelTransfer.classList.toggle("hidden", v !== "TRANSFER");
    panelServicios.classList.toggle("hidden", v !== "SERVICIOS");
  }

  // Alias / cuenta
  document.querySelectorAll('input[name="tieneAlias"]').forEach((r) => {
    r.addEventListener("change", () => {
      const val = document.querySelector('input[name="tieneAlias"]:checked').value;
      transferAlias.classList.toggle("hidden", val !== "SI");
      transferCuenta.classList.toggle("hidden", val !== "NO");
    });
  });

  // Servicios sub-tipo
  tipoServicio.addEventListener("change", () => {
    const v = tipoServicio.value;
    servAnde.classList.toggle("hidden", v !== "ANDE");
    servTelco.classList.toggle("hidden", v !== "TELCO");
    servOtros.classList.toggle("hidden", v !== "OTROS");
  });

  // ========= Calcular =========
  btnCalcular.addEventListener("click", () => {
    const consulta = new Date();
    const hh = String(consulta.getHours()).padStart(2, "0");
    const mm = String(consulta.getMinutes()).padStart(2, "0");
    const horaConsulta = `${hh}:${mm}`;

    if (operacion === "PIX") {
      const brl = parseMaskedBRL(montoEl.value);
      if (!brl || brl <= 0) return alert(T.errMonto);

      const pyg = brl * VENTA_BRL_PYG;

      resultadoValor.innerText = `${fmtInt(pyg, locale)} PYG`;

      // Resumen
      const chave = getVal("chavePix");
      const titular = getVal("titularPix");
      const obs = getVal("obsPix");

      const rows = [
        row(T.r_operacion, T.btnPix),
        row(T.r_monto, `${fmtBRL(brl, locale)} BRL`),
        row(T.r_cot, `${FECHA_COTIZACION} ${HORA_COTIZACION} hs`),
        row(T.r_consulta, `${FECHA_COTIZACION} ${horaConsulta} hs`),
        row(T.r_total, `${fmtInt(pyg, locale)} PYG`),
      ];

      if (chave) rows.push(row(T.r_chave, chave));
      if (titular) rows.push(row(T.r_titular, titular));
      if (obs) rows.push(row(T.r_obs, obs));

      resumenTexto.innerHTML = rows.join("");

      const msg =
        `${T.msgTitulo}\n\n` +
        `${T.r_operacion}: ${T.btnPix}\n` +
        `${T.r_monto}: ${fmtBRL(brl, locale)} BRL\n` +
        `${T.r_total}: ${fmtInt(pyg, locale)} PYG\n` +
        `${T.r_cot}: ${FECHA_COTIZACION} ${HORA_COTIZACION} hs\n` +
        `${T.r_consulta}: ${FECHA_COTIZACION} ${horaConsulta} hs\n\n` +
        `${T.pixTitle}\n` +
        `${T.r_chave}: ${chave || "-"}\n` +
        `${T.r_titular}: ${titular || "-"}\n` +
        `${T.r_obs}: ${obs || "-"}\n\n` +
        `${T.noteQR}`;

      btnWhatsapp.href = waLink(msg);
      return;
    }

    // ====== GS ======
    const pygMonto = parseMaskedPYG(montoEl.value);
    if (!pygMonto || pygMonto <= 0) return alert(T.errMonto);

    const forma = formaGs.value;

    // Efectivo: aplica tasa por zona (sumar en BRL como acordamos)
    if (forma === "EFECTIVO") {
      const zona = document.getElementById("zona").value;
      const tasa = obtenerTasa(zona); // BRL
      const brlBase = pygMonto / COMPRA_BRL_PYG;
      const brlFinal = brlBase + tasa;

      resultadoValor.innerText = `${fmtBRL(brlFinal, locale)} BRL`;

      const rows = [
        row(T.r_operacion, T.btnGs),
        row(T.r_monto, `${fmtInt(pygMonto, locale)} PYG`),
        row(T.r_forma, T.f_efectivo),
        row(T.r_zona, zonaLabel(zona, T)),
        row(T.r_cot, `${FECHA_COTIZACION} ${HORA_COTIZACION} hs`),
        row(T.r_consulta, `${FECHA_COTIZACION} ${horaConsulta} hs`),
        row(T.r_tasa, `+${fmtBRL(tasa, locale)} BRL`),
        row(T.r_total, `${fmtBRL(brlFinal, locale)} BRL`),
      ];
      resumenTexto.innerHTML = rows.join("");

      const msg =
        `${T.msgTitulo}\n\n` +
        `${T.r_operacion}: ${T.btnGs}\n` +
        `${T.r_forma}: ${T.f_efectivo}\n` +
        `${T.r_zona}: ${zonaLabel(zona, T)}\n` +
        `${T.r_monto}: ${fmtInt(pygMonto, locale)} PYG\n` +
        `${T.r_total}: ${fmtBRL(brlFinal, locale)} BRL\n` +
        `${T.r_tasa}: +${fmtBRL(tasa, locale)} BRL\n` +
        `${T.r_cot}: ${FECHA_COTIZACION} ${HORA_COTIZACION} hs\n` +
        `${T.r_consulta}: ${FECHA_COTIZACION} ${horaConsulta} hs`;

      btnWhatsapp.href = waLink(msg);
      return;
    }

    // Transferencia: NO pide zona/tasa. Se envían datos bancarios.
    if (forma === "TRANSFER") {
      const tieneAlias = document.querySelector('input[name="tieneAlias"]:checked').value;

      let datos = "";
      if (tieneAlias === "SI") {
        const alias = getVal("alias");
        const titular = getVal("titularAlias");
        datos =
          `${T.r_alias}: ${alias || "-"}\n` +
          `${T.r_titular}: ${titular || "-"}`;
      } else {
        const nroCuenta = getVal("nroCuenta");
        const banco = getVal("banco");
        const doc = getVal("doc");
        const titular = getVal("titularCuenta");
        datos =
          `${T.r_nroCuenta}: ${nroCuenta || "-"}\n` +
          `${T.r_banco}: ${banco || "-"}\n` +
          `${T.r_doc}: ${doc || "-"}\n` +
          `${T.r_titular}: ${titular || "-"}`;
      }

      // En transferencia, el cálculo útil para vos suele ser BRL estimado:
      const brlEstimado = pygMonto / COMPRA_BRL_PYG;

      resultadoValor.innerText = `${fmtBRL(brlEstimado, locale)} BRL`;

      const rows = [
        row(T.r_operacion, T.btnGs),
        row(T.r_monto, `${fmtInt(pygMonto, locale)} PYG`),
        row(T.r_forma, T.f_transfer),
        row(T.r_cot, `${FECHA_COTIZACION} ${HORA_COTIZACION} hs`),
        row(T.r_consulta, `${FECHA_COTIZACION} ${horaConsulta} hs`),
        row(T.r_total, `${fmtBRL(brlEstimado, locale)} BRL`),
      ];
      resumenTexto.innerHTML = rows.join("") + `<div class="res-row"><span>${T.r_datos}</span><strong>${T.verEnMsg}</strong></div>`;

      const msg =
        `${T.msgTitulo}\n\n` +
        `${T.r_operacion}: ${T.btnGs}\n` +
        `${T.r_forma}: ${T.f_transfer}\n` +
        `${T.r_monto}: ${fmtInt(pygMonto, locale)} PYG\n` +
        `${T.r_total}: ${fmtBRL(brlEstimado, locale)} BRL\n` +
        `${T.r_cot}: ${FECHA_COTIZACION} ${HORA_COTIZACION} hs\n` +
        `${T.r_consulta}: ${FECHA_COTIZACION} ${horaConsulta} hs\n\n` +
        `${T.transferTitle}\n` +
        `${datos}`;

      btnWhatsapp.href = waLink(msg);
      return;
    }

    // Servicios: pide NIS/contrato/otros + detalle
    if (forma === "SERVICIOS") {
      const tipo = tipoServicio.value;
      const brlEstimado = pygMonto / COMPRA_BRL_PYG;

      let extra = "";
      if (tipo === "ANDE") extra = `${T.r_nis}: ${getVal("nis") || "-"}`;
      if (tipo === "TELCO") extra = `${T.r_contrato}: ${getVal("contrato") || "-"}`;
      if (tipo === "OTROS") extra = `${T.r_detallePago}: ${getVal("detallePago") || "-"}`;

      resultadoValor.innerText = `${fmtBRL(brlEstimado, locale)} BRL`;

      const rows = [
        row(T.r_operacion, T.btnGs),
        row(T.r_monto, `${fmtInt(pygMonto, locale)} PYG`),
        row(T.r_forma, T.f_servicios),
        row(T.r_tipoServicio, servicioLabel(tipo, T)),
        row(T.r_cot, `${FECHA_COTIZACION} ${HORA_COTIZACION} hs`),
        row(T.r_consulta, `${FECHA_COTIZACION} ${horaConsulta} hs`),
        row(T.r_total, `${fmtBRL(brlEstimado, locale)} BRL`),
      ];
      resumenTexto.innerHTML = rows.join("") + `<div class="res-row"><span>${T.r_datos}</span><strong>${T.verEnMsg}</strong></div>`;

      const msg =
        `${T.msgTitulo}\n\n` +
        `${T.r_operacion}: ${T.btnGs}\n` +
        `${T.r_forma}: ${T.f_servicios}\n` +
        `${T.r_tipoServicio}: ${servicioLabel(tipo, T)}\n` +
        `${T.r_monto}: ${fmtInt(pygMonto, locale)} PYG\n` +
        `${T.r_total}: ${fmtBRL(brlEstimado, locale)} BRL\n` +
        `${T.r_cot}: ${FECHA_COTIZACION} ${HORA_COTIZACION} hs\n` +
        `${T.r_consulta}: ${FECHA_COTIZACION} ${horaConsulta} hs\n\n` +
        `${T.servTitle}\n` +
        `${extra}\n\n` +
        `${T.noteQR}`;

      btnWhatsapp.href = waLink(msg);
      return;
    }
  });

  // Inicial
  setOperacion("GS");
  syncFormaGs();
  tipoServicio.dispatchEvent(new Event("change"));
  document.querySelector('input[name="tieneAlias"][value="SI"]').dispatchEvent(new Event("change"));

  // ========= Helpers =========
  function obtenerTasa(zona) {
    if (zona === "CDE") return 10;
    if (zona === "MINGA") return 20;
    if (zona === "FRANCO") return 15;
    return 0;
  }

  function waLink(text) {
    return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`;
  }
});

// ================= FORMATEO (mask) =================

// BRL: toma SOLO dígitos y los interpreta como centavos.
// Ej: "2.000,00" -> dígitos "200000" -> 2000.00
function maskMoneyBRL(input, locale) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  const value = Number(digits) / 100;
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

// PYG: solo entero con miles
function maskMoneyPYG(input, locale) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  const value = Number(digits);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

// Parse BRL de string formateado a number real
function parseMaskedBRL(str) {
  if (!str) return 0;
  // eliminar puntos miles y convertir coma a punto
  const n = Number(str.replace(/\./g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

// Parse PYG formateado a entero
function parseMaskedPYG(str) {
  if (!str) return 0;
  const n = Number(str.replace(/\D/g, ""));
  return isNaN(n) ? 0 : n;
}

// Formatters
function fmtBRL(value, locale) {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
function fmtInt(value, locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

// UI helpers
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function getVal(id) {
  const el = document.getElementById(id);
  return (el?.value || "").trim();
}
function row(k, v) {
  return `<div class="res-row"><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong></div>`;
}
function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function zonaLabel(z, T){
  if (z === "CDE") return T.z_cde;
  if (z === "MINGA") return T.z_minga;
  if (z === "FRANCO") return T.z_franco;
  return z;
}
function servicioLabel(t, T){
  if (t === "ANDE") return "ANDE";
  if (t === "TELCO") return T.telco;
  return T.otros;
}

// Textos ES/PT
function getTexts(isPT){
  if (isPT){
    return {
      ubicacion: "Ciudad del Este – Paraguai",
      compra: "Compra BRL",
      venta: "Venda BRL",
      cotAct: "Cotação atualizada:",
      operacion: "Operação",
      btnGs: "Comprar Guaraníes",
      btnPix: "Comprar PIX",
      montoLabel: "Valor",
      gsPlaceholder: "Digite o valor em Guaraníes (PYG)",
      pixPlaceholder: "Digite o valor em Reais (BRL)",
      gsHint: "Digite o valor em Guaraníes.",
      pixHint: "Digite o valor que você deseja comprar em Reais.",
      forma: "Forma de operação",
      zona: "Zona de entrega",
      zonaHint: "Taxa por zona (somente em dinheiro).",
      transferTitle: "Dados para transferência",
      conAlias: "Tenho alias",
      sinAlias: "Não tenho alias",
      alias: "Alias",
      titular: "Titular",
      nroCuenta: "Número da conta",
      banco: "Banco",
      doc: "Número do documento (CI)",
      servTitle: "Pagamento de contas / serviços",
      tipoServicio: "Tipo",
      telco: "Telefonia / Internet",
      otros: "Outros pagamentos",
      nis: "Número do NIS",
      contrato: "Nº da conta / contrato / linha",
      detallePago: "Detalhe do pagamento",
      servHint: "* Se precisar QR/link/boleta, envie pelo WhatsApp após a solicitação.",
      pixTitle: "Dados PIX",
      chave: "Chave PIX",
      obs: "Observação",
      calcular: "CALCULAR",
      resumen: "Resumo",
      btnWhatsapp: "Solicitar operação por WhatsApp",
      ctaHint: "O WhatsApp abrirá com a solicitação pronta para enviar.",
      errMonto: "Digite um valor válido",

      // resumo keys
      r_operacion:"Operação",
      r_monto:"Valor",
      r_forma:"Forma",
      r_zona:"Zona",
      r_cot:"Cotação",
      r_consulta:"Consulta",
      r_total:"Total",
      r_tasa:"Taxa",
      r_chave:"Chave PIX",
      r_titular:"Titular",
      r_obs:"Obs.",
      r_alias:"Alias",
      r_nroCuenta:"Conta",
      r_banco:"Banco",
      r_doc:"Documento",
      r_datos:"Dados",
      r_tipoServicio:"Tipo",
      r_nis:"NIS",
      r_contrato:"Contrato/Linha",
      r_detallePago:"Detalhe",

      f_efectivo:"Dinheiro (entrega)",
      f_transfer:"Transferência bancária (PY)",
      f_servicios:"Pagamento de contas",
      z_cde:"Ciudad del Este",
      z_minga:"Minga Guazú",
      z_franco:"Presidente Franco",

      msgTitulo:"Solicitação de operação",
      verEnMsg:"ver no WhatsApp",
      noteQR:"Obs.: QR/link/boleta serão enviados pelo WhatsApp."
    };
  }

  return {
    ubicacion: "Ciudad del Este – Paraguay",
    compra: "Compra BRL",
    venta: "Venta BRL",
    cotAct: "Cotización actualizada:",
    operacion: "Operación",
    btnGs: "Comprar Guaraníes",
    btnPix: "Comprar PIX",
    montoLabel: "Monto",
    gsPlaceholder: "Ingrese monto en Guaraníes (PYG)",
    pixPlaceholder: "Ingrese el valor que quiere comprar (BRL)",
    gsHint: "Ingrese el monto en Guaraníes.",
    pixHint: "Ingrese el valor que desea comprar en Reales (BRL).",
    forma: "Forma de operación",
    zona: "Zona de entrega",
    zonaHint: "Tasa por zona (solo efectivo).",
    transferTitle: "Datos para transferencia",
    conAlias: "Tengo alias",
    sinAlias: "No tengo alias",
    alias: "Alias",
    titular: "Titular",
    nroCuenta: "Número de cuenta",
    banco: "Banco",
    doc: "Número de CI",
    servTitle: "Pago de facturas / servicios",
    tipoServicio: "Tipo",
    telco: "Telefonía / Internet",
    otros: "Otros pagos",
    nis: "Número de NIS",
    contrato: "N° de cuenta / contrato / línea",
    detallePago: "Detalle del pago",
    servHint: "* Si requiere QR/link/boleta, se envía por WhatsApp luego de la solicitud.",
    pixTitle: "Datos PIX",
    chave: "Chave PIX",
    obs: "Observación",
    calcular: "CALCULAR",
    resumen: "Resumen",
    btnWhatsapp: "Solicitar operación por WhatsApp",
    ctaHint: "Se abrirá WhatsApp con tu solicitud lista para enviar.",
    errMonto: "Ingrese un monto válido",

    // resumen keys
    r_operacion:"Operación",
    r_monto:"Monto",
    r_forma:"Forma",
    r_zona:"Zona",
    r_cot:"Cotización",
    r_consulta:"Consulta",
    r_total:"Total",
    r_tasa:"Tasa entrega",
    r_chave:"Chave PIX",
    r_titular:"Titular",
    r_obs:"Obs.",
    r_alias:"Alias",
    r_nroCuenta:"Cuenta",
    r_banco:"Banco",
    r_doc:"CI",
    r_datos:"Datos",
    r_tipoServicio:"Tipo",
    r_nis:"NIS",
    r_contrato:"Contrato/Línea",
    r_detallePago:"Detalle",

    f_efectivo:"Entrega en efectivo",
    f_transfer:"Transferencia bancaria (PY)",
    f_servicios:"Pago de facturas y servicios",
    z_cde:"Ciudad del Este",
    z_minga:"Minga Guazú",
    z_franco:"Presidente Franco",

    msgTitulo:"Solicitud de operación",
    verEnMsg:"ver en WhatsApp",
    noteQR:"Nota: QR/link/boleta se envía por WhatsApp."
  };
}
