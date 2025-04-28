import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-lg shadow-md mb-7">
      <button
        onClick={toggleAccordion}
        className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-foreground bg-azul focus:outline-none"
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="p-4 ">{children}</div>}
    </div>
  );
};

export default Accordion;
