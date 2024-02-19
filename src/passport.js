import passport from "passport";
import { usersManager } from "./dao/mongoDB/usersManagerDB.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";

passport.use("signup", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
        const { name, lastName } = req.body;
        if (!name || !lastName || !email || !password) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData(password);
            const createdUser = await usersManager.createOne({
            ...req.body,
            password: hashedPassword,
            });
            done(null, createdUser);
        } catch (error) {
            done(error);
        }
        }
    )
);

passport.use("login", new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        const req = this;

        if (!email || !password) {
            return done(null, false);
        }

        try {
            const user = await usersManager.findByEmail(email);
            console.log(user);
            if (!user) {
                return done(null, false);
            }
            
            const isPasswordValid = await compareData(password, user.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                return done(null, false);
            }
            
            return done(null, user);
        } catch (error) {
            return done(error); 
        }
    }
));

passport.use("github", 
        new GithubStrategy(
                {
                clientID: "2e482c1a5af47af1b570",
                clientSecret: "36825220421cdcf4f2b90b47c50ce60f9f29707f",
                callbackURL: "http://localhost:8080/api/session/callback",
                scope: ["user:email"],
                },
                async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    const userDB = await usersManager.findByEmail(profile.emails[0].value);
                    console.log(profile._json.email);
                    console.log(userDB);
                    if (userDB) {
                        if (userDB.isGithub) {
                        return done(null, userDB);
                        } else {
                        return done(null, false);
                        }
                    }
                    const infoUser = {
                        name: profile._json.name.split(" ")[0], 
                        lastName: profile._json.name.split(" ")[1],
                        email: profile._json.email,
                        password: " ",
                        email: profile.emails[0].value,
                        isGithub: true,
                    };
                    const createdUser = await usersManager.createOne(infoUser);
                    done(null, createdUser);
                    } catch (error) {
                    done(error);
                    }
                }
                )
            );
            
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersManager.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});