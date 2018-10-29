const mongoDBMemoryServer = require("mongodb-memory-server").default;
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;

const setup = async () => {
  mongoServer = new mongoDBMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();

  const options = { useNewUrlParser: true, userCreateIndex: true };
  await mongoose
    .connect(
      mongoUri,
      options
    )
    .then(() => console.log("MongoDB is ready"), error => console.error(error));
};

const teardown = () => {
  mongoose.disconnect();
  mongoServer.stop();
};

module.exports = {
  setup,
  teardown
};
