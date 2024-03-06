CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    empleado VARCHAR(255),
    fecha date,
    antiguedad numeric,
    tipo VARCHAR(255),
    quincena_del_cinco numeric,
    quincena_del_veinte numeric,
    total_antiguedad numeric,
    banco numeric,
    premio_asistencia numeric,
    premio_produccion numeric,
    comida_produccion numeric,
    descuento numeric,
    obs VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email   VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


ALTER TABLE users ADD COLUMN gravatar VARCHAR(255);

ALTER TABLE empleados ADD COLUMN user_id INTEGER REFERENCES users(id);
