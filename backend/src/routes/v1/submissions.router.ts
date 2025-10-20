import express from "express";
const router = express.Router();

import * as submissionsController from "../../controllers/submissions/index.js";

router.get(
  "/injury",
  submissionsController.getInjurySubmissions
);


export default router;
