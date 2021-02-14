import * as express from "express";
import validation from "../middlewares/validation";
import tc from "../middlewares/trycatch";
import * as controller from "../controllers/user";

const router = express.Router();

router.post("/login", [validation], tc(controller.login));
router.get("/me", [validation], tc(controller.getMe));

export default router;
