import express from "express";
const router = express.Router();

import * as submissionsController from "../../controllers/submissions/index.js";

router.get("/", submissionsController.getAllSubmissions);

router.get("/injury", (req, res) => res.send("OK"));

router.post(
  "/injury",
  submissionsController.handleInjurySubmissions
);



export default router;
