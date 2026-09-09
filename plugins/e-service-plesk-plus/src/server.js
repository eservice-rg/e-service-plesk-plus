import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getConfig } from "./config.js";
import { PleskXmlClient } from "./plesk-xml-client.js";

const CONFIRMATION = "I_UNDERSTAND_THIS_CAN_CHANGE_PLESK";
const text = value => ({ content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] });
const config = () => getConfig();
const client = () => new PleskXmlClient(config());
const server = new McpServer({ name: "e-service-plesk", version: "1.0.0" });

server.registerTool("plesk_get_configured_scope", { description: "Mostra endpoint e account configurati senza contattare Plesk.", inputSchema: {}, annotations: { readOnlyHint: true } }, async () => { const c = config(); return text({ apiUrl: c.apiUrl, username: c.username }); });
server.registerTool("plesk_list_subscriptions", { description: "Elenca le subscription visibili all'account configurato.", inputSchema: {}, annotations: { readOnlyHint: true } }, async () => text(await client().listSubscriptions()));
server.registerTool("plesk_get_subscription", { description: "Legge dettagli o permessi della subscription selezionata.", inputSchema: { subscription: z.string().min(1).max(253), view: z.enum(["details", "permissions"]) }, annotations: { readOnlyHint: true } }, async ({ subscription, view }) => text(await client().getSubscription(subscription, view)));
server.registerTool("plesk_execute_xml", { description: "Esegue XML Plesk. Può modificare o eliminare risorse e richiede la frase di conferma esatta.", inputSchema: { xml: z.string().min(1).max(262144), confirmation: z.literal(CONFIRMATION) }, annotations: { destructiveHint: true } }, async ({ xml }) => text(await client().execute(xml)));
await server.connect(new StdioServerTransport());
