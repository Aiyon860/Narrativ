"use strict"

import express from "express";
import { checkUsernameAndPassword } from "../controllers/auth.js";

const authRoutes = express.Router();

authRoutes
  .get("/login", (req, res) => {
    if (req.session.user) {
      res.redirect('/');
    } else {
      // go back to login page
      res.render("layouts/main.ejs", { 
        error: {
          title: null,
          description: null
        }
      });
    }
  })
  .post("/login", checkUsernameAndPassword);

export default authRoutes;