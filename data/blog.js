"use strict"

import { Blog as BlogModel } from "../models/index.js"

export class BlogData {
  /** 
   * @param {string} title
   * @param {string} subtitle
   * @param {string} content
   * @param {string} category
   * @param {string[]} tags
   * @param {object} image
   * @param {string} author
  */

  constructor(id, title, subtitle, content, category, tags, image, author) {
    const createdAt = new Date().toUTCString();
    const updatedAt = new Date().toUTCString();
    this._data = { 
      ...BlogModel, id, title, subtitle, 
      content, category, tags, image, 
      createdAt, updatedAt, author 
    };
  }
}

export function findBlog(blogs, id) {
  return blogs.find((blog) => blog.id === id);
}
