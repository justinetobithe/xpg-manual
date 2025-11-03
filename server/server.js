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

app.get("/api/games", async (_req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM xpgml_games ORDER BY iline"
        );
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

const gamesPath = path.resolve(__dirname, "../public/games");
app.use("/games", express.static(gamesPath));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
