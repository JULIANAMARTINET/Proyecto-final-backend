import { daoFactory} from "../Dao/index.js";
import { JWT_UTILS } from "../utils/index.js";


const userDao = daoFactory.getSelectedDao("users");

const isValidAuthToken = async (req, res, next) => {
  try {
    const { tokenCookie } = req.cookies;

    if (!tokenCookie) {
      throw new Error("Unauthorized");
    }

    const verifiedToken = JWT_UTILS.verifyToken(tokenCookie, "secret");

    if (!verifiedToken) {
      throw new Error("Unauthorized");
    }

    const user = await userDao.getById(verifiedToken.id);

    if (!user) {
      console.log("aqui?")
      throw new Error("Unauthorized");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    
    res.status(401).render("Unauthorized");
  }
};

export { isValidAuthToken};
