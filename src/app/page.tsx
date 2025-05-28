"use client";

import { AdvocatesTable } from "./components";

export default function Home() {
  return (
    <main>
      <header className="header-primary bg-gradient-radial">Solace Advocates</header>
      <AdvocatesTable />
    </main>
  );
}
