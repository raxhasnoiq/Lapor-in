const express = require("express");
const router = express.Router();

const {
  getReports,
  createReport,
  getDetailReport,
  updateReportStatus,
  deleteReport,
  createReply,
  getReplies,
} = require("../controllers/reportController");

const verifyToken = require("../middleware/verifyToken");
const upload = require("../config/multer");

/*
========================
GET ALL REPORTS
========================
*/

router.get("/", getReports);

/*
========================
GET DETAIL REPORT
========================
*/

router.get("/:id", getDetailReport);

/*
========================
CREATE REPORT
========================
*/

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  createReport
);

/*
========================
UPDATE STATUS REPORT
========================
*/

router.put(
  "/:id",
  updateReportStatus
);


router.delete("/:id", deleteReport);


router.get(
  "/:id/replies",
  getReplies
);

router.post(
  "/:id/reply",
  createReply
);



module.exports = router;