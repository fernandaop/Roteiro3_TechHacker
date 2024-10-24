// Função para mostrar as informações coletadas no popup
function mostrarResultado(dados) {
    const conexoesDeTerceiros = dados.conexoesDeTerceiros.length
      ? dados.conexoesDeTerceiros.join(', ')
      : 'Nenhuma detectada';
  
    document.getElementById('resultado').innerHTML = `
      <p><strong>Pontuacao de privacidade:</strong> ${dados.pontuacao}</p>
      <p><strong>Total de cookies:</strong> ${dados.totalCookies}</p>
      <p><strong>Cookies de terceira parte:</strong> ${dados.thirdPartyCookies}</p>
      <p><strong>Uso de armazenamento local:</strong> ${dados.storageUsage} itens</p>
      <p><strong>Canvas Fingerprinting detectado:</strong> ${dados.canvasFingerprinting ? 'Positivo' : 'Negativo'}</p>
      <p><strong>Conexoes de terceiros:</strong> ${conexoesDeTerceiros}</p>
    `;
  }
  
  // Enviar uma mensagem ao background.js para iniciar as verificações
  chrome.runtime.sendMessage({action: 'verificar'}, function(response) {
    if (response) {
      mostrarResultado(response);
    } else {
      document.getElementById('resultado').textContent = 'Erro ao verificar privacidade.';
    }
  });
  
