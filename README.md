# e-Service Plesk Plus — GitHub marketplace

Repository preparato per importare il plugin **e-Service Plesk Plus** senza modificare l’installazione Business esistente.

## Sicurezza

Questo repository **non contiene la password Plesk**. Il server MCP legge le credenziali dalle variabili d’ambiente Windows:

- `E_SERVICE_PLESK_API_URL`
- `E_SERVICE_PLESK_USERNAME`
- `E_SERVICE_PLESK_PASSWORD`

La configurazione MCP usa il Node.js locale in `C:\Program Files\nodejs\node.exe` e avvia il codice dalla copia locale già preparata in `C:\Codex\plugins\e-service-plesk-mcp`.

## Struttura

```text
.agents/plugins/marketplace.json
plugins/e-service-plesk-plus/
  .codex-plugin/plugin.json
  .mcp.json
  package.json
  src/
```

## Importazione

1. Crea un repository GitHub **privato** vuoto.
2. Carica il contenuto di questa cartella nella radice del repository, mantenendo `.agents` e `plugins`.
3. Nel prodotto che espone l’import marketplace GitHub, usa l’URL del repository come **Source** e lascia **Path** vuoto, perché `.agents/plugins/marketplace.json` è nella radice.
4. Importa il marketplace e installa **e-Service Plesk Plus** se viene mostrato come disponibile.
5. In Codex Desktop/ChatGPT compatibile, verifica che il plugin sia selezionabile e prova prima `plesk_get_configured_scope`, che non contatta Plesk.

## Nota

Questa variante ha identità distinta dalla copia Business:

- Business: `e-service-plesk-mcp@personal`
- Plus: `e-service-plesk-plus`

Non modificare o rimuovere il marketplace `personal` già usato da Business.
