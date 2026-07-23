import crypto from "crypto";
import {
  findShortLinkById,
  getAllShortLinks,
  getShortLinkByShortCode,
  insertShortLink,
  updateShortCode,
  deleteShortCodeById,
} from "../services/shortener.services.js";
import z from "zod";

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

    return res.render("index", { links, host: req.host, errors: req.flash("errors")});
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const postURLShortener = async (req, res) => {
  if(!req.user) return res.redirect("/login");
  try {
    const { data, error } = shortenerSchema.safeParse(req.body);
    console.log(data, error);

    if (error) {
      const errorMessage = error.errors[0].message;
      req.flash("errors", errorMessage);
      return res.redirect("/");
    }

    const { url, shortCode } = data;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    // const links = await loadLinks();
    const link = await getShortLinkByShortCode(finalShortCode);

    if (link) {
      req.flash(
        "errors",
        "Url with that shortcode already exists, please choose another"
      );
      return res.redirect("/");
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

export const getShortnerEditPage = async(req, res) => {
  if(!req.user) return res.redirect("/login");

  const {data : id, error} = z.coerce.number().int().safeParse(req.params.id);

  if(error){
    console.log("1st one")
    return res.redirect("/404")
  }

  try {
    const shortLink = await findShortLinkById(id);
    if(!shortLink) return res.redirect("/404");

    res.render("edit-shortLink", {
      id: shortLink.id,
      url: shortLink.url,
      shortCode: shortLink.shortCode,
      errors: req.flash("errors"),
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const postShortnerEditPage = async(req, res) => {
  if (!req.user) return res.redirect("/login");
    // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");
  try {
    const {url, shortCode} = req.body;
    const newUpdatedShortCode = await updateShortCode({id, url, shortCode});
    if(!newUpdatedShortCode) res.redirect("/404");

    res.redirect("/");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      req.flash("errors", "Shortcode already exists, please choose another");
      return res.redirect(`/edit/${id}`);
    }

    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

export const deleteShortCode = async(req, res) => {
  try {
    if (!req.user) return res.redirect("/login");
    // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

    await deleteShortCodeById({id});
    res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
}
