const app = require("./app");
const { config, validateEnv } = require("./config/env");
const { connectToDatabase } = require("./config/db");

async function startServer() {
  validateEnv();
  await connectToDatabase(config.mongodbUri);

  app.listen(config.port, () => {
    console.log(`Tripify backend running on http://localhost:${config.port}`);
  });
}

module.exports = {
  startServer,
};
