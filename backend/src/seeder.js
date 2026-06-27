require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

// Koneksi tanpa database dulu, biar bisa CREATE DATABASE
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
});

const dbName = process.env.DB_NAME || "pengaduan";

async function seed() {
  console.log("Memulai seeder...\n");

  // 1. Buat database kalau belum ada
  await query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(`✅ Database '${dbName}' siap.\n`);

  await query(`USE \`${dbName}\``);

  // 2. Buat tabel users kalau belum ada
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log(`✅ Tabel 'users' siap.\n`);

  // 3. Buat tabel reports kalau belum ada
  await query(`
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100),
      status ENUM('pending', 'proses', 'selesai') DEFAULT 'pending',
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log(`✅ Tabel 'reports' siap.\n`);

  // 4. Insert akun default
  const users = [
    { username: "superadmin", email: "superadmin@laporan.com", password: "superadmin123", role: "super_admin" },
    { username: "admin",      email: "admin@laporan.com",      password: "admin123",      role: "admin"      },
    { username: "user",       email: "user@laporan.com",       password: "user123",        role: "user"       },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await query(
      `INSERT INTO users (username, email, password, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username = VALUES(username)`,
      [u.username, u.email, hash, u.role]
    );
    console.log(`✅ Akun berhasil dibuat:`);
    console.log(`   Username : ${u.username}`);
    console.log(`   Email    : ${u.email}`);
    console.log(`   Password : ${u.password}`);
    console.log(`   Role     : ${u.role}`);
    console.log("");
  }

  connection.end();
  console.log("Seeder selesai.");
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

seed().catch((err) => {
  console.error("❌ Seeder error:", err.message);
  connection.end();
});
