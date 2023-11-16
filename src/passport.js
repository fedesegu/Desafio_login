import passport from "passport";
import { usersManager } from "../src/DAO/managerDB/usersManagerDB.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "../src/db/models/users.model.js";



passport.use(
    "signup",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name } = req.body;
            if (!first_name || !last_name || !email || !password) {
                return done(null, false);
            }
            try {
                let isAdmin
                if (email === "adminCoder@coder.com") {
                    isAdmin = true
                } else {
                    isAdmin = false
                }
                const hashedPassword = await hashData(password);
                const createdUser = await usersManager.createUser({
                    ...req.body,
                    password: hashedPassword, isAdmin
                });
                done(null, createdUser);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            if (!email || !password) {
                done(null, false);
            }
            try {
                const user = await usersManager.findUserByEmail(email);
                if (!user) {
                    done(null, false);
                }
                const isPasswordValid = await compareData(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false);
                }
                done(null, user);
                console.log(user)
            } catch (error) {
                done(error);
            }
        }
    )
);

// github
passport.use(
    "github",
    new GithubStrategy(
        {
            clientID: "Iv1.f644c6a8ca45697d",
            clientSecret: "b1bd9e7bd6a2dce7093e372efa128a90d1274066",
            callbackURL: "http://localhost:8080/api/sessions/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userDB = await usersManager.findUserByEmail(profile._json.email);
                if (userDB) {
                    if (userDB.isGithub) {
                        return done(null, userDB);
                    } else {
                        return done(null, false);
                    }
                }
                const infoUser = {
                    first_name: profile._json.name.split(" ")[0], 
                    last_name: profile._json.name.split(" ")[1],
                    email: profile._json.email,
                    password: " ",
                    isGithub: true,
                };
                const createdUser = await usersManager.createUser(infoUser);
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
        const user = await usersManager.findUserByID(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});