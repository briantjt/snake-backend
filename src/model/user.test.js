const mongo_test = require("../../test_helper/in_memory_mongodb_setup");

const ValidationError = require("mongoose").ValidationError;

beforeAll(mongo_test.setup);
afterAll(mongo_test.teardown);

const User = require("./user");

describe("User Model", () => {
  const username = "kevin";
  const email = "kevin@example.com";
  let user = new User({ username, email });

  it("new user can be saved", async () => {
    await expect(user.save()).resolves.toBe(user);
  });

  it("can be searched by id", async () => {
    let searchResult = await User.findById(user._id);
    expect(searchResult.username).toBe(user.username);
    expect(searchResult.email).toBe(user.email);
  });

  it("can be searched by username", async () => {
    let searchResult = await User.findOne({ username: user.username });
    expect(searchResult.username).toBe(user.username);
    expect(searchResult.email).toBe(user.email);
  });

  it("can be searched by email", async () => {
    let searchResult = await User.findOne({ email: user.email });
    expect(searchResult.username).toBe(user.username);
    expect(searchResult.email).toBe(user.email);
  });

  it("can be updated", async () => {
    const newEmail = "newemail@example.com";
    user.email = newEmail;
    await user.save();
    expect(user.email).toBe(newEmail);
  });

  it("can be deleted", async () => {
    await user.remove();
    let searchResult = await User.findOne({ username: user.username });
    expect(searchResult).toBeNull();
  });
});

describe("Unique fields in User model", () => {
  const username1 = "kevin";
  const email1 = "kevin@example.com";

  const username2 = "gordon";
  const email2 = "gordon@example.com";

  let user1 = new User({ username: username1, email: email1 });

  beforeEach(async () => await user1.save());
  it("should not allow two users with the same name", async () => {
    let userWithSameName = new User({ username: username1, email: email2 });
    await expect(userWithSameName.save()).rejects.toThrow(
      "username: Should be unique"
    );
  });
  it("should not allow two users with the email", async () => {
    let userWithSameEmail = new User({ username: username2, email: email1 });
    await expect(userWithSameEmail.save()).rejects.toThrow(ValidationError);
  });
});

describe("Some fields in User model are case insensitive", () => {
  const username1 = "joe";
  const email1 = "joe@example.com";

  const username2 = "jack";
  const email2 = "jack@example.com";

  let user1 = new User({ username: username1, email: email1 });

  beforeEach(async () => await user1.save());

  test("username is case insensitive", async () => {
    let userWithSameNameButDifferentCase = new User({
      username: username1.toUpperCase(),
      email: email2
    });
    await expect(userWithSameNameButDifferentCase.save()).rejects.toThrow(
      ValidationError
    );
  });

  test("email is case insensitive", async () => {
    let userWithSameEmailButDifferentCase = new User({
      username: username2,
      email: email1.toUpperCase()
    });
    await expect(userWithSameEmailButDifferentCase.save()).rejects.toThrow(
      ValidationError
    );
  });
});

describe("Email has to be name@domain.com", () => {
  test("invalid email throws error", async () => {
    let invalidEmail = new User({
      username: "hunter2",
      email: "abcbasfasb.com"
    });
    await expect(invalidEmail.save()).rejects.toThrow("Invalid email provided");
  });
});

describe("Some of the fields in User model are required", () => {
  const username1 = "peter";
  const email1 = "peter@example.com";

  test("username is required", async () => {
    let userWithoutName = new User({
      email: email1
    });
    await expect(userWithoutName.save()).rejects.toThrow(ValidationError);
  });

  test("email is required", async () => {
    let userWithoutEmail = new User({
      username: username1
    });
    await expect(userWithoutEmail.save()).rejects.toThrow(ValidationError);
  });
});

describe("Setting and validation of password field on User model", () => {
  const username = "kate";
  const email = "kate@example.com";
  const password = "mypassword";

  let user = new User({ username, email });

  beforeEach(async () => {
    await user.save();
  });

  it("should save user passwords into hash and salt fields of User model", async () => {
    expect(user.passwordSalt).toBeUndefined();
    expect(user.passwordHash).toBeUndefined();

    user.setPassword(password);

    expect(user.passwordSalt).toBeDefined();
    expect(user.passwordSalt).not.toBeNull();
    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBeNull();
  });

  it("should be able to verify user password afterwards", () => {
    console.log(user.validPassword(password))
    expect(user.validPassword(password)).toBeTruthy();
  });
});

describe("JWT Tokens", () => {
  const username = "jeff";
  const email = "jeff@example.com";
  const user = new User({ username, email });

  beforeEach(async () => {
    await user.save();
  });

  test("JWT Tokens can be generated and verified", () => {
    const token = user.generateJWT();
    expect(user.verifyJWT(token)).toBeTruthy();
  });

  test("invalid JWT tokens are rejected", () => {
    expect(user.verifyJWT("garbage token")).toBeFalsy();
  });
});
