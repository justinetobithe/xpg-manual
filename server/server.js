import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "xpg-manual",
});

/** NEW: distinct categories (with counts) */
app.get("/api/categories", async (_req, res) => {
    try {
        const [rows] = await db.execute(
            `
      SELECT category, COUNT(*) AS count
      FROM xpgml_games
      GROUP BY category
      ORDER BY category
      `
        );
        res.json(rows); // [{ category: "Baccarat", count: 12 }, ...]
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

/** UPDATED: allow filtering by category and q (search) */
app.get("/api/games", async (req, res) => {
    try {
        const { category, q } = req.query;

        const where = [];
        const params = [];

        if (category && category !== "All") {
            where.push("category = ?");
            params.push(category);
        }

        if (q && q.trim()) {
            where.push(
                "(LOWER(CONCAT(COALESCE(iname1,''), ' ', COALESCE(itext,''))) LIKE ?)"
            );
            params.push(`%${q.toLowerCase()}%`);
        }

        const sql = `
      SELECT *
      FROM xpgml_games
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY iline
    `;

        const [rows] = await db.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

app.get("/api/images", async (_req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM xpgml_image ORDER BY img_id"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});
 
app.get("/api/games/:iurl", async (req, res) => {
    try {
        const { iurl } = req.params;
        const [rows] = await db.execute(
            "SELECT * FROM xpgml_games WHERE iurl = ? LIMIT 1",
            [iurl]
        );
        if (!rows.length) return res.status(404).json({ error: "Not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});


const gamesPath = path.resolve(__dirname, "../public/games");
app.use("/games", express.static(gamesPath));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
