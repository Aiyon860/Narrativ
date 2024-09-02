"use strict"

import { findUser, users } from "../data/user.js"

export function checkUsernameAndPassword(req, res, next) {
  const { username, password } = req.body;

  const user = findUser(users, username, password);

  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render("layouts/main.ejs", { 
      error: {
        title: "Invalid username or password",
        description: "Username or password is not correct, please try again."
      }
    });
  }
}