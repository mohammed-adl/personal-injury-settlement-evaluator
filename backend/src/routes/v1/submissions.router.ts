import express from "express";
const router = express.Router();

import {
  getAllSubmissionsSchema,
  injuryFormDataSchema,
} from "../../schemas/index.js";
import { validate } from "../../middlewares/index.js";
import * as submissionsController from "../../controllers/submissions/index.js";

router.get(
  "/",
  validate({ query: getAllSubmissionsSchema }),
  submissionsController.getAllSubmissions
);

router.get("/injury", (req, res) => res.send("OK"));

router.post(
  "/injury",
  validate({ body: injuryFormDataSchema }),
  submissionsController.handleInjurySubmissions
);

export default router;
