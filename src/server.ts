import app from "./app";
import { config } from "./config";

const main = async () => {
  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
};

main();
