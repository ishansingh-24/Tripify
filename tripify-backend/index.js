const { startServer } = require("./src/server");

startServer().catch((error) => {
  console.error("Failed to initialize backend:", error);
  process.exit(1);
});
