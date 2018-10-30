process.env.NODE_ENV = "integration";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtures = require("../test_helper/fixtures").fixtures;
const loadFixtures = require("../test_helper/fixtures").load;
const app = require("../src/app");
const request = require("supertest");
const status = require("http-status");

beforeAll(testDB.setup);
beforeAll(loadFixtures);
afterAll(testDB.teardown);

async function loginAsTom(password, agent) {
  let email = fixtures.users.tom.email;
  let response = await agent
    .post("/api/user/login")
    .send({ user: { email: email, password: password } });

  expect(response.statusCode).toBe(status.OK);
}
describe("Password Change", () => {
  test("should change password successfully", async () => {
    const agent = request.agent(app);
    await loginAsTom(fixtures.users.tom.password, agent);
    const newPassword = "newpassword";
    const updatedUser = {
      password: newPassword
    };

    let response = await agent
      .put("/api/user/change_password")
      .send({ user: updatedUser })

    expect(response.statusCode).toBe(status.OK);
    const agent2 = request(app);
    await loginAsTom(newPassword, agent2);
  });
});
