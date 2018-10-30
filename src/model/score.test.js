const Score = require("./score");
const User = require("./user");
const mongo_test = require("../../test_helper/in_memory_mongodb_setup");

beforeAll(mongo_test.setup);
afterAll(mongo_test.teardown);

describe("Leaderboard model", () => {
  const username = "kevin";
  const email = "kevin@example.com";
  let user = new User({ username, email });
  test("should save a score with a user id", async () => {
    await user.save();
    let score = new Score({ score: 2000, user: user._id });
    await expect(score.save()).resolves.toBe(score);
  });

  test("Should not save a document with the same score and same userID", async () => {
    let score2 = new Score({ score: 2000, user: user._id });
    await expect(score2.save()).rejects.toThrow();
  });


});
