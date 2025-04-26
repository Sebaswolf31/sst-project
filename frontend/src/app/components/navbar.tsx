/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { routes } from "@/app/routes/routes";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/app/contexts/authContext";
import { IoIosLogOut } from "react-icons/io";
import { isAdmin, isOperator, isSuperAdmin } from "@/app/helpers/authhelpers";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, resetUserData, user } = useAuth();
  console.log(user, "userennavbar");

  return (
    <div className="z-40 text-white top-4 bg-blueP">
      <nav className="flex items-center justify-between p-4 mx-auto shadow-xl text-foreground ring-2 ring-gray-300 ring-opacity-100 max-w-7xl bg-opacity-80 ">
        <div className="flex items-center gap-8 pt-2">
          <Link href={routes.home}>
            <img src="/logo.png" alt="logo" className="w-auto h-14 " />
          </Link>
        </div>
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
          } w-full lg:flex lg:w-auto lg:items-center lg:justify-center transition-all duration-300 ease-in-out`}
        >
          {isSuperAdmin(user) && (
            <div>
              <div className="flex flex-col items-center pl-1 lg:flex-row lg:gap-8 lg:space-x-8">
                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  Inicio
                </Link>
                <Link
                  href={routes.users}
                  className="transition hover:text-verde"
                >
                  Usuarios
                </Link>
                <Link href={routes.home}>superAdmin 2</Link>

                <Link href={routes.home}>superAdmin 3</Link>
                <Link href={routes.home}>superAdmin 4</Link>

                <Link href={routes.home}>superAdmin 5</Link>

                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  superAdmin 6
                </Link>
              </div>
            </div>
          )}
          {isAdmin(user) && (
            <div>
              <div className="flex flex-col items-center pl-1 lg:flex-row lg:gap-8 lg:space-x-8">
                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  Inicio
                </Link>
                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  isAdmin 1
                </Link>
                <Link href={routes.home}>isAdmin 2</Link>

                <Link href={routes.home}>isAdmin 3</Link>
                <Link href={routes.home}>isAdmin 4</Link>

                <Link href={routes.home}>isAdmin 5</Link>

                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  isAdmin 6
                </Link>
              </div>
            </div>
          )}
          {isOperator(user) && (
            <div>
              <div className="flex flex-col items-center pl-1 lg:flex-row lg:gap-8 lg:space-x-8">
                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  Inicio
                </Link>
                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  isOperator 1
                </Link>
                <Link href={routes.home}>isOperator 2</Link>

                <Link href={routes.home}>isOperator 3</Link>
                <Link href={routes.home}>isOperator 4</Link>

                <Link href={routes.home}>isOperator 5</Link>

                <Link
                  href={routes.home}
                  className="transition hover:text-verde"
                >
                  isOperator 6
                </Link>
              </div>
            </div>
          )}
          <div className="flex items-center justify-end mt-4 lg:mt-0"></div>
          {isAuth ? (
            <span
              onClick={() => {
                resetUserData();
              }}
              className="flex items-center gap-2 transition cursor-pointer hover:text-verde"
            >
              <IoIosLogOut />
              Cerrar Sesión
            </span>
          ) : (
            <Link href={routes.login} className="transition hover:text-verde">
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
