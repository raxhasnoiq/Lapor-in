const db = require("../config/db");

/*
========================
GET ALL REPORTS
========================
*/

exports.getReports = (req, res) => {
  const sql = `
    SELECT
      public_reports.*,
      users.username,
      categories.category_name
    FROM public_reports
    JOIN users
    ON users.id = public_reports.user_id
    JOIN categories
    ON categories.id = public_reports.category_id
    ORDER BY public_reports.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

/*
========================
GET DETAIL REPORT
========================
*/

exports.getDetailReport = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      public_reports.*,
      users.username,
      categories.category_name
    FROM public_reports
    JOIN users
    ON users.id = public_reports.user_id
    JOIN categories
    ON categories.id = public_reports.category_id
    WHERE public_reports.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan",
      });
    }

    res.json(result[0]);
  });
};

/*
========================
CREATE REPORT
========================
*/

exports.createReport = (req, res) => {
  const {
    header,
    body,
    category_id,
  } = req.body;

  const image = req.file
    ? req.file.filename
    : null;

  const sql = `
    INSERT INTO public_reports
    (
      header,
      body,
      image,
      user_id,
      category_id
    )
    VALUES(?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      header,
      body,
      image,
      req.user.id,
      category_id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Laporan berhasil dibuat",
      });
    }
  );
};

/*
========================
UPDATE STATUS REPORT
========================
*/

exports.updateReportStatus = (req, res) => {
  const { status } = req.body;

  const sql = `
    UPDATE public_reports
    SET status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Status laporan berhasil diupdate",
      });
    }
  );
};
/*
========================
DELETE REPORT
========================
*/

exports.deleteReport = (req, res) => {

  const { id } = req.params;

  const sql =
    "DELETE FROM public_reports WHERE id = ?";

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message:
          "Laporan berhasil dihapus",
      });

    }
  );

};

exports.createReply = (
  req,
  res
) => {

  const { id } = req.params;

  const {
    body,
    user_id,
  } = req.body;

  const sql = `
    INSERT INTO comments
    (
      body,
      user_id,
      public_report_id
    )
    VALUES(?,?,?)
  `;

  db.query(
    sql,
    [
      body,
      user_id,
      id,
    ],
    (err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Reply berhasil dibuat",
      });

    }
  );

};

exports.getReplies = (
  req,
  res
) => {

  const { id } = req.params;

  const sql = `
    SELECT
      comments.*,
      users.username,
      users.role
    FROM comments
    JOIN users
    ON users.id =
    comments.user_id
    WHERE public_report_id = ?
    ORDER BY comments.id DESC
  `;

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(result);

    }
  );

};