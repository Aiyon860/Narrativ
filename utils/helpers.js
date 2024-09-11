"use strict"

// Create/Update Blog
export function separateTags(text) {
  const regex = /\s*,\s*/;
  return text.split(regex);
}

// Make a Persistance Blog Content's Format
export function modifyBlogContent(text) {
  return text.split(/\n/).filter((paragraph) => paragraph.trim() !== '');
}

export function searchUserBlogIndexById(blogs, targetId) {
  let left = 0;
  let right = blogs.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const blogId = blogs[mid]._data.id;

    if (blogId === targetId) {
      return mid;
    } else if (blogId < targetId) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}