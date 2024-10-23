let thirdPartyDomains = new Set();

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    if (url.origin !== window.location.origin) {
      thirdPartyDomains.add(url.origin);
      console.log(`Conexão a domínio de terceiros: ${url.origin}`);
    }
  },
  { urls: ["<all_urls>"] }
);

browser.cookies.getAll({}, (cookies) => {
  const cookieCount = {
    firstParty: 0,
    thirdParty: 0
  };

  cookies.forEach(cookie => {
    if (cookie.domain === window.location.hostname) {
      cookieCount.firstParty++;
    } else {
      cookieCount.thirdParty++;
    }
  });

  console.log(`Cookies de primeira parte: ${cookieCount.firstParty}`);
  console.log(`Cookies de terceira parte: ${cookieCount.thirdParty}`);
});

browser.storage.local.get(['localStorage', 'sessionStorage'], (result) => {
  console.log(`localStorage: ${result.localStorage}`);
  console.log(`sessionStorage: ${result.sessionStorage}`);
});

// Função para detectar Canvas Fingerprinting
function detectCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.fillText("Test", 2, 2);
  const fingerprint = canvas.toDataURL();
  console.log(`Canvas fingerprint: ${fingerprint}`);
}

// Chamar a função
detectCanvasFingerprint();
