import * as express from "express";
import validation from "../middlewares/validation";
import tc from "../middlewares/trycatch";
import * as controller from "../controllers/offer";
import { OfferModel as Model } from "../models/offer";

import {
  checkOneOfRequired,
  checkBody,
  nonEmptyBodyCheck,
} from "../utils/routeUtils";

import {
  idParamCheck,
} from "../utils/routeCommonTypesUtils";

const router = express.Router();

router.get("/", [validation], tc(controller.getAll));
router.get("/:id", [idParamCheck("id"), validation], tc(controller.get));

router.post(
  "/",
  [validation],
  tc(controller.create)
);

router.put(
  "/:id",
  [
    idParamCheck("id"),
    nonEmptyBodyCheck,
    checkOneOfRequired(Model.columnNames),
    validation,
  ],
  tc(controller.update)
);

router.delete("/:id", tc(controller.remove));

export default router;
