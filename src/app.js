import express from "express";
import morgan from "morgan";
import ingresosRoutes from "./routes/ingresos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import presupuestoRoutes from "./routes/presupuesto.routes.js";
import tiposRoutes from "./routes/tipo.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import fabricaRoutes from "./routes/fabricas.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { pool } from "./db.js";
import { ORIGIN } from "./config.js";

const app = express();

//middlewaress
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
// Routes
app.get("/", (req, res) => res.json({ message: "welcome to my API" }));
app.get("/api/ping", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  return res.json(result.rows[0]);
});
app.use("/api", authRoutes);
app.use("/api", ingresosRoutes);
app.use("/api", presupuestoRoutes);
app.use("/api", tiposRoutes);
app.use("/api", empleadosRoutes);
app.use("/api", fabricaRoutes);

//error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
