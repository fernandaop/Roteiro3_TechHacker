document.addEventListener('DOMContentLoaded', () => {
    // Obtém os dados armazenados no armazenamento local
    browser.storage.local.get(['thirdPartyCount', 'firstPartyCount', 'thirdPartyCookies'], (data) => {
        document.getElementById('thirdPartyCount').textContent = data.thirdPartyCount || 0;
        document.getElementById('firstPartyCount').textContent = data.firstPartyCount || 0;
        document.getElementById('thirdPartyCookies').textContent = data.thirdPartyCookies || 0;
    });
});
