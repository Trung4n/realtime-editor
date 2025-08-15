import http from "http";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/index.js";
// import { initSocket } from "./sockets/index.js";

const bootstrap = async () => {
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);
  //   initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
