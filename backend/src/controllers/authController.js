const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
========================
REGISTER
========================
*/

exports.register = async (req, res) => {

  try {

    const {
      username,
      email,
      password,
    } = req.body;

    const hashPassword =
      await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (
        username,
        email,
        password
      )
      VALUES(?,?,?)
    `;

    db.query(
      sql,
      [
        username,
        email,
        hashPassword,
      ],
      (err, result) => {

        if (err) {
          console.log(err);

          return res.status(500).json({
            message:
              "Register gagal",
          });
        }

        res.json({
          message:
            "Register berhasil",
        });

      }
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Server error",
    });

  }

};

/*
========================
LOGIN
========================
*/

exports.login = (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const sql =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      sql,
      [email],
      async (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            message:
              "Server error",
          });

        }

        if (result.length === 0) {

          return res.status(404).json({
            message:
              "User tidak ditemukan",
          });

        }

        const user = result[0];

        console.log("USER:");
        console.log(user);

        const validPassword =
          await bcrypt.compare(
            password,
            user.password
          );

        console.log(
          "PASSWORD VALID:"
        );
        console.log(validPassword);

        if (!validPassword) {

          return res.status(401).json({
            message:
              "Password salah",
          });

        }

        const token = jwt.sign(
          {
            id: user.id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.json({
          message:
            "Login berhasil",
          token,
          role: user.role,
          username:
            user.username,
        });

      }
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Server error",
    });

  }

};