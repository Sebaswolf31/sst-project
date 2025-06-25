/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { routes } from "@/app/routes/routes";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/app/contexts/authContext";
import { IoIosLogOut } from "react-icons/io";
import {
  isAdmin,
  isOperator,
  isSuperAdmin,
  isInpector,
} from "@/app/helpers/authhelpers";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, resetUserData, user } = useAuth();
  const router = useRouter(); // 👈 Inicializa el router

  console.log(user, "userennavbar");
  const handleLogout = () => {
    resetUserData();
    router.push(routes.home); // 👈 Redirige manualmente
  };

  return (
    <div className="z-40 text-white top-4 bg-blueP ">
      <nav className="flex items-center justify-between h-20 p-4 mx-auto shadow-xl text-foreground max-w-7xl bg-opacity-80">
        <Link href={routes.home}>
          <img src="/logo.png" alt="logo" className="w-auto h-10" />
        </Link>
        {user ? (
          <p className="text-center">
            ¡Hola, {user?.name.split(" ")[0] || "Usuario"}! 👋{" "}
          </p>
        ) : (
          <p className="text-center">
            ⛑ Tu seguridad es nuestra prioridad. Inicia sesión para continuar. ⛑
          </p>
        )}

        <div className="lg:hidden">
          <button
            className="text-2xl transition hover:text-verde"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoClose /> : <FiMenu />}
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full space-x-1 lg:flex lg:w-auto lg:items-center lg:justify-center transition-all duration-300 ease-in-out`}
        >
          {isSuperAdmin(user) && (
            <div className="flex flex-col items-center px-8 lg:flex-row lg:gap-8 lg:space-x-8">
              <Link href={routes.home} className="transition hover:text-verde">
                Inicio
              </Link>
              <Link href={routes.users} className="transition hover:text-verde">
                Usuarios
              </Link>
              <Link href={routes.companies}>Empresas</Link>
            </div>
          )}
          {isAdmin(user) && (
            <div className="flex flex-col items-center px-4 lg:flex-row lg:gap-8 lg:space-x-8">
              <Link href={routes.home} className="transition hover:text-verde">
                Inicio
              </Link>
              <Link
                href={routes.userAdmin}
                className="transition hover:text-verde"
              >
                Usuarios
              </Link>
              <Link href={routes.plan}>Planear</Link>

              <Link href={routes.do}>Hacer</Link>
              <Link href={routes.verify}>Verificar</Link>

              <Link href={routes.act}>Actuar</Link>
            </div>
          )}
          {isInpector(user) && (
            <div className="flex flex-col items-center px-4 lg:flex-row lg:gap-8 lg:space-x-8">
              <Link href={routes.home} className="transition hover:text-verde">
                Inicio
              </Link>

              <Link href={routes.plan}>Planear</Link>

              <Link href={routes.do}>Hacer</Link>
              <Link href={routes.verify}>Verificar</Link>

              <Link href={routes.act}>Actuar</Link>
            </div>
          )}
          {isOperator(user) && (
            <div className="flex flex-col items-center px-4 lg:flex-row lg:gap-8 lg:space-x-8">
              <Link href={routes.home} className="transition hover:text-verde">
                Inicio
              </Link>
              <Link href={routes.do} className="transition hover:text-verde">
                Hacer Inspecciones{" "}
              </Link>
            </div>
          )}

          <div>
            {isAuth ? (
              <span
                onClick={handleLogout}
                className="flex items-center gap-2 transition cursor-pointer hover:text-verde"
              >
                <IoIosLogOut />
                Cerrar Sesión
              </span>
            ) : (
              <Link href={routes.login} className="transition hover:text-verde">
                Iniciar Sesion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
