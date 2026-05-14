import { Router } from "express";

import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { AnalysisController } from "../controller/analysis.controller.js";
import { container } from "tsyringe";

const router = Router({ mergeParams: true });

const authenticate = container.resolve(Authenticate);
const analysisController = container.resolve(AnalysisController);

// get all analysis table
router.get("/analysis-table", (req, res) =>
  analysisController.getAnalysisTable(req, res),
);

// get all analysis table
router.get("/analysis-kpi-cards", (req, res) =>
  analysisController.getAnalysisKpiCards(req, res),
);

router.get("/analysis-motivation", (req, res) =>
  analysisController.getAnalysisMotivation(req, res),
);

// get all analysis table
router.get("/analysis-chart", (req, res) =>
  analysisController.getAnalysisChart(req, res),
);

// get booking status distribution
router.get("/booking-status-distribution", (req, res) =>
  analysisController.getBookingStatusDistribution(req, res),
);

export default router;
