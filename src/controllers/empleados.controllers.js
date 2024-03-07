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
  } = req.body;
  //   const { username, userRole } = req;

  // Validaciones
  if (!empleado || typeof empleado !== "string") {
    return res.status(400).json({
      message: "El campo 'empleado' es obligatorio y debe ser un texto.",
    });
  }

  const isNumeric = (value) => /^-?\d*\.?\d*$/.test(value);

  if (
    !isNumeric(antiguedad) ||
    !isNumeric(quincena_del_cinco) ||
    !isNumeric(quincena_del_veinte) ||
    !isNumeric(total_antiguedad) ||
    !isNumeric(banco) ||
    !isNumeric(premio_asistencia) ||
    !isNumeric(premio_produccion) ||
    !isNumeric(comida_produccion) ||
    !isNumeric(descuento)
  ) {
    return res.status(400).json({
      message: "Los campos numéricos deben contener valores válidos.",
    });
  }

  if (typeof tipo !== "string") {
    return res.status(400).json({
      message: "El campo 'tipo' debe ser un texto.",
    });
  }

  if (typeof obs !== "string") {
    return res.status(400).json({
      message: "El campo 'tipo' debe ser un texto.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO empleados (empleado, fecha, antiguedad, tipo, quincena_del_cinco, quincena_del_veinte, total_antiguedad, banco, premio_asistencia, premio_produccion, comida_produccion, descuento, obs, total_quincena,total_quincena_veinte,total_final, tipo_fabrica, otros) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *",
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
  } = req.body;

  // Validaciones
  if (!empleado || typeof empleado !== "string") {
    return res.status(400).json({
      message: "El campo 'empleado' es obligatorio y debe ser un texto.",
    });
  }

  const isNumeric = (value) => /^-?\d*\.?\d*$/.test(value);

  if (
    !isNumeric(antiguedad) ||
    !isNumeric(quincena_del_cinco) ||
    !isNumeric(quincena_del_veinte) ||
    !isNumeric(total_antiguedad) ||
    !isNumeric(banco) ||
    !isNumeric(premio_asistencia) ||
    !isNumeric(premio_produccion) ||
    !isNumeric(comida_produccion) ||
    !isNumeric(descuento)
  ) {
    return res.status(400).json({
      message: "Los campos numéricos deben contener valores válidos.",
    });
  }

  if (typeof tipo !== "string") {
    return res.status(400).json({
      message: "El campo 'tipo' debe ser un texto.",
    });
  }

  if (typeof obs !== "string") {
    return res.status(400).json({
      message: "El campo 'tipo' debe ser un texto.",
    });
  }

  const result = await pool.query(
    "UPDATE empleados SET empleado = $1 , fecha = $2, antiguedad = $3, tipo = $4, quincena_del_cinco = $5, quincena_del_veinte = $6, total_antiguedad = $7, banco = $8, premio_asistencia = $9, premio_produccion = $10, comida_produccion = $11, descuento = $12, obs = $13, total_quincena = $14 ,total_quincena_veinte = $15, total_final = $16, tipo_fabrica = $17, otros = $18 WHERE id = $19",
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
