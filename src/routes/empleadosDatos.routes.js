import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  getDatosEmpleados,
  getEmpleadosDatosPorRangoDeFechas,
  guardarDatosEmpleados,
} from "../controllers/empleadosDatos.controllers.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";

const router = Router();

router.post("/empleados-datos", isAuth, isAdmin, guardarDatosEmpleados);

router.get("/empleados-datos", isAuth, isAdmin, getDatosEmpleados);

router.post(
  "/empleados-datos/rango-fechas",
  isAuth,
  isAdmin,
  getEmpleadosDatosPorRangoDeFechas
);

export default router;
