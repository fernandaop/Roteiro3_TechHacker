// Este script será injetado em todas as páginas que o usuário visitar
console.log("Content script ativo");

// Escuta o armazenamento local
const localStorageCheck = () => {
  const data = Object.keys(localStorage);
  console.log(`localStorage contém ${data.length} itens.`);
};

const sessionStorageCheck = () => {
  const data = Object.keys(sessionStorage);
  console.log(`sessionStorage contém ${data.length} itens.`);
};

// Executar verificações
localStorageCheck();
sessionStorageCheck();
