import React from "react";

const options = [
  { key: "Tabel Labor", label: "Tabel Labor" },
  { key: "Tabel Kelas", label: "Tabel Kelas" },
  { key: "Tabel Kategory", label: "Tabel Kategory" },
  { key: "Tabel Jurusan", label: "Tabel Jurusan" },
];

interface TabelDropdownNavProps {
  selected: string;
  onSelect: (key: string) => void;
}

const TabelDropdownNav = React.memo(
  ({ selected, onSelect }: TabelDropdownNavProps) => {
    return (
      <div className="mt-2 mb-4">
        {/* Mobile: vertical dropdown */}
        <div className="flex-col sm:hidden flex gap-2 transition-all duration-300 ease-in-out transform">
          {options.map((opt) => (
            <button
              key={opt.key}
              className={`flex items-center w-full px-4 py-3 rounded-lg font-semibold text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap
              ${
                selected === opt.key
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 text-gray-500 hover:bg-blue-100"
              }`}
              onClick={() => onSelect(opt.key)}
            >
              <input
                type="radio"
                checked={selected === opt.key}
                readOnly
                className="accent-blue-600 mr-2"
              />
              {opt.label}
            </button>
          ))}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden sm:flex flex-col gap-1 transition-all duration-300 ease-in-out transform">
          {options.map((opt) => (
            <button
              key={opt.key}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-left font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base
              ${
                selected === opt.key
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 text-gray-500 hover:bg-blue-100"
              }`}
              onClick={() => onSelect(opt.key)}
            >
              <span className="mr-2">
                <input
                  type="radio"
                  checked={selected === opt.key}
                  readOnly
                  className="accent-blue-600"
                />
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TabelDropdownNav.displayName = "TabelDropdownNav";

export default TabelDropdownNav;
