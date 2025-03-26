'use client'
import { useState } from "react";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Botão para abrir o dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Menu
      </button>

      {/* Opções do dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-lg">
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Opção 1
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Opção 2
          </a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Opção 3
          </a>
        </div>
      )}
    </div>
  );
}
