const express = require("express");
const User = require("../models/user");
const router = express.Router();

const bcrypt = require("bcrypt");

router.get('/signup', (req,res) => {
    res.render('auth/sign-up.ejs')
});

router.post("/signup", async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const username = req.body.username;

    if (password !== confirmPassword) {
        return res.send('Password do not match');
    }

    const user = await User.findOne({username});
    if (user) {
        return res.send("Username or Password is invaild.");
    }

    const hashedPassword = bcrypt.hashSync(password,10)
    req.body.password = hashedPassword;

    const newUser = User.create(req.body);
    res.send(`Thanks for signing up ${newUser.username}`);
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});
  
  

module.exports = router;