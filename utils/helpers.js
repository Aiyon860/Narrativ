"use strict"

// Create/Update Blog
export function separateTags(str) {
  const regex = /\s*,\s*/;
  return str.split(regex);
}
