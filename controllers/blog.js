"use strict"

import { BlogData } from "../data/blog.js"
import { findUser, users } from "../data/user.js";
import { separateTags } from "../utils/helpers.js";

export function insertBlog(req, res, next) {
  const { title, subtitle, content, category, tags, imageTitle, base64image } = req.body;
  const author = req.session.user;
  
  const user = findUser(users, author._data.username, author._data.password);

  const blogObj = new BlogData(user._data.blogs.length + 1, title, subtitle, content, category, separateTags(tags), { imageTitle, base64image }, author._data.username);

  user._data.blogs.push(blogObj);

  console.log("\n|\n|\n+-----> BLOG HAS BEEN SAVED SUCCESSFULLY\n");
  console.log(user);
  console.log(blogObj);

  req.session.user = user;
  req.session.isPostExist = true;
  
  res.status(403).redirect("/");
}