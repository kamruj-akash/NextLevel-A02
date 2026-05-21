import app from "./app";
import { config } from "./config";
import { initDb } from "./db";

const server = async () => {
  await initDb();
  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
};

server();
