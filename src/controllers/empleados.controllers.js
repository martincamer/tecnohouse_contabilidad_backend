import { pool } from "../db.js";

export const getEmpleados = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query("SELECT * FROM empleados");
  return res.json(result.rows);
};

export const getEmpleado = async (req, res) => {
  const result = await pool.query("SELECT * FROM empleados WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun empleado con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createEmpleado = async (req, res, next) => {
  const {
    empleado = "",
    fecha = "",
    antiguedad = 0,
    tipo = "",
    quincena_del_cinco = 0,
    quincena_del_veinte = 0,
    total_antiguedad = 0,
    banco = 0,
    premio_asistencia = 0,
    premio_produccion = 0,
    comida_produccion = 0,
    descuento = 0,
    obs = "",
    total_quincena = 0,
    total_quincena_veinte = 0,
    total_final = 0,
    tipo_fabrica = "",
    otros = "",
    obs_20 = "",
    descuento_20 = 0,
    rol = "",
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO empleados (empleado, fecha, antiguedad, tipo, quincena_del_cinco, quincena_del_veinte, total_antiguedad, banco, premio_asistencia, premio_produccion, comida_produccion, descuento, obs, total_quincena,total_quincena_veinte,total_final, tipo_fabrica, otros, obs_20, descuento_20, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
      [
        empleado,
        fecha,
        antiguedad,
        tipo,
        quincena_del_cinco,
        quincena_del_veinte,
        total_antiguedad,
        banco,
        premio_asistencia,
        premio_produccion,
        comida_produccion,
        descuento,
        obs,
        total_quincena,
        total_quincena_veinte,
        total_final,
        tipo_fabrica,
        otros,
        obs_20,
        descuento_20,
        rol,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un empleado asi",
      });
    }
    next(error);
  }
};

export const actualizarEmpleado = async (req, res) => {
  const id = req.params.id;
  const {
    empleado = "",
    fecha = "",
    antiguedad = 0,
    tipo = "",
    quincena_del_cinco = 0,
    quincena_del_veinte = 0,
    total_antiguedad = 0,
    banco = 0,
    premio_asistencia = 0,
    premio_produccion = 0,
    comida_produccion = 0,
    descuento = 0,
    obs = "",
    total_quincena = 0,
    total_quincena_veinte = 0,
    total_final = 0,
    tipo_fabrica = "",
    otros = "",
    obs_20 = "",
    descuento_20 = 0,
    rol = "",
  } = req.body;

  // Validaciones
  if (!empleado || typeof empleado !== "string") {
    return res.status(400).json({
      message: "El campo 'empleado' es obligatorio y debe ser un texto.",
    });
  }

  const result = await pool.query(
    "UPDATE empleados SET empleado = $1 , fecha = $2, antiguedad = $3, tipo = $4, quincena_del_cinco = $5, quincena_del_veinte = $6, total_antiguedad = $7, banco = $8, premio_asistencia = $9, premio_produccion = $10, comida_produccion = $11, descuento = $12, obs = $13, total_quincena = $14 ,total_quincena_veinte = $15, total_final = $16, tipo_fabrica = $17, otros = $18, obs_20 = $19, descuento_20 = $20, rol = $21 WHERE id = $22",
    [
      empleado,
      fecha,
      antiguedad,
      tipo,
      quincena_del_cinco,
      quincena_del_veinte,
      total_antiguedad,
      banco,
      premio_asistencia,
      premio_produccion,
      comida_produccion,
      descuento,
      obs,
      total_quincena,
      total_quincena_veinte,
      total_final,
      tipo_fabrica,
      otros,
      obs_20,
      descuento_20,
      rol,
      id,
    ]
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

export const eliminarEmpleado = async (req, res) => {
  const result = await pool.query("DELETE FROM empleados WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun empleado con ese id",
    });
  }

  return res.sendStatus(204);
};

// export const aumentarSueldo = async (req, res) => {
//   const { fabrica, quincena, total } = req.body;

//   try {
//     const empleados = await pool.query(
//       "SELECT * FROM empleados WHERE tipo_fabrica = $1",
//       [fabrica]
//     );

//     if (empleados.rowCount === 0) {
//       return res.status(404).json({
//         message: "No hay empleados en la fábrica seleccionada.",
//       });
//     }

//     // Actualizar el monto de la quincena seleccionada
//     const updates = empleados.rows.map(async (empleado) => {
//       const newTotal = Number(empleado[quincena]) + Number(total);

//       await pool.query(
//         `UPDATE empleados SET ${quincena} = $1 WHERE tipo_fabrica = $2`,
//         [newTotal, fabrica]
//       );
//     });

//     await Promise.all(updates);

//     return res.json({
//       message: "Sueldos actualizados correctamente.",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error al actualizar sueldos.",
//     });
//   }
// };

// export const aumentarSueldo = async (req, res) => {
//   const { fabrica, quincena, total } = req.body;

//   try {
//     const empleados = await pool.query(
//       "SELECT * FROM empleados WHERE tipo_fabrica = $1",
//       [fabrica]
//     );

//     if (empleados.rowCount === 0) {
//       return res.status(404).json({
//         message: "No hay empleados en la fábrica seleccionada.",
//       });
//     }

//     const updates = empleados.rows.map(async (empleado) => {
//       const newQuincenaTotal = Number(empleado[quincena]) + Number(total);
//       const newTotalQuincena =
//         quincena === "quincena_del_cinco"
//           ? Number(newQuincenaTotal)
//           : Number(empleado.quincena_del_cinco);
//       const newTotalQuincenaVeinte =
//         quincena === "quincena_del_veinte"
//           ? Number(newQuincenaTotal)
//           : Number(empleado.quincena_del_veinte);
//       const newTotalFinal =
//         Number(newTotalQuincena) +
//         Number(newTotalQuincenaVeinte) +
//         Number(total);

//       await pool.query(
//         `UPDATE empleados SET ${quincena} = $1, total_quincena = $2, total_quincena_veinte = $3, total_final = $4 WHERE id = $5`,
//         [
//           newQuincenaTotal,
//           newTotalQuincena,
//           newTotalQuincenaVeinte,
//           newTotalFinal,
//           empleado.id,
//         ]
//       );
//     });

//     await Promise.all(updates);

//     return res.json({
//       message: "Sueldos actualizados correctamente.",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error al actualizar sueldos.",
//     });
//   }
// };

export const aumentarSueldo = async (req, res) => {
  const { fabrica, quincena, total } = req.body;

  try {
    const empleados = await pool.query(
      "SELECT * FROM empleados WHERE tipo_fabrica = $1",
      [fabrica]
    );

    if (empleados.rowCount === 0) {
      return res.status(404).json({
        message: "No hay empleados en la fábrica seleccionada.",
      });
    }

    const updates = empleados.rows.map(async (empleado) => {
      const newQuincenaTotal = Number(empleado[quincena]) + Number(total);

      // Recalcular los valores basados en la lógica proporcionada
      const quincena_del_cinco =
        quincena === "quincena_del_cinco"
          ? newQuincenaTotal
          : Number(empleado.quincena_del_cinco);
      const quincena_del_veinte =
        quincena === "quincena_del_veinte"
          ? newQuincenaTotal
          : Number(empleado.quincena_del_veinte);

      const total_antiguedad =
        (Number(quincena_del_cinco) + Number(quincena_del_veinte)) *
        (0.01 * Number(empleado.antiguedad));

      const total_quincena =
        Number(quincena_del_cinco) +
        Number(empleado.banco) +
        Number(empleado.premio_asistencia) +
        Number(empleado.premio_produccion) +
        Number(total_antiguedad) -
        Number(empleado.otros) -
        Number(empleado.descuento);

      const total_quincena_veinte =
        Number(quincena_del_veinte) +
        Number(empleado.comida_produccion) -
        Number(empleado.descuento_20);

      const total_final =
        Number(total_quincena_veinte) +
        Number(empleado.otros) +
        Number(total_quincena);

      await pool.query(
        `UPDATE empleados SET ${quincena} = $1, total_quincena = $2, total_quincena_veinte = $3, total_final = $4, total_antiguedad = $5 WHERE id = $6`,
        [
          newQuincenaTotal,
          total_quincena,
          total_quincena_veinte,
          total_final,
          total_antiguedad,
          empleado.id,
        ]
      );
    });

    await Promise.all(updates);

    return res.json({
      message: "Sueldos actualizados correctamente.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al actualizar sueldos.",
    });
  }
};
