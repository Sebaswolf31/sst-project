import React from "react";

const GetCompany = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mx-4 mb-6">
        <input
          type="text"
          placeholder="Ingrese ID de la empresa"
          //value={searchId}
          //onChange={(e) => setSearchId(e.target.value)}
          className="w-full p-2 text-black rounded bg-slate-100"
        />
        {/* {searchId && (
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-white bg-verde"
          >
            Buscar
          </button> */}
        {/* )} */}

        {/* {searchedBooking && ( */}
        <button
          // onClick={() => {
          //   setSearchId("");
          //   setSearchedBooking(null);
          // }}
          className="px-2 text-sm text-white bg-red-600 rounded"
        >
          Limpiar Filtro
        </button>
        {/* )} */}
      </div>
    </div>
  );
};

export default GetCompany;
