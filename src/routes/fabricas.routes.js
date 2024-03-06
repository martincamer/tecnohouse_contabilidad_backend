import Router from "express-promise-router";
import {
  actualizarTipo,
  createTipo,
  eliminarTipo,
  getTipo,
  getTipos,
} from "../controllers/fabrica.controllers.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/fabrica", isAuth, isAdmin, getTipos);

router.get("/fabrica/:id", isAuth, isAdmin, getTipo);

router.post("/fabrica", isAuth, isAdmin, createTipo);

router.put("/fabrica/:id", isAuth, isAdmin, actualizarTipo);

router.delete("/fabrica/:id", isAuth, isAdmin, eliminarTipo);

export default router;
