import Router from "express-promise-router";
import {
  actualizarTipo,
  createTipo,
  eliminarTipo,
  getTipo,
  getTipos,
} from "../controllers/tipos.controllers.js";
import { isAdmin } from "../middlewares/ingresos.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/tipos", isAuth, isAdmin, getTipos);

router.get("/tipos/:id", isAuth, isAdmin, getTipo);

router.post("/tipos", isAuth, isAdmin, createTipo);

router.put("/tipos/:id", isAuth, isAdmin, actualizarTipo);

router.delete("/tipos/:id", isAuth, isAdmin, eliminarTipo);

export default router;
