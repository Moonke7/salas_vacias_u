"use client";

import react, { useEffect, useState } from "react";
import "./styles.css";
import {
  filtrar_por_dia,
  indice_de_bloque_actual,
  salas_libres_por_calle,
} from "../Functions/Functions";
import React from "react";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Ejercito = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [dayInfo, setDayInfo] = useState({
    dia: new Date().getDay(),
    modulo: indice_de_bloque_actual(),
  });
  const [dataPorPiso, setDataPorPiso] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/elmalba/data/refs/heads/main/data.json"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // transformar a json
        const result = await response.json();
        const data = result.data.allSalasUdps.edges;
        setData(data);

        const dataFiltrada = filtrar_por_dia(data, dayInfo.dia);
        const salasLibres = salas_libres_por_calle(
          dayInfo.modulo,
          "E441",
          dataFiltrada
        );
        console.log("Salas libres:", salasLibres);
        setFilteredData(salasLibres);
        FiltrarPorPiso(salasLibres);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Obtener nombres de días
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Manejar cambio de día en el select
  const handleDiaChange = (e) => {
    const nuevoDia = parseInt(e.target.value, 10);
    setDayInfo((prev) => ({ ...prev, dia: nuevoDia }));

    if (data) {
      const dataFiltrada = filtrar_por_dia(data, nuevoDia);
      const salasLibres = salas_libres_por_calle(
        dayInfo.modulo,
        "E441",
        dataFiltrada
      );
      setFilteredData(salasLibres);
      FiltrarPorPiso(salasLibres);
    }
  };

  const handleModuloChange = (e) => {
    const nuevoModulo = parseInt(e.target.value, 10);
    setDayInfo((prev) => ({ ...prev, modulo: nuevoModulo }));

    if (data) {
      const dataFiltrada = filtrar_por_dia(data, dayInfo.dia);
      const salasLibres = salas_libres_por_calle(
        nuevoModulo,
        "E441",
        dataFiltrada
      );
      setFilteredData(salasLibres);
      FiltrarPorPiso(salasLibres);
    }
  };

  const FiltrarPorPiso = (data) => {
    const pisos = [-1, 1, 2, 3, 4, 5];
    const resultado = {};

    pisos.forEach((piso) => {
      resultado[`piso${piso === -1 ? "_1" : piso}`] = data
        .filter((sala) => {
          const partes = sala.split(".");
          const pisoSala = partes.length > 1 ? parseInt(partes[1], 10) : null;
          return pisoSala === piso;
        })
        .map((sala) => {
          const partes = sala.split(".");
          return partes.length > 2 ? partes[2] : null;
        })
        .filter(Boolean);
    });

    console.log("Salas por piso:", resultado);
    setDataPorPiso(resultado);
  };

  const pisos = [
    { nombre: "Piso -1", clave: "piso_1" },
    { nombre: "Piso 1", clave: "piso1" },
    { nombre: "Piso 2", clave: "piso2" },
    { nombre: "Piso 3", clave: "piso3" },
    { nombre: "Piso 4", clave: "piso4" },
    { nombre: "Piso 5", clave: "piso5" },
  ];

  const router = useRouter();

  return (
    <div className="container">
      <nav onClick={() => router.push("/main")}>
        <FaHome
          className="nav"
          color="#2b3040"
          size={32}
        />
        <span>Home</span>
      </nav>
      <div className="image-container">
        <img
          className="logo"
          src="https://www.udp.cl/cms/wp-content/uploads/2021/06/Ingenieria03-scaled.jpg"
          alt="Logo UDP"
        />
        <div className="fade-right"></div>
      </div>

      <div className="content">
        <h1 className="title">Ejercito - salas vacias</h1>

        <div className="datos">
          <h3>Día:</h3>
          <select value={dayInfo.dia} onChange={handleDiaChange}>
            <option value="" disabled>
              {`Día actual: ${dias[dayInfo.dia]}`}
            </option>
            <option value="1">Lunes</option>
            <option value="2">Martes</option>
            <option value="3">Miércoles</option>
            <option value="4">Jueves</option>
            <option value="5">Viernes</option>
          </select>

          <h3>Módulo:</h3>
          <select value={dayInfo.modulo} onChange={handleModuloChange}>
            <option value="" disabled>
              {`Módulo actual: ${dayInfo.modulo}`}
            </option>
            <option value="0">8:30 - 9:50</option>
            <option value="1">10:00 - 11:20</option>
            <option value="2">11:30 - 12:50</option>
            <option value="3">13:00 - 14:20</option>
            <option value="4">14:30 - 15:50</option>
            <option value="5">16:00 - 17:20</option>
            <option value="6">17:25 - 18:45</option>
          </select>
        </div>

        <div className="scroll-list">
          <ul className="list" style={{ margin: 0, padding: 0 }}>
            {filteredData &&
              filteredData.map((sala, index) => <li key={index}>{sala}</li>)}
            {!filteredData && <li>Cargando salas...</li>}
          </ul>
        </div>

        <div className="scroll-list__phone">
          {dataPorPiso && (
            <ul className="list" style={{ margin: 0, padding: 0 }}>
              {pisos.map((piso) => {
                const salas = dataPorPiso[piso.clave] || [];
                return (
                  <React.Fragment key={piso.clave}>
                    <h4>{piso.nombre}</h4>
                    {salas.length > 0 ? (
                      salas.map((sala, index) => <li key={index}>{sala}</li>)
                    ) : (
                      <li>No hay salas vacías en este piso</li>
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <footer>
        <a
          href="https://www.github.com/moonke7"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p>© 2025 by Moonke7</p>
        </a>
      </footer>
    </div>
  );
};

export default Ejercito;
