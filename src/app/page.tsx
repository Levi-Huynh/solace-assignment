"use client";

import { AdvocatesTable, Header } from "./components";

export default function Home() {
  return (
    <main>
      <Header title="Solace Advocates" />
      <AdvocatesTable />
    </main>
  );
}
