"use client";
import { useEffect, useState } from "react";
import { salas_sin_contar as salasUnicas } from "@/assets/salas_unicas_sin_contar.js";
import { salasUnicas as salasUnicasContadas } from "@/assets/salas_unicas.js";

export default function Main() {
  const [data, setData] = useState(null);

  const filtedData = (data) => {
    if (!data) return [];
    const dataFiltrada = data.filter((item) => {
      const { node } = item;
      return node.day === 1;
    });
    console.log("Filtered data:", dataFiltrada);
  };

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
        console.log("Fetched data:", result.data.allSalasUdps.edges);
        setData(result.data.allSalasUdps.edges);

        const date = new Date();
        console.log("Current date:", date.getDay());

        filtedData(result.data.allSalasUdps.edges);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("salasUnicas:", salasUnicas);
  return <div></div>;
}
