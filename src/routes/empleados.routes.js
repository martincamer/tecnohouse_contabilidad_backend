import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  actualizarEmpleado,
  createEmpleado,
  eliminarEmpleado,
  getEmpleado,
  getEmpleados,
} from "../controllers/empleados.controllers.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";

const router = Router();

//crear empleado
router.post("/empleados", isAuth, isAdmin, createEmpleado);
//obtener todos los empleados
router.get("/empleados", isAuth, isAdmin, getEmpleados);
//obtener unico empleado
router.get("/empleados/:id", isAuth, isAdmin, getEmpleado);
//actualizar el empleado
router.put("/empleados/:id", isAuth, isAdmin, actualizarEmpleado);
//eliminar el empleado
router.delete("/empleados/:id", isAuth, isAdmin, eliminarEmpleado);

export default router;
