import { bloques } from "@/assets/bloques";
import { salas_sin_contar as salas } from "@/assets/salas_unicas_sin_contar";

export function filtrar_por_dia(data, dia) {
  const dataFiltrada = data.filter((item) => {
    const { node } = item;
    return node.day === dia;
  });
  return dataFiltrada;
}

export function indice_de_bloque_actual() {
  const date = new Date();
  const hora = date.getHours();
  const minutos = date.getMinutes();
  const horaActual = `${hora}:${minutos < 10 ? "0" + minutos : minutos}:00`;

  //console.log("Hora actual:", horaActual);
  let indice;
  indice = bloques.findIndex((bloque) => {
    return horaActual >= bloque.inicio && horaActual <= bloque.fin;
  });
  if (indice === -1) {
    //console.log("Fuera de horario");
    indice = bloques.findIndex((bloque, i, arr) => {
      // Verifica que haya un siguiente bloque
      if (i < arr.length - 1) {
        return horaActual > bloque.fin && horaActual < arr[i + 1].inicio;
      }
      return false;
    });
    if (indice + 1 < 7) {
      //console.log("Indice del bloque mas cercano siguiente:", indice + 1);
      return indice + 1;
    }
  }

  //console.log("Indice del bloque:", indice);
  return indice;
}

export function salas_libres_por_calle(indiceBloque, calle, data) {
  // obtiene las salas ocupadas en en bloque indicaod
  const DataFiltrada = data.filter((item) => {
    const bloqueActual = bloques[indiceBloque];
    const inicio = bloqueActual.inicio;
    const fin = bloqueActual.fin;

    const { node } = item;

    // filtrar por calle
    return (
      node.start === inicio && node.finish === fin && node.place.includes(calle)
    );
  });

  // obtener las salas desocupadas y guardarlas en un array
  const salasDesocupadas = salas.filter((sala) => {
    return (
      !DataFiltrada.some((item) => item.node.place.includes(sala)) &&
      sala.includes(calle)
    );
  });

  //console.log("Salas desocupadas en la calle", calle, ":", salasDesocupadas);
  return salasDesocupadas;
}

export function buscar_profe(profe, data) {
  const dataFiltrada = data.filter((item) => {
    const { node } = item;
    const teacher = node.teacher.toLowerCase();
    profe = profe.toLowerCase();

    const nombreProfe = profe.split(" ")[0];
    const apellidoProfe = profe.split(" ")[1] || "";

    return teacher.includes(nombreProfe) && teacher.includes(apellidoProfe);
  });

  if (dataFiltrada.length > 0) {
    //console.log(`Profesor ${profe} encontrado en las siguientes salas:`, dataFiltrada);
    return dataFiltrada;
  } else {
    //console.log(`Profesor ${profe} no encontrado.`);
    return [];
  }
}
