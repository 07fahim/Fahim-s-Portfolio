import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Built on the first request, not at import: `next build` imports this route, and the GitHub secrets it checks may not exist yet (they are added when the admin goes live).
let handler: ReturnType<typeof makeRouteHandler> | undefined;
const get = () => (handler ??= makeRouteHandler({ config }));
export const GET = (req: Request) => get().GET(req);
export const POST = (req: Request) => get().POST(req);
