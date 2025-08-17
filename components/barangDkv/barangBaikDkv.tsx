"use client";
import React from "react";

const items = [
  {
    label: "total pc baik",
    value: 15,
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#377DFF" />
        <path
          d="M6 17h12M7 7h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
          stroke="#222"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 14h6"
          stroke="#222"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "total apalah baik",
    value: 15,
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#00C9A7" />
        <path
          d="M8 17V7h8v10M8 17h8M8 7h8M12 17v-2"
          stroke="#222"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "total apalah baik",
    value: 15,
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#888" />
        <rect x="7" y="10" width="10" height="4" rx="1" fill="#fff" />
        <rect x="9" y="12" width="2" height="1" rx="0.5" fill="#888" />
        <rect x="13" y="12" width="2" height="1" rx="0.5" fill="#888" />
      </svg>
    ),
  },
  {
    label: "total baik",
    value: 15,
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#00f" />
      </svg>
    ),
  },
  {
    label: "total semua barang baik",
    value: 60,
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#00f" />
      </svg>
    ),
  },
];

export default function BarangBaik() {
  return (
    <div className="min-h-[60vh] bg-[#f7f7f8] px-4 pt-8 pb-4">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-1 text-left"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Dashboard DKV (barang baik)
        </h2>
        <p className="text-gray-500 text-base font-normal mb-8 text-left">
          Monitor your labor performance
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow flex flex-col items-center py-6 px-4 min-w-[180px]"
            >
              <div className="mb-2">{item.icon}</div>
              <div
                className="text-sm font-medium text-gray-700 mb-1"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.label}
              </div>
              <div
                className="text-3xl font-bold text-black"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
