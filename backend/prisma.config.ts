import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  earlyAccess: true,
  studio: {
    port: 5555,
  },
  migrate: {
    url: "file:./dev.db",
  },
});
