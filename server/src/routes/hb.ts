import * as express from "express";
import * as controller from "../controllers/hb";
import tc from "../middlewares/trycatch";

const router = express.Router();
router.get(
    "/",
    tc(controller.get)
);

export default router;
