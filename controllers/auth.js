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

    const userInDatabase = await User.findOne({username});
    if (userInDatabase) {
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

router.post("/sign-in", async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    const userInDatabase = await User.findOne({username});
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }

    const vaildPassword = bcrypt.compareSync(password, userInDatabase.password);
    if(!vaildPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };
    
    res.redirect("/");
});

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/")
});
  

module.exports = router;