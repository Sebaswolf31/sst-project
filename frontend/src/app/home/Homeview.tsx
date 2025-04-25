import React from "react";
import Image from "next/image";
import { IoCallSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const Homeview = () => {
  return (
    <div>
      <div className="relative w-full mx-auto max-w-10xl">
        <div className="relative w-full aspect-[16/9]">
          <Image src="/home.png" alt="Imagen" fill className="object-contain" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-4 pb-10 md:grid-cols-3 md:px-8 ">
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-greenP hover:scale-110">
          <div className="flex items-center h-40">
            <img
              src="/optimiza.png"
              alt="Optimiza tus procesos"
              className="object-cover w-full h-full pb-2"
            />
          </div>
          <h3 className="pb-2 font-bold text-center ">Optimiza tus procesos</h3>
          <p className="text-sm text-justify">
            Identifica cuellos de botella, mejora la eficiencia operativa y toma
            decisiones más inteligentes con datos en tiempo real. Con Procimple
            y Power Platform, puedes transformar la forma en que tu empresa
            funciona, impulsando el rendimiento y reduciendo costos
            innecesarios.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-greenP hover:scale-110">
          <div className="flex items-center h-40">
            <img
              src="/simplifica.png"
              alt="Simplifica tu operación"
              className="object-cover w-full h-full pb-2"
            />
          </div>
          <h3 className="pb-2 font-bold text-center">
            Simplifica tu operación{" "}
          </h3>
          <p className="text-sm text-justify">
            Reduce la complejidad de tus flujos de trabajo integrando todas tus
            herramientas y plataformas en un solo ecosistema intuitivo. Con
            soluciones fáciles de implementar y adaptar, podrás liberar a tu
            equipo de tareas repetitivas y enfocarte en lo que realmente
            importa: hacer crecer tu negocio.
          </p>
          <p></p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-greenP hover:scale-110">
          <div className="flex items-center h-40">
            <img
              src="/automatiza.png"
              alt="Automatiza para crecer"
              className="object-cover w-full h-full pb-2"
            />
          </div>
          <h3 className="pb-2 font-bold text-center">Automatiza para crecer</h3>
          <p className="text-sm text-justify">
            Libera el verdadero potencial de tu empresa automatizando tareas
            clave con tecnologías inteligentes. Procimple y Power Platform te
            permiten diseñar procesos automatizados a medida, mejorando la
            productividad y garantizando resultados consistentes y escalables.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pb-4 mx-auto space-y-1 text-center md:space-y-2 lg:space-y-4">
        <h2 className="font-bold text-1xl md:text-4xl lg:text-3xl text-greenP ">
          ¿Listo para llevar tu negocio al siguiente nivel?
        </h2>
        <p className="text-base text-gray-600 md:text-lg lg:text-xl ">
          ¡Contáctanos y transforma tu forma de trabajar!
        </p>
        <a href="tel:+573059301802" className="flex gap-2 text-justify items">
          <IoCallSharp /> +57 305 930 1802
        </a>
        <a
          href="mailto:correo@gmail.com"
          className="flex gap-2 text-justify items"
        >
          <MdEmail /> Email{" "}
        </a>
      </div>
    </div>
  );
};

export default Homeview;
