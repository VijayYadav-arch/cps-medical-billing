/**
 * Astro integration that mocks the cps-dotnet /api/v2/* surface during
 * local dev. In production, Front Door routes /api/v2/* to the backend;
 * in dev there is no backend, so without this middleware every form
 * POST returns 404 and the user can't see the success screen.
 *
 * Active only in dev (apply: 'serve'). No-op in production builds.
 *
 * Endpoints mocked
 *   POST /api/v2/inquiries  -> 200 + simulated 600ms latency
 *   POST /api/v2/newsletter -> 200 + simulated 400ms latency
 *
 * To add a new endpoint, append to MOCK_ROUTES below.
 */

const MOCK_ROUTES = [
  { method: 'POST', path: '/api/v2/inquiries',  delayMs: 600, response: { ok: true, id: 'mock-inquiry-' + Date.now() } },
  { method: 'POST', path: '/api/v2/newsletter', delayMs: 400, response: { ok: true, id: 'mock-news-' + Date.now() } },
];

function readJsonBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default function devApiMock() {
  return {
    name: 'cps-dev-api-mock',
    hooks: {
      'astro:server:setup'({ server, logger }) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? '';
          const path = url.split('?')[0];
          const route = MOCK_ROUTES.find((r) => r.method === req.method && r.path === path);
          if (!route) return next();

          const body = await readJsonBody(req);
          logger.info(`[dev-api-mock] ${req.method} ${path} <- ${JSON.stringify(body).slice(0, 80)}`);

          await new Promise((r) => setTimeout(r, route.delayMs));
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(route.response));
        });
      },
    },
  };
}
