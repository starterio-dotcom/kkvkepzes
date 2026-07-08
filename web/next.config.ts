import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Önálló (standalone) kimenet a VPS-telepítéshez: a .next/standalone
  // mappa a node_modules nélkül is futtatható szervert tartalmaz.
  output: "standalone",
};

export default nextConfig;
