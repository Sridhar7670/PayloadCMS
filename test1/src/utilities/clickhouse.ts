// src/utils/clickhouse.ts
import { createClient } from '@clickhouse/client';

export const clickhouse = createClient({
  //using the very same server comp values 
  url: 'http://localhost:8123', 
  username: 'myuser', 
  password: 'secure_password_123',
  database: 'analytics_db',
});


(async () => {
  try {
    const result = await clickhouse.query({ query: 'SELECT version()' });
    console.log(await result.json());
  } catch (err) {
    console.error('ClickHouse connection failed:', err);
  }
})();

// export const clickhouse = createClient({
//   host: process.env.CLICKHOUSE_HOST!,
//   username: process.env.CLICKHOUSE_USER!,
//   password: process.env.CLICKHOUSE_PASSWORD!,
//   database: process.env.CLICKHOUSE_DB!,
// });
