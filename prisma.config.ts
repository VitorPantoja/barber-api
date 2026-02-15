import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { defineConfig } from 'prisma/config';

// Load .env file using Node's native support (Node 20.6+)
loadEnvFile();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL
  },
  schema: path.join(__dirname, 'prisma', 'schema.prisma')
});
