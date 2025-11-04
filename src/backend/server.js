const path = require("path");
const fs = require("fs");

// Tenta carregar .env de diferentes locais
const possibleEnvPaths = [
  path.join(__dirname, "..", "..", ".env"), // desenvolvimento
  path.join(process.cwd(), ".env"), // raiz do projeto
  path.join(__dirname, ".env"), // mesma pasta do server
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.log("Carregando .env de:", envPath);
    require("dotenv").config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn("Aviso: arquivo .env não encontrado!");
}

const app = require("./api/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API is running on port ${PORT}`);
  console.log(`Server started successfully!`);
});