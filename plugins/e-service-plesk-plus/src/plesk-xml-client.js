import { XMLParser } from "fast-xml-parser";

const MAX_REQUEST_BYTES = 256 * 1024;
const MAX_RESPONSE_BYTES = 1024 * 1024;
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", processEntities: false });

export function validatePacket(xml) {
  if (typeof xml !== "string" || Buffer.byteLength(xml) > MAX_REQUEST_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("Pacchetto XML non valido.");
  if (!parser.parse(xml, true)?.packet) throw new Error("Il pacchetto deve contenere packet.");
  return xml;
}

export class PleskXmlClient {
  constructor(config) { this.config = config; }
  async execute(xml) {
    const response = await fetch(this.config.apiUrl, { method: "POST", redirect: "error", headers: { "Content-Type": "text/xml", "HTTP_AUTH_LOGIN": this.config.username, "HTTP_AUTH_PASSWD": this.config.password }, body: validatePacket(xml), signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`Plesk ha restituito HTTP ${response.status}.`);
    const output = await response.text();
    if (Buffer.byteLength(output) > MAX_RESPONSE_BYTES || /<!DOCTYPE|<!ENTITY/i.test(output)) throw new Error("Risposta Plesk non valida.");
    if (!parser.parse(output, true)?.packet) throw new Error("Risposta Plesk non valida.");
    return output;
  }
  listSubscriptions() { return this.execute('<?xml version="1.0"?><packet><webspace><get><filter/><dataset><gen_info/></dataset></get></webspace></packet>'); }
  getSubscription(subscription, view) {
    if (!/^[A-Za-z0-9][A-Za-z0-9.-]{0,252}$/.test(subscription)) throw new Error("Subscription non valida.");
    const dataset = view === "permissions" ? "<gen_info/><permissions/>" : "<gen_info/><hosting/><permissions/><php-settings/>";
    return this.execute(`<?xml version="1.0"?><packet><webspace><get><filter><name>${subscription}</name></filter><dataset>${dataset}</dataset></get></webspace></packet>`);
  }
}
