"use strict"

export const User = {
  id: String,
  username: String,
  password: String,
  blogs: Object,  // array of objects of "Blog"
};

export const Blog = {
  id: String,
  title: String,
  subtitle: String || null,
  content: String,
  category: String,
  tags: String, // array of strings
  image: Object,
  createdAt: Date,
  updatedAt: Date,
  author: String,
};