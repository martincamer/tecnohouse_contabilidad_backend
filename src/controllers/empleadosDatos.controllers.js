import { pool } from "../db.js";

export const guardarDatosEmpleados = async (req, res, next) => {
  const datos = req.body;
  try {
    // Execute the query with proper parameter binding
    const result = await pool.query(
      "INSERT INTO empleados_datos (datos) VALUES ($1) RETURNING *",
      [datos]
    );

    res.json(result.rows[0]);
  } catch (error) {
    // Handle other potential errors gracefully
    console.error("Error saving employee data:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      return res
        .status(409)
        .json({ message: "Ya existe un tipo con ese detalle" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const getDatosEmpleados = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query("SELECT * FROM empleados_datos");
  return res.json(result.rows);
};

export const getEmpleadosDatosPorRangoDeFechas = async (req, res, next) => {
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
      "SELECT * FROM empleados_datos WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// export const getDatosEmpleadoById = async (req, res) => {
//   const empleadoId = req.params.id;

//   try {
//     // Obtener los datos JSONB actuales de la base de datos
//     const result = await pool.query("SELECT datos FROM empleados_datos");

//     // Verificar si se encontraron datos
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         message: "No se encontraron datos de empleados",
//       });
//     }

//     const datosEmpleados = result.rows[0].datos.datos;

//     // Buscar el empleado con el ID especificado
//     const empleadoEncontrado = datosEmpleados.find(
//       (empleado) => empleado.id === parseInt(empleadoId)
//     );

//     // Verificar si se encontró el empleado
//     if (!empleadoEncontrado) {
//       return res.status(404).json({
//         message: "No se encontró ningún empleado con ese ID",
//       });
//     }

//     // Devolver el empleado encontrado
//     return res.json({
//       empleado: empleadoEncontrado,
//     });
//   } catch (error) {
//     console.error("Error al obtener el empleado:", error);
//     return res.status(500).json({
//       message: "Error interno del servidor",
//       error: error.message,
//     });
//   }
// };

export const getDatosEmpleadoById = async (req, res) => {
  const empleadoId = req.params.id;

  try {
    // Obtener todos los datos JSONB actuales de la base de datos
    const result = await pool.query("SELECT datos FROM empleados_datos");

    // Verificar si se encontraron datos
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No se encontraron datos de empleados",
      });
    }

    // Inicializar un array para almacenar los datos de todos los empleados
    let datosEmpleados = [];

    // Recorrer cada fila de resultados y extraer los datos de empleados
    result.rows.forEach((row) => {
      // Obtener los datos de empleados de la fila actual
      const datos = row.datos.datos;
      // Agregar los datos de empleados al array
      datosEmpleados = datosEmpleados.concat(datos);
    });

    // Buscar el empleado con el ID especificado
    const empleadoEncontrado = datosEmpleados.find(
      (empleado) => empleado.id === empleadoId
    );

    // Verificar si se encontró el empleado
    if (!empleadoEncontrado) {
      return res.status(404).json({
        message: "No se encontró ningún empleado con ese ID",
      });
    }

    // Devolver los datos del empleado encontrado
    return res.json(empleadoEncontrado);
  } catch (error) {
    console.error("Error al obtener el empleado:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
