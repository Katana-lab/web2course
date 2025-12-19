class Bank {
  constructor(name, clients, credits) {
    this.name = name;
    this.clients = clients;
    this.credits = credits;
  }
}

let banks = JSON.parse(localStorage.getItem("banks")) || [
  new Bank("PrivatBank", 1200000, 500000),
  new Bank("OschadBank", 850000, 420000),
  new Bank("Monobank", 950000, 380000),
  new Bank("UkrSibBank", 430000, 210000),
  new Bank("Raiffeisen", 510000, 260000),
];

const tableBody = document.querySelector('#banksTable tbody');
const totalCreditsEl = document.querySelector('#totalCredits');
const searchInput = document.querySelector('#searchInput');
const sortSelect = document.querySelector('#sortSelect');

let filteredBanks = [...banks];

function updateTotalCredits() {
  const total = filteredBanks.reduce((sum, bank) => sum + bank.credits, 0);
  totalCreditsEl.textContent = `Загальна кількість кредитів: ${total.toLocaleString()}`;
}

function renderTable() {
  tableBody.innerHTML = '';
  filteredBanks.forEach(bank => {
    const row = `
      <tr>
        <td>${bank.name}</td>
        <td>${bank.clients.toLocaleString()}</td>
        <td>${bank.credits.toLocaleString()}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
  updateTotalCredits();
}

searchInput?.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  filteredBanks = banks.filter(bank => bank.name.toLowerCase().includes(term));
  renderTable();
});

sortSelect?.addEventListener('change', e => {
  const sortType = e.target.value;
  if (sortType === 'clients') filteredBanks.sort((a, b) => b.clients - a.clients);
  else if (sortType === 'credits') filteredBanks.sort((a, b) => b.credits - a.credits);
  renderTable();
});

renderTable();
