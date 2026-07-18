import path from "path";
import { comparePassword, createUser, generateToken, getUserByEmail, hashPassword } from "../services/auth.services.js";

export const getRegisterPage = (req, res) => {
  if(res.user) res.redirect("/");
  return res.render("auth/register", {
    errors: req.flash("errors")
  });
};

export const postRegister = async (req, res) => {
  if(res.user) res.redirect("/");
  console.log(req.body);
  const {name, email, password} = req.body;

  const userExists = await getUserByEmail(email);

  if(userExists) console.log("user already exists bruhh plzz change your email",userExists)

  if(userExists){
    req.flash("errors", "user already exists");
    return res.redirect("/register");
  } 

  const hashedPassword = await hashPassword(password);
  const [user] = await createUser({name, email, hashedPassword});
  console.log(user);

  res.redirect("/login");
}

export const getLoginPage = (req, res) => {
  if(res.user) res.redirect("/");
  return res.render("auth/login", {
    errors: req.flash("errors")
  });
};

export const postLogin = async (req, res) => {
  if(res.user) res.redirect("/");
  const { email, password} = req.body;

  const user = await getUserByEmail(email);
  console.log("user", user);

  if(!user){
    req.flash("errors", "Invalid email or password");
    return res.redirect("/login");
  } 

  const isPasswordValid = await comparePassword(password, user.password);

  if(!isPasswordValid){
    req.flash("errors", "Invalid email or password");
    return res.redirect("/login");
  } 

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  res.cookie("access_token", token);

  // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;");
  res.redirect("/");
};

export const getMe = (req, res) => {
  if(!req.user) return res.send("Not logged in bruhh");

  return res.send(`<h1>Hey ${req.user.name} your mail is:${req.user.email} </h1>`);
}

export const logoutUser = (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/login");
}