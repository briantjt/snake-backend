process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup"),
  fixtureLoader = require("../test_helper/fixtures"),
  fixtures = require("../test_helper/fixtures").fixtures,
  request = require("supertest"),
  app = require("../src/app"),
  status = require("http-status");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);
afterAll(testDB.teardown);

async function loginAsTom(password, agent) {
  let email = fixtures.users.tom.email;
  let response = await agent
    .post("/api/user/login")
    .send({ user: { email: email, password: password } });

  expect(response.statusCode).toBe(status.OK);
}

test("should clear cookie on logout", async () => {
  const agent = request.agent(app);
  await loginAsTom(fixtures.users.tom.password, agent);

  let logoutResponse = await agent.post("/api/user/logout").send();
  // @ts-ignore
  expect(logoutResponse.statusCode).toBe(status.OK);
  const newPassword = "new-password";
  const updatedUser = { password: newPassword };
  let changePwdRes = await agent
    .put("/api/user/change_password")
    .send({ user: updatedUser });
  // @ts-ignore
  expect(changePwdRes.statusCode).toBe(status.UNAUTHORIZED);
});
