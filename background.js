// 1. Detecção de Conexões de Terceiros
let conexoesDeTerceiros = new Set();

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const domain = url.hostname;

    // Verificar se o domínio é de terceira parte comparado ao da aba atual
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      const activeTab = tabs[0];
      const activeTabUrl = new URL(activeTab.url);
      if (activeTabUrl.hostname !== domain) {
        console.log("Conexão de terceiro detectada:", domain);
        conexoesDeTerceiros.add(domain); // Armazenar o domínio detectado
      }
    });
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

// 2. Detecção de Cookies de Primeira e Terceira Parte
function verificarCookies(callback) {
  chrome.cookies.getAll({}, function(cookies) {
    let totalCookies = cookies.length;
    let thirdPartyCookies = cookies.filter(cookie => !cookie.domain.includes(location.hostname)).length;

    console.log(`Total de cookies: ${totalCookies}`);
    console.log(`Cookies de terceira parte: ${thirdPartyCookies}`);

    callback(totalCookies, thirdPartyCookies);
  });
}

// 3. Detecção de Armazenamento Local (HTML5 Storage)
function verificarStorage(callback) {
  chrome.tabs.executeScript({
    code: `
      let localStorageData = Object.entries(localStorage).length;
      let sessionStorageData = Object.entries(sessionStorage).length;
      console.log("Local Storage:", localStorageData);
      console.log("Session Storage:", sessionStorageData);
      localStorageData + sessionStorageData;
    `
  }, function(results) {
    callback(results[0]); // Retorna a quantidade total de storage
  });
}

// 4. Detecção de Canvas Fingerprinting
function detectarCanvasFingerprinting(callback) {
  chrome.tabs.executeScript({
    code: `
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      let canvasDetected = false;
      HTMLCanvasElement.prototype.toDataURL = function(...args) {
        console.log("Canvas fingerprinting detectado");
        canvasDetected = true;
        return originalToDataURL.apply(this, args);
      };
      canvasDetected;
    `
  }, function(results) {
    callback(results[0]); // Retorna se fingerprinting foi detectado
  });
}

// 5. Cálculo da Pontuação de Privacidade
function calcularPontuacao(totalCookies, thirdPartyCookies, storageUsage, canvasFingerprinting) {
  let score = 100;

  if (totalCookies > 10) score -= 20;
  if (thirdPartyCookies > 5) score -= 30;
  if (storageUsage > 0) score -= 10;
  if (canvasFingerprinting) score -= 40;

  console.log("Pontuação de Privacidade:", score);
  return score;
}

// 6. Função para chamar todas as verificações juntas
function verificarPrivacidade(callback) {
  verificarCookies((totalCookies, thirdPartyCookies) => {
    verificarStorage((storageUsage) => {
      detectarCanvasFingerprinting((canvasFingerprinting) => {
        const score = calcularPontuacao(totalCookies, thirdPartyCookies, storageUsage, canvasFingerprinting);
        // Passa todas as informações de volta ao popup
        callback({
          pontuacao: score,
          totalCookies: totalCookies,
          thirdPartyCookies: thirdPartyCookies,
          storageUsage: storageUsage,
          canvasFingerprinting: canvasFingerprinting,
          conexoesDeTerceiros: Array.from(conexoesDeTerceiros) // Adiciona domínios de terceiros detectados
        });
      });
    });
  });
}

// Listener para quando o popup é aberto e envia a mensagem "verificar"
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'verificar') {
    verificarPrivacidade((dados) => {
      sendResponse(dados);  // Retorna todas as informações coletadas ao popup
    });
    return true; // Mantém a conexão aberta para resposta assíncrona
  }
});
