const app = require("./app");
const logger = require("./logger")

const server = app.listen(process.env.PORT || 3001, function() {
  // @ts-ignore
  logger.info("Listening on port " + server.address().port);
});