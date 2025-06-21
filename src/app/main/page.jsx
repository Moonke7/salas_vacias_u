"use client";
import { useEffect, useState } from "react";
import { salas_sin_contar as salasUnicas } from "@/assets/salas_unicas_sin_contar.js";
import { salasUnicas as salasUnicasContadas } from "@/assets/salas_unicas.js";
import { profes } from "@/assets/profes";
import {
  indice_de_bloque_actual,
  salas_libres_por_calle,
} from "../Functions/Functions";
import "./styles.css";
import { useRouter } from "next/navigation";

const Main = () => {
  const [count, setCount] = useState({});
  const [data, setData] = useState({
    modulo: indice_de_bloque_actual(),
    dia: new Date().getDay(),
  });
  const [professorSearched, setProfessorSearched] = useState("");

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

        const salasVergara = salas_libres_por_calle(
          indice_de_bloque_actual(),
          "V432",
          data
        );

        const salasEjercito = salas_libres_por_calle(
          indice_de_bloque_actual(),
          "E441",
          data
        );

        setCount({
          ...count,
          salasVergara: salasVergara.length,
          salasEjercito: salasEjercito.length,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const router = useRouter();

  const handleSalaClick = (sala) => {
    sala === "V432" ? router.push("/vergara") : router.push("/ejercito");
  };

  const bloques = [
    "08:30 - 09:50",
    "10:00 - 11:20",
    "11:30 - 12:50",
    "13:00 - 14:20",
    "14:30 - 15:50",
    "16:00 - 17:20",
    "17:25 - 18:45",
  ];

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <div className="main-container">
      <img
        src="https://www.udp.cl/cms/wp-content/uploads/2021/06/fee.jpeg"
        about="udp"
      />

      <section>
        <h1>Salas Vacías</h1>
        <h3>Viendo en el modulo: {bloques[data.modulo]}</h3>
        <h3>Dia: {dias[data.dia]}</h3>
        <div className="salas-container">
          <h2>Salas disponibles:</h2>
          <ul>
            <li onClick={() => handleSalaClick("V432")}>
              Vergara: {count.salasVergara}
            </li>
            <li onClick={() => handleSalaClick("E441")}>
              Ejercito: {count.salasEjercito}
            </li>
          </ul>
        </div>

        <div className="profes">
          <input
            type="text"
            placeholder="Buscar profesor..."
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              setProfessorSearched(searchTerm);
            }}
            value={professorSearched}
          />
          {professorSearched && (
            <ul className="prof-list">
              {profes
                .filter((profesor) =>
                  profesor
                    .toLowerCase()
                    .includes(professorSearched.toLowerCase())
                )
                .map((profesor, index) => (
                  <li key={index}>
                    {profesor}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Main;
