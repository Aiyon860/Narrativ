"use strict"

import { 
  BlogData, 
  escapeRegExp, 
  findBlog, 
  getBlogIndexById, 
  getSearchedBlogs 
} from "../data/blog.js"

import { 
  modifyBlogContent, 
  searchUserBlogIndexById, 
  separateTags 
} from "../utils/helpers.js";

export function insertBlog(req, res, next) {
  const { title, subtitle, content, category, tags, imageSize, imageSizeUnit, base64image } = req.body;
  const author = req.session.user;
  const name = author._data.username;
  const bio = author._data.bio;
  const [imageTitle, imageExtension] = req.body.imageTitle.split('.');
  
  const blogObj = new BlogData(
    title, 
    subtitle, 
    modifyBlogContent(content), 
    category, 
    separateTags(tags), 
    { imageTitle, imageExtension, imageSize, imageSizeUnit, base64image }, 
    { name, bio }
  );

  console.log(blogObj);

  author._data.blogs.push(blogObj);

  console.log("\n|\n|\n+-----> BLOG HAS BEEN SAVED SUCCESSFULLY\n");
  
  req.session.user = author;
  req.session.isPostExist = true;
    
  res.status(200).redirect('/');
}

export function updateBlog(req, res, next) { 
  const { title, subtitle, content, category, tags, imageSize, imageSizeUnit, base64image } = req.body;

  const user = req.session.user;
  const id = req.params.id;

  const [imageTitle, imageExtension] = req.body.imageTitle.split('.');
  const idx = getBlogIndexById(user._data.blogs, parseFloat(id));

  const blogData = user._data.blogs[idx];

  blogData._data.title                    = title;
  blogData._data.subtitle                 = subtitle;
  blogData._data.content                  = modifyBlogContent(content),
  blogData._data.category                 = category;
  blogData._data.tags                     = separateTags(tags);
  blogData._data.image.imageTitle         = imageTitle;
  blogData._data.image.imageExtension     = imageExtension;
  blogData._data.image.imageSize          = imageSize;
  blogData._data.image.imageSizeUnit      = imageSizeUnit;
  blogData._data.image.base64image        = base64image;
  blogData._data.updatedAt                = new Date().toUTCString();

  console.log("\n|\n|\n+-----> BLOG HAS BEEN UPDATED SUCCESSFULLY\n");
  console.log(blogData);

  
  req.session.user = user;

  res.status(200).json(
    { 
      statusCode: 200,
      method: "PUT",
      message: "Blog post updated successfully",
    }
  );
}

export function searchBlog(req, res, next) {
  const safeQuery = escapeRegExp(req.query.q);
  const user = req.session.user;
  const blogsFiltered = getSearchedBlogs(user._data.blogs, safeQuery);
  req.session.isSearchingPost = true;

  res.status(200).render(
    "layouts/main.ejs",
    {
      user            : req.session.user,
      isSearchingPost : req.session.isSearchingPost,
      isPostExist     : req.session.isPostExist,
      blogs           : blogsFiltered,
      query           : safeQuery,
    }
  );
}

export function deleteBlog(req, res, next) {
  const blogId = parseFloat(req.params.id);
  const user = req.session.user;
  const blogIdx = searchUserBlogIndexById(user._data.blogs, blogId);
  
  user._data.blogs.splice(blogIdx, 1);
  req.session.user = user;

  console.log(req.session.user);
  
  console.log("\n|\n|\n+-----> BLOG HAS BEEN DELETED SUCCESSFULLY\n");

  const data = {
    user: req.session.user,
    isPostExist: true,
  };

  if (user._data.blogs.length === 0) {
    req.session.isPostExist = false;
    data.isPostExist = false;
  }

  res.status(200).render("layouts/main.ejs", data);
}