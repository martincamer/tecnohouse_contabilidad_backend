import { pool } from "../db.js";

export const getTipos = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query("SELECT * FROM tipo");
  return res.json(result.rows);
};

export const getTipo = async (req, res) => {
  const result = await pool.query("SELECT * FROM tipo WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun tipo con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createTipo = async (req, res, next) => {
  const { tipo } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tipo (tipo) VALUES ($1) RETURNING *",
      [tipo]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un tipo con ese detalle",
      });
    }
    next(error);
  }
};

export const actualizarTipo = async (req, res) => {
  const id = req.params.id;
  const { tipo } = req.body;

  const result = await pool.query("UPDATE tipo SET tipo = $1 WHERE id = $2", [
    tipo,
    id,
  ]);

  console.log(`Actualizando tipo con id ${id} a: ${tipo}`);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe un tipo con ese id",
    });
  }

  return res.json({
    message: "tipo actualizado",
  });
};

export const eliminarTipo = async (req, res) => {
  const result = await pool.query("DELETE FROM tipo WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun tipo con ese id",
    });
  }

  return res.sendStatus(204);
};

// export const getIngresoMesActual = async (req, res, next) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM ingresos WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)"
//     );

//     return res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener ingresos:", error);
//     return res.status(500).json({ message: "Error interno del servidor" });
//   }
// };
