const loadFixture = require("mongoose-fixture-loader");
const User = require("../src/model/user");

const fixtures = {};

//new user model
function getNewUser(username, email, password) {
  const user = new User({
    username,
    email
  });
  user.setPassword(password);

  return user;
}

async function createNewUser(username) {
  const password = "mypassword";
  const user = await loadFixture(
    User,
    getNewUser(username, `${username}@example.com`, password)
  );
  user.password = password;
  return user;
}
async function loadFixtures() {
  fixtures.users = {};
  const usernames = ["tom", "jacky"];
  for (let username of usernames) {
    let user = await createNewUser(username);
    fixtures.users[username] = user;
  }
}

module.exports = {
  fixtures,
  load: loadFixtures
};
