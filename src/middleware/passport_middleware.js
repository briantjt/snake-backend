const passport = require("passport"),
  passportJWT = require("passport-jwt"),
  JwtStrategy = passportJWT.Strategy;

const User = require("../model/user");

const { secret } = require("../../config/jwt");

const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret
};

const saveUserInRequest = async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.userid });
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  } catch (error) {
    done(error, false)
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, saveUserInRequest)

passport.use(jwtStrategy);
module.exports = { passport }