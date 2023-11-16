import { Router } from "express";
import { usersManager } from "../DAO/managerDB/usersManagerDB.js"
import { hashData, compareData } from "../utils.js";
import passport from "passport";
const router = Router();


router.post(
    "/signup",
    passport.authenticate("signup", {
      successRedirect: "/api/views/products",
      failureRedirect: "/api/views/error",
    })
  );
  
  router.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/api/views/products",
      failureRedirect: "/api/views/error",
    })
  );
  


  // SIGNUP - LOGIN - PASSPORT GITHUB
  
  router.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  

  router.get("/callback", passport.authenticate("github"), (req, res) => {
    res.redirect('/api/views/products');
  });
  

  router.get("/signout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/api/views/login");
    });
  });
  

  router.post("/restaurar", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await usersManager.findUserByEmail(email);      
      if (!user) {        
        return res.redirect("/api/views/restaurar");
      }
      const hashedPassword = await hashData(password);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password updated" });
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  export default router;