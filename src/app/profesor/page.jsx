"use client";
import { useEffect, useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import { IoArrowBackCircle } from "react-icons/io5";

const Main = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const clasesDeProfesorBuscado = JSON.parse(
        localStorage.getItem("clasesDeProfesorBuscado")
      );
      setData(clasesDeProfesorBuscado);
      console.log("Clases de profesor buscado:", clasesDeProfesorBuscado);
    };
    fetchData();
  }, []);

  const router = useRouter();

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
        <IoArrowBackCircle id="backButton" color="#2b3040" size={32} onClick={() => router.back()} />

        <h1>Profesor buscado:</h1>
        <h2>{data && data[0].node.teacher}</h2>

        <ul>
          {data &&
            data.map((item, index) => (
              <>
                <li key={index}>
                  {item.node.teacher} - {item.node.place}
                  <span>
                    {dias[item.node.day]}: {item.node.start} -{" "}
                    {item.node.finish}
                  </span>
                </li>
              </>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default Main;
