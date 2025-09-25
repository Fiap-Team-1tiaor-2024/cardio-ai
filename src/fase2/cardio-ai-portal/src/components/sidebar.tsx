// src/components/sidebar.tsx
"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md h-full p-4">
      <h2 className="text-xl font-bold mb-6">CardioIA</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/pages/dashboards" className="hover:text-blue-600">Dashboard</Link>
        <Link href="/pages/pacientes" className="hover:text-blue-600">Pacientes</Link>
        <Link href="/pages/agendamentos" className="hover:text-blue-600">Agendamentos</Link>
      </nav>
    </aside>
  );
}
