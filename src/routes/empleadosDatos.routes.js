import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import { guardarDatosEmpleados } from "../controllers/empleadosDatos.controllers.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";

const router = Router();

router.post("/empleados-datos", isAuth, isAdmin, guardarDatosEmpleados);

export default router;
