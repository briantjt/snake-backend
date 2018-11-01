require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  errorhandler = require("errorhandler"),
  status = require("http-status"),
  morgan = require("morgan"),
  cookieParser = require("cookie-parser"),
  mongoose = require("mongoose"),
  logger = require("./logger");
const { passport } = require("./middleware/passport_middleware");

const isProduction = process.env.NODE_ENV === "production";

const isMongooseConnectionProvided = process.env.NODE_ENV === "integration";

if (!isMongooseConnectionProvided) {
  mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  );
}

const corsOptions = {
  origin: ["http://localhost:3000", "https://react-snake-124135.herokuapp.com"],
  credentials: true
};
const corsMiddleware = cors(corsOptions);
const app = express();

//middleware stack
app.use(corsMiddleware);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(errorhandler());
}
app.use(passport.initialize());

//routes
const userRouter = require("./routes/user_api");
const scoreRouter = require("./routes/score_api");
app.options("*", corsMiddleware);
app.use("/api/user", userRouter);
app.use("/api/score", scoreRouter);

//error handling
if (!isProduction) {
  app.use(function(err, req, res, next) {
    if (err.stack) {
      logger.error(err.stack);
    }

    res.status(err.status || status.INTERNAL_SERVER_ERROR);

    res.json({ error: err.message });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || status.INTERNAL_SERVER_ERROR);
  res.json({ error: err.message });
});

module.exports = app;
