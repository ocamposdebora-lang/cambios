let mensajeFinal = '';
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const paso1 = document.getElementById('paso1');
const paso2 = document.getElementById('paso2');
const paso3 = document.getElementById('paso3');

let tipoOperacion = '';

document.querySelectorAll('.opcion').forEach(op => {
  op.addEventListener('click', () => {
    document.querySelectorAll('.opcion').forEach(o => o.classList.remove('activa'));
    op.classList.add('activa');
    tipoOperacion = op.dataset.tipo;

    step1.classList.remove('activo');
    step2.classList.add('activo');
    paso1.classList.remove('activo');
    paso2.classList.add('activo');
  });
});

function volverPaso1() {
  step2.classList.remove('activo');
  step1.classList.add('activo');
  paso2.classList.remove('activo');
  paso1.classList.add('activo');
}

document.getElementById('btnSolicitar').addEventListener('click', () => {
  const monto = document.getElementById('monto').value;
  if (!monto) {
    alert('Ingrese un monto');
    return;
  }

  mensajeFinal =
    'Solicitud de Operación\n' +
    'Tipo: ' + (tipoOperacion === 'PIX' ? 'Comprar Reales (PIX)' : 'Comprar Guaraníes') + '\n' +
    'Monto: ' + monto;

  document.getElementById('resumenContenido').innerHTML =
    '<b>Tipo:</b> ' + (tipoOperacion === 'PIX' ? 'Comprar Reales (PIX)' : 'Comprar Guaraníes') + '<br>' +
    '<b>Monto:</b> ' + monto;

  document.getElementById('resumenOverlay').classList.remove('oculto');
  paso2.classList.remove('activo');
  paso3.classList.add('activo');
});

function volverAEditar() {
  document.getElementById('resumenOverlay').classList.add('oculto');
  paso3.classList.remove('activo');
  paso2.classList.add('activo');
}

function enviarWhatsApp() {
  const url = 'https://api.whatsapp.com/send?phone=595982898734&text=' + encodeURIComponent(mensajeFinal);
  window.open(url, '_blank');
}
