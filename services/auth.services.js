import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { argon2 } from "argon2";

export const getUserByEmail = async (email) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email,email));

  return user;
};

export const createUser = async ({name, email, password}) => {
  return await db.insert(usersTable).values({name,email,password})
    .$returningId();
}

export const hashPassword = (password) => {
  return await argon2.hash(password);
}

export const comparePassword = (password, hash) => {
  return await argon2.verify(hash, password); // in argon2 hash should come first but in bcrypt password should come first...
}