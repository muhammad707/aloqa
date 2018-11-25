const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const models = require('../models');

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'abc123';


module.exports = passport => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        models.User.findById(jwt_payload.id).then(user => {
            console.log(user.roleId);
            if(!user) {
                return done(null, false)
            }
            return done(null, user);
        }).catch(err => console.log(err));
    }))
}

