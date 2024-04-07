import { pool } from "../db.js";

export const getDatos = async (req, res, next) => {
  // Obtener datos
  try {
    const result = await pool.query("SELECT * FROM datos");
    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getDato = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM datos WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No existe ningún dato con ese id",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener dato:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createDato = async (req, res, next) => {
  const { egresos, presupuestoasignado } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO datos (egresos, presupuestoasignado) VALUES ($1, $2) RETURNING *",
      [egresos, presupuestoasignado]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un dato con ese nombre",
      });
    }
    next(error);
  }
};

export const actualizarDato = async (req, res) => {
  const id = req.params.id;
  const { egresos, presupuestoasignado } = req.body;

  try {
    const result = await pool.query(
      "UPDATE datos SET egresos = $1, presupuestoasignado = $2 WHERE id = $3",
      [egresos, presupuestoasignado, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No existe un dato con ese id",
      });
    }

    return res.json({
      message: "Dato actualizado",
    });
  } catch (error) {
    console.error("Error al actualizar dato:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const eliminarDato = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM datos WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No existe ningún dato con ese id",
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar dato:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getDatosMesActual = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM datos WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getDatosPorRangoDeFechas = async (req, res, next) => {
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
      "SELECT * FROM datos WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
