"use strict"

import express from "express"
import { insertBlog } from "../controllers/blog.js";
import { findUser } from "../data/user.js";
import { findBlog } from "../data/blog.js";

const blogRoutes = express.Router();

blogRoutes.get("/posts/:id", (req, res, next) => {
  const user = req.session.user;
  const blog = findBlog(user.blogs, req.params.id);
  if (!blog) {
    res.status(404).send(`<h1>404 Blog Not Found</h1>`);
  }
  res.status(200).render("layouts/pages/crud/view-blog.ejs", blog._data);
});

blogRoutes.get("/posts/new", (req, res, next) => {
  if (req.session.user) {
    res.status(200).render(
      "layouts/main.ejs", 
      { user: req.session.user, isCreatingPost: true }
    );
  } else {
    res.status(403).redirect("back"); // redirect back to "/login" route
  }
});

blogRoutes.post("/posts", insertBlog);

export default blogRoutes;