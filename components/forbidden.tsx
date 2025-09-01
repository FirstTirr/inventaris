"use client";
import React from "react";

export default function Forbidden() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        This site can't be reached
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        domain.com took too long to respond.
      </p>
      <ul className="text-gray-500 mb-6">
        <li>Checking the connection</li>
        <li>Checking the proxy and the firewall</li>
      </ul>
      <div className="text-gray-400 mb-8">ERR_CONNECTION_TIMED_OUT</div>
    </div>
  );
}
