import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  eliminarIngreso,
  actualizarIngreso,
  createIngreso,
  getIngreso,
  getIngresoMesActual,
  getIngresos,
  getIngresoPorRangoDeFechas,
} from "../controllers/ingresos.controllers.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";

const router = Router();

router.get("/ingresos", isAuth, isAdmin, getIngresos);

router.get("/ingresos-mes", isAuth, isAdmin, getIngresoMesActual);

router.post(
  "/ingresos/rango-fechas",
  isAuth,
  isAdmin,
  getIngresoPorRangoDeFechas
);

router.get("/ingresos/:id", isAuth, isAdmin, getIngreso);

router.post("/ingresos", isAuth, isAdmin, createIngreso);

router.put("/ingresos/:id", isAuth, isAdmin, actualizarIngreso);

router.delete("/ingresos/:id", isAuth, isAdmin, eliminarIngreso);

export default router;
