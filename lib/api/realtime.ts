// Realtime URLs — derive WebSocket endpoints from config + the endpoint registry.
import { WS_BASE } from "./config";
import { Endpoints } from "./endpoints";

export const presenceWsUrl = (userId: string) => `${WS_BASE}${Endpoints.presenceWs(userId)}`;
