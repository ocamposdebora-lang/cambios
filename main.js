let operacion = "GS";
let paso = 1;

const pasoTxt = document.getElementById("pasoActual");
const btnGS = document.getElementById("btnGS");
const btnPIX = document.getElementById("btnPIX");

const monto = document.getElementById("monto");
const resultado = document.getElementById("resultado");

document.getElementById("compra").innerText = COMPRA_BRL_PYG.toLocaleString("es-PY");
document.getElementById("venta").innerText  = VENTA_BRL_PYG.toLocaleString("es-PY");
document.getElementById("fecha").innerText  = FECHA_COTIZACION;
document.getElementById("hora").innerText   = `(${HORA_COTIZACION})`;

btnGS.onclick = () => setOperacion("GS");
btnPIX.onclick = () => setOperacion("PIX");

function setOperacion(op) {
  operacion = op;
  btnGS.classList.toggle("activa", op === "GS");
  btnPIX.classList.toggle("activa", op === "PIX");
  monto.value = "";
  ocultarTodo();
}

function ocultarTodo() {
  document.getElementById("resultadoBox").classList.add("oculto");
  document.getElementById("paso2").classList.add("oculto");
  document.getElementById("paso3").classList.add("oculto");
  pasoTxt.innerText = "Paso 1 de 3 · Calcular";
}

monto.addEventListener("input", () => {
  let v = monto.value.replace(/\D/g, "");
  if (operacion === "PIX") {
    v = (Number(v) / 100).toFixed(2).replace(".", ",");
  }
  monto.value = v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

document.getElementById("btnCalcular").onclick = () => {
  const num = Number(monto.value.replace(/\./g, "").replace(",", "."));
  if (!num) return alert("Ingrese un monto válido");

  let total;
  if (operacion === "PIX") {
    total = num * VENTA_BRL_PYG;
    resultado.innerText = total.toLocaleString("es-PY") + " PYG";
    document.getElementById("formaPIX").classList.remove("oculto");
    document.getElementById("formaGS").classList.add("oculto");
  } else {
    total = num / COMPRA_BRL_PYG;
    resultado.innerText = total.toFixed(2).replace(".", ",") + " BRL";
    document.getElementById("formaGS").classList.remove("oculto");
    document.getElementById("formaPIX").classList.add("oculto");
  }

  document.getElementById("resultadoBox").classList.remove("oculto");
  document.getElementById("paso2").classList.remove("oculto");
  document.getElementById("paso3").classList.remove("oculto");

  pasoTxt.innerText = "Paso 2 de 3 · Forma de operación";

  document.getElementById("btnWhatsapp").onclick = () => {
    pasoTxt.innerText = "Paso 3 de 3 · WhatsApp";
    const msg =
      `Solicitud de operación\n\n` +
      `Tipo: ${operacion === "PIX" ? "Comprar PIX" : "Comprar Guaraníes"}\n` +
      `Monto: ${monto.value}\n` +
      `Total: ${resultado.innerText}\n` +
      `Fecha: ${FECHA_COTIZACION} ${HORA_COTIZACION}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUM}?text=` + encodeURIComponent(msg),
      "_blank"
    );
  };
};
