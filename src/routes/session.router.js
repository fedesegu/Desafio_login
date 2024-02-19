import { Router } from "express";
import { usersManager } from "../dao/mongoDB/usersManagerDB.js";
import { hashData} from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/signup",(req, res, next)=>{ passport.authenticate("signup", {
        successRedirect: '/api/views/home',
        failureRedirect: '/api/views/error'
        })(req, res, next)
    });
    
router.post('/login', (req, res, next) => {
    passport.authenticate('login', { 
        successRedirect: '/api/views/home',
        failureRedirect: '/api/views/error'
    })(req, res, next);
});
    

router.get("/auth/github", passport.authenticate("github", { 
    scope: ["user:email"] })
);

router.get("/callback", passport.authenticate("github"), (req, res) => {
    res.redirect("/api/views/home");
});

router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/api/views/login");
    });
});

router.post("/restaurar", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return res.redirect("/api/session/signup");
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.redirect("/api/views/login")
        } catch (error) {
        res.status(500).json({ error });
    }
});


export default router;