import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email,email));

  return user;
};

export const createUser = async ({name, email, hashedPassword}) => {
  return await db.insert(usersTable).values({name,email,password: hashedPassword})
    .$returningId();
}

export const hashPassword = async (password) => {
  return await argon2.hash(password);
}

export const comparePassword = async (password, hash) => {
  return await argon2.verify(hash, password); // in argon2 hash should come first but in bcrypt password should come first...
}
export const generateToken = ({id,name,email}) => {
  return jwt.sign({id,name,email}, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

// verify jwt token
export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
}