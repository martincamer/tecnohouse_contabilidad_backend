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
