import { Hono } from 'hono';
import { Dns, resolveDns } from './resolveDns.jsx';

const app = new Hono();


app.get('/:slug', async (c) => {
  const domain = c.req.param('slug') ?? 'garn.dev';
  const records = await resolveDns(domain);
  return c.html(<Dns records={records} domain={domain} />);
});

app.use('/', async (c) => {
    return c.redirect('/garn.dev');
});

Deno.serve(app.fetch);
