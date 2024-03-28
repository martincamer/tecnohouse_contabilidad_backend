import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  getDatosEmpleadoById,
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

// Ruta para obtener datos de un solo empleado por ID
router.get(
  "/empleados-datos-particular/:id",
  isAuth,
  isAdmin,
  getDatosEmpleadoById
);

export default router;
