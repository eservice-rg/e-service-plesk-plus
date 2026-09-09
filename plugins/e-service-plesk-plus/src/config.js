export function getConfig(env = process.env) {
  const apiUrl = env.E_SERVICE_PLESK_API_URL?.trim();
  const username = env.E_SERVICE_PLESK_USERNAME?.trim();
  const password = env.E_SERVICE_PLESK_PASSWORD?.trim();
  if (!apiUrl || !username || !password) throw new Error("Configurazione Plesk incompleta.");
  const url = new URL(apiUrl);
  if (url.protocol !== "https:" || url.search || url.hash) throw new Error("L'endpoint Plesk deve essere HTTPS senza query o frammento.");
  return Object.freeze({ apiUrl: url.href, username, password });
}
