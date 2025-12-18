const form = document.querySelector('#cep-form');
const input = document.querySelector('#cep-input');

input.addEventListener('input', () => {
  input.setCustomValidity('');
  input.classList.remove('invalid');
});

const uiBlock = () => {
  const modal = document.querySelector('#modal-block');
  modal.classList.remove('hidden');
  modal.classList.add('visible');
};

const uiUnblock = () => {
  const modal = document.querySelector('#modal-block');
  modal.classList.remove('visible');
  modal.classList.add('hidden');
};

const showMap = (lat, lng) => {
  const mapSection = document.querySelector('#map');
  mapSection.innerHTML = '';

  const URL = `https://maps.google.com/maps?q=${lat},${lng}&hl=pt&z=14&output=embed`;

  const iframe = document.createElement('iframe');
  iframe.src = URL;
  iframe.width = '600';
  iframe.height = '450';
  iframe.style.border = '0';
  iframe.allowFullscreen = '';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';

  iframe.onload = () => uiUnblock();
  mapSection.appendChild(iframe);
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const cep = input.value.trim();
  const regex = /^[0-9]{8}$/;

  if (!regex.test(cep)) {
    input.setCustomValidity('Insira um CEP válido com 8 números.');
    input.reportValidity();
    input.classList.add('invalid');
    return;
  }

  input.setCustomValidity('');
  input.classList.remove('invalid');

  const URL = `https://cep.awesomeapi.com.br/json/${cep}`;

  uiBlock();

  const response = await fetch(URL);
  const data = await response.json();

  if (data.code === 'not_found') {
    uiUnblock();
    input.setCustomValidity('CEP não encontrado.');
    input.reportValidity();
    input.classList.add('invalid');
    return;
  }

  const { cep: cepAPI, address, district, city, state, lat, lng } = data;

  const cepDataSection = document.querySelector('#cep-data');
  cepDataSection.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = `CEP: ${cepAPI.substring(0, 5)}-${cepAPI.substring(5)}`;
  cepDataSection.appendChild(h2);

  const createP = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    cepDataSection.appendChild(p);
  };
  createP(`Endereço: ${data.address || 'Não informado'}`);
  createP(`Bairro: ${district || 'Não informado'}`);
  createP(`Cidade: ${city}`);
  createP(`Estado: ${state}`);
  createP(`Latitude: ${lat}`);
  createP(`Longitude: ${lng}`);

  const btn = document.createElement('button');
  btn.textContent = 'Exibir mapa';
  btn.classList.add('map-btn');

  btn.addEventListener('click', () => {
    uiBlock();
    showMap(lat, lng);
  });
  cepDataSection.appendChild(btn);

  uiUnblock();
});
