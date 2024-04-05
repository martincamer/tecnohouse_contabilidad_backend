import { pool } from "../db.js";

export const getPresupuestos = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query("SELECT * FROM presupuesto");
  return res.json(result.rows);
};

export const getPresupuesto = async (req, res) => {
  const result = await pool.query("SELECT * FROM presupuesto WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun presupuesto con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createPresupuesto = async (req, res, next) => {
  const { detalle, tipo, total } = req.body;
  const { username, userRole } = req;

  try {
    const result = await pool.query(
      "INSERT INTO presupuesto (detalle, tipo, total, usuario, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [detalle, tipo, total, username, userRole]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un ingreso con ese nombre",
      });
    }
    next(error);
  }
};

export const actualizarPresupuesto = async (req, res) => {
  const id = req.params.id;
  const { total, detalle, tipo } = req.body;

  const { username, userRole } = req;

  const result = await pool.query(
    "UPDATE presupuesto SET total = $1, detalle = $2, tipo = $3, usuario = $4, rol = $5 WHERE id = $6",
    [total, detalle, tipo, username, userRole, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe un presupuesto con ese id",
    });
  }

  return res.json({
    message: "presupuesto actualizado",
  });
};

export const eliminarGasto = async (req, res) => {
  const result = await pool.query("DELETE FROM presupuesto WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun presupuesto con ese id",
    });
  }

  return res.sendStatus(204);
};

export const getPresupuestoMesActual = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM presupuesto WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// En tu controlador poniendo el mes
export const getPresupuestoPorMes = async (req, res, next) => {
  try {
    const { mes } = req.params;

    // Ajuste de zona horaria UTC y filtro por mes
    const result = await pool.query(
      "SELECT * FROM presupuesto WHERE EXTRACT(MONTH FROM created_at) = $1",
      [mes]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getPresupuestoPorRangoDeFechas = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin } = req.body;

    // Validación de fechas
    if (
      !fechaInicio ||
      !fechaFin ||
      !isValidDate(fechaInicio) ||
      !isValidDate(fechaFin)
    ) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    // Función de validación de fecha
    function isValidDate(dateString) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return dateString.match(regex) !== null;
    }

    // Ajuste de zona horaria UTC
    const result = await pool.query(
      "SELECT * FROM presupuesto WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
