"use client";
import React from "react";

export default function Unauthorized() {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center bg-black" style={{fontFamily: 'Inter, sans-serif'}}>
			<h1 className="text-white text-[80px] md:text-[120px] font-bold mb-0 leading-none select-none">401</h1>
			<div className="h-8" />
			<div className="flex items-center justify-center">
				<span className="text-white text-[64px] md:text-[96px] font-bold tracking-wide select-none border-white border-2 px-8 py-2" style={{letterSpacing: 2}}>
					FORBIDDEN
				</span>
			</div>
		</div>
	);
}
