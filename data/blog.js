"use strict"

import { Blog as BlogModel } from "../models/index.js"

export class BlogData {
  /** 
   * @param {number} id
   * @param {string} title
   * @param {string} subtitle
   * @param {string} content
   * @param {string} category
   * @param {string[]} tags
   * @param {object} image
   * @param {object} author
  */

  static idCounter = 0;

  constructor(title, subtitle, content, category, tags, image, author) {
    const id = ++BlogData.idCounter;
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
  return blogs.find((blog) => blog._data.id === id);
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getBlogIndexById(blogs, id) {
  return blogs.findIndex((blog) => blog._data.id === id);
}

export function getSearchedBlogs(blogs, safeQuery) {
  const regex = new RegExp(`\\b${safeQuery}\\b`, "gi");
  const searchResult = [];
  
  for (let i = 0; i < blogs.length; ++i) {
    if (blogs[i]._data.title.match(regex)) {
      searchResult.push(blogs[i]);
    }
  }

  return searchResult;
}