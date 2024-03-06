import { pool } from "../db.js";

export const getIngresos = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query("SELECT * FROM ingresos");
  return res.json(result.rows);
};

export const getIngreso = async (req, res) => {
  const result = await pool.query("SELECT * FROM ingresos WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun ingreso con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createIngreso = async (req, res, next) => {
  const { detalle, tipo, total } = req.body;
  const { username, userRole } = req;

  try {
    const result = await pool.query(
      "INSERT INTO ingresos (detalle, tipo, total, usuario, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
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

export const actualizarIngreso = async (req, res) => {
  const id = req.params.id;
  const { detalle, tipo, total } = req.body;

  const result = await pool.query(
    "UPDATE ingresos SET detalle = $1 , tipo = $2, total = $3 WHERE id = $4",
    [detalle, tipo, total, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe un ingreso con ese id",
    });
  }

  return res.json({
    message: "ingreso actualizado",
  });
};

export const eliminarIngreso = async (req, res) => {
  const result = await pool.query("DELETE FROM ingresos WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun presupuesto con ese id",
    });
  }

  return res.sendStatus(204);
};

export const getIngresoMesActual = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ingresos WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// export const getIngresoMesActual = async (req, res, next) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM ingresos WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND created_at <= DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month' - INTERVAL '1 day')"
//     );

//     return res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener ingresos:", error);
//     return res.status(500).json({ message: "Error interno del servidor" });
//   }
// };

export const getIngresoPorRangoDeFechas = async (req, res, next) => {
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
      "SELECT * FROM ingresos WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// export const getIngresoMesActualNew = async (req, res, next) => {
//   try {
//     // Obtener ingresos del mes actual hasta el quinto día
//     const result = await pool.query(
//       "SELECT * FROM ingresos WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND created_at <= CURRENT_DATE + INTERVAL '5 days'"
//     );

//     // Calcular el total de la cantidad
//     const totalIngresos = result.rows.reduce((total, ingreso) => {
//       return total + parseFloat(ingreso.cantidad); // Asegúrate de adaptar la columna de cantidad según tu esquema
//     }, 0);

//     // Verificar si estamos después del quinto día del mes
//     const today = new Date();
//     if (today.getDate() > 5) {
//       // Calcular la fecha del primer día del mes siguiente (día sexto)
//       const nextMonthFirstDay = today;
//       nextMonthFirstDay.setMonth(today.getMonth() + 1, 6);

//       // Guardar el total en la tabla totalPresupuesto para el mes siguiente
//       await pool.query(
//         "INSERT INTO totalPresupuesto (mes, total) VALUES ($1, $2)",
//         [nextMonthFirstDay, totalIngresos]
//       );
//     }

//     return res.json(result.rows);
//   } catch (error) {
//     console.error("Error al obtener ingresos:", error);
//     return res.status(500).json({ message: "Error interno del servidor" });
//   }
// };
