import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  eliminarDato,
  actualizarDato,
  createDato,
  getDato,
  getDatos,
  getDatosMesActual,
  getDatosPorRangoDeFechas,
} from "../controllers/datos.controllers.js";

const router = Router();

router.get("/datos", isAuth, getDatos);

router.get("/datos-mes", isAuth, getDatosMesActual);

router.post("/datos/rango-fechas", isAuth, getDatosPorRangoDeFechas);

router.get("/datos/:id", isAuth, getDato);

router.post("/crear-datos", isAuth, createDato);

router.put("/editar-datos/:id", actualizarDato);

router.delete("/datos/:id", isAuth, eliminarDato);

export default router;
