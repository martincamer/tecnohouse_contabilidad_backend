import Router from "express-promise-router";
import {
  actualizarPresupuesto,
  createPresupuesto,
  eliminarGasto,
  getPresupuesto,
  getPresupuestoMesActual,
  getPresupuestoPorMes,
  getPresupuestoPorRangoDeFechas,
  getPresupuestos,
} from "../controllers/presupuesto,controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";

const router = Router();

router.get("/presupuestos", isAuth, isAdmin, getPresupuestos);

router.get("/presupuestos-mes", isAuth, isAdmin, getPresupuestoMesActual);

router.get("/presupuestos/:id", isAuth, isAdmin, getPresupuesto);

router.post("/presupuestos", isAuth, isAdmin, createPresupuesto);

router.put("/presupuestos/:id", isAuth, isAdmin, actualizarPresupuesto);

router.delete("/presupuestos/:id", isAuth, isAdmin, eliminarGasto);

router.get("/presupuesto/mes/:mes", isAuth, isAdmin, getPresupuestoPorMes);

router.post(
  "/presupuesto/rango-fechas",
  isAuth,
  isAdmin,
  getPresupuestoPorRangoDeFechas
);

export default router;
