import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('esmos-monitor up');
});

export default app;
