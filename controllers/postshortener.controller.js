import crypto from "crypto";
import {
  getAllShortLinks,
  getShortLinkByShortCode,
  insertShortLink,
} from "../services/shortener.services.js";

export const getShortenerPage = async (req, res) => {
  try {
    // const file = await readFile(path.join("views", "index.html"));
    // const links = await loadLinks();
    if(!req.user) return res.redirect("/login");
    const links = await getAllShortLinks({userId: req.user.id});

    // let isLoggedIn = req.headers.cookie;
    // isLoggedIn = isLoggedIn
    // ?.split(";")
    // ?.find((cookie) => cookie.trim().startsWith("isLoggedIn"))
    // ?.split("=")[1];
    
    //get rid of this by using cookie parser

    // console.log(isLoggedIn);

    return res.render("index", { links, host: req.host, errors:[]});
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const postURLShortener = async (req, res) => {
  if(!req.user) return res.redirect("/login");
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    // const links = await loadLinks();
    const link = await getShortLinkByShortCode(finalShortCode);

    if (link) {
      return res
        .status(400)
        .send("Short code already exists. Please choose another.");
    }

    // links[finalShortCode] = url;

    await insertShortLink({ url, shortCode: finalShortCode, userId: req.user.id});
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const redirectToShortLink = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await getShortLinkByShortCode(shortCode);
    console.log("🚀 ~ redirectToShortLink ~ li̥nk:", link);

    if (!link) return res.status(404).send("404 error occurred");

    return res.redirect(link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};
