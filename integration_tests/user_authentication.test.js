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

describe("User authentication", () => {
  test("User can login successfully", async () => {
    let email = fixtures.users.tom.email;
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { email, password } });

    let userJson = response.body.user;
    expect(response.statusCode).toBe(status.OK);
    expect(userJson).toBeDefined();
    expect(userJson.email).toBe(email);
    const jwtCookie = [expect.stringMatching(/jwt/)];
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining(jwtCookie)
    );
  });

  test("User cannot log in with invalid email", async () => {
    let email = "bogus@email.com";
    let password = fixtures.users.tom.password;
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { email, password } });

    expect(response.statusCode).toBe(status.UNAUTHORIZED);
    expect(response.body.error.message).toBe("email or password is invalid");
  });

  test("User cannot log in with invalid password", async () => {
    let email = fixtures.users.tom.email;
    let password = "bogus";
    let response = await request(app)
      .post("/api/user/login")
      .send({ user: { email, password } });

    expect(response.statusCode).toBe(status.UNAUTHORIZED);
    expect(response.body.error.message).toBe("email or password is invalid");
  });
});
