import { daoFactory } from "../models/Dao/index.js";
import { JWT_UTILS } from "../utils/index.js";

const userDao = daoFactory.getSelectedDao("users");

const isValidAuthToken = async (req, res, next) => {
  try {
    const { tokenCookie } = req.cookies;

    const verifiedToken = tokenCookie && JWT_UTILS.verifyToken(tokenCookie, "secret");

    if (!verifiedToken) {
      throw new Error("Unauthorized");
    }

    const user = await userDao.getById(verifiedToken.id);

    if (!user) {
      throw new Error("Unauthorized");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).render("Unauthorized");
  }
};

export { isValidAuthToken };
