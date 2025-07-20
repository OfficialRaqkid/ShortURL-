document.addEventListener('DOMContentLoaded', () => {
  const mode = localStorage.getItem('mode') || 'dark';
  document.body.classList.toggle('light', mode === 'light');
  document.getElementById('modeToggle').checked = mode === 'light';

  document.getElementById('modeToggle').addEventListener('change', e => {
    const isLight = e.target.checked;
    document.body.classList.toggle('light', isLight);
    localStorage.setItem('mode', isLight ? 'light' : 'dark');
  });

  loadList();
});

function shortenURL() {
  const url = document.getElementById('urlInput').value.trim();
  const errorBox = document.getElementById('error');
  const resultBox = document.getElementById('result');
  errorBox.classList.add('hidden');
  resultBox.innerHTML = '';

  fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalURL: url })
  })
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(({ status, data }) => {
    if (status !== 200) {
      errorBox.textContent = data.error;
      errorBox.classList.remove('hidden');
    } else {
      const shortURL = `${window.location.origin}/${data.short}`;
      resultBox.innerHTML = `✅ Shortened: <a href="${shortURL}" target="_blank">${shortURL}</a>`;
      saveToList(shortURL);
    }
  })
  .catch(() => {
    errorBox.textContent = "Something went wrong!";
    errorBox.classList.remove('hidden');
  });
}

function saveToList(shortURL) {
  const saved = JSON.parse(localStorage.getItem('shortened') || '[]');
  if (!saved.includes(shortURL)) {
    saved.push(shortURL);
    localStorage.setItem('shortened', JSON.stringify(saved));
    loadList();
  }
}

function loadList() {
  const listBox = document.getElementById('list');
  const saved = JSON.parse(localStorage.getItem('shortened') || '[]');
  listBox.innerHTML = "<h3>Your Shortened URLs:</h3>" + saved.map(link =>
    `<a href="${link}" target="_blank">${link}</a>`).join('');
}
