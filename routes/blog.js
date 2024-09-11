"use strict"

import express from "express"
import { deleteBlog, insertBlog, searchBlog, updateBlog } from "../controllers/blog.js";
import { findBlog } from "../data/blog.js";

const blogRoutes = express.Router();

blogRoutes.get("/posts", (req, res, next) => {
  res.redirect('/');
});

blogRoutes.get("/posts/new", (req, res, next) => {
  if (req.session.user) {
    res.status(200).render(
      "layouts/main.ejs", 
      { 
        user: req.session.user, 
        isCreatingPost: true 
      }
    );
  } else {
    res.status(403).redirect("back"); // redirect back to "/login" route
  }
});

blogRoutes.route("/posts/:id(\\d+)")
  .get((req, res, next) => {
    const user = req.session.user;
    const blog = findBlog(user._data.blogs, parseFloat(req.params.id));

    if (!blog) {
      res.status(404).send(`<h1>404 Blog Not Found</h1>`);
    } else {
      req.session.isViewingBlog = true;
      res.status(200).render(
        "layouts/main.ejs", 
        { 
          user: req.session.user, 
          isPostExist: req.session.isPostExist,
          isViewingBlog: req.session.isViewingBlog,
          blog,
        }
      )
    }
  })
  .put(updateBlog)
  .delete(deleteBlog);

blogRoutes.get("/posts/:id(\\d+)/edit", (req, res, next) => {
  const user = req.session.user;
  const blog = findBlog(user._data.blogs, parseFloat(req.params.id));
  req.session.isViewingBlog = false;
  req.session.isEditingPost = true;

  if (!blog) {
    res.status(404).send(`<h1>404 Blog Not Found</h1>`);
  } else {
    res.status(200).render(
      "layouts/main.ejs", 
      { 
        user: req.session.user, 
        isEditingPost: req.session.isEditingPost,
        blog,
      }
    )
  }
});

blogRoutes.get("/posts/search", searchBlog);

blogRoutes.post("/posts", insertBlog);

export default blogRoutes;