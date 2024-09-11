"use strict"

import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(session({
  secret: "if you see this you\'re gay",
  resave: false,
  saveUninitialized: true
}));
app.use(express.static("public"));
app.use(express.static("bower_components/bootstrap"));
app.use(express.static("bower_components/jquery"));
app.use(express.static("bower_components/components-font-awesome"));
app.use(authRoutes);
app.use(blogRoutes);

const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const checkIfPostExist = (req, res, next) => {
  req.session.isViewingPost = false;
  req.session.isEditingPost = false;

  if (req.session.isPostExist) {
    res.status(200).render(
      "layouts/main.ejs", 
      { 
        user: req.session.user, 
        isPostExist: req.session.isPostExist 
      }
    );
  } else {
    next();
  }
};

app.get("/", requireLogin, checkIfPostExist, (req, res) => {
  res.status(200).render(
    "layouts/main.ejs", 
    { 
      user: req.session.user, 
      isViewingPost: req.session.isViewingPost 
    });
});


app.listen(port, () => {
  console.log(`|\n+---> Server running on http://localhost:${port} ✅\n`);
});