import path from "path";
import { comparePassword, createUser, getUserByEmail, hashPassword } from "../services/auth.services.js";

export const getRegisterPage = (req, res) => {
  return res.render("auth/register", {
    errors: [],
    user: null,
  });
};

export const postRegister = async (req, res) => {
  console.log(req.body);
  const {name, email, password} = req.body;

  const userExists = await getUserByEmail(email);

  console.log("user already exists bruhh plzz change your email",userExists)

  if(userExists) return res.redirect("/register");

  const hashedPassword = await hashPassword(password)
  const [user] = await createUser({name, email, hashedPassword});
  console.log(user);

  res.redirect("/login");
}

export const getLoginPage = (req, res) => {
  return res.render("auth/login", {
    errors: [],
    user: null,
  });
};

export const postLogin = async (req, res) => {
  const { email, password} = req.body;

  const user = await getUserByEmail(email);
  console.log("user", user);

  if(!user) return res.redirect("/login");

  const isPasswordValid = await comparePassword(password, user.password);

  if(!isPasswordValid) return res.redirect("/login");

  res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;");
  res.redirect("/");
};