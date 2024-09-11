"use strict"

import { User as UserModel } from "../models/index.js"

class UserData {
  /** 
   * @param {string} id
   * @param {string} username
   * @param {string} password
  */

  constructor(id, username, password, bio) {
    const blogs = new Array(0);
    this._data = { ...UserModel, id, username, password, bio, blogs }
  }

  get username() {
    return this._data["username"];
  }

  get password() {
    return this._data["password"];
  }
}

export const users = [
  new UserData(
    "0001", 
    "Daniel", 
    "danielsukakucing", 
    "Astrophysicist by day, competitive origami artist by night. When not unraveling the mysteries of the cosmos or folding intricate paper creations, Emma can be found teaching her cat to play chess."
  ),
  new UserData(
    "0002", 
    "Tirza", 
    "tirzasukaanjing", 
    "Former circus clown turned award-winning pastry chef. Liam brings the joy and whimsy of the big top to his decadent desserts, and is known for his gravity-defying cake sculptures that make guests laugh and gasp in equal measure."
  )
]

export function findUser(users, username, password) {
  return users.find(
    (user) => user["username"] === username && user["password"] === password
  );
}