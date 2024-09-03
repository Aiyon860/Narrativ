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
