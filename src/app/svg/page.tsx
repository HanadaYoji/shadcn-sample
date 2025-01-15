"use client";

import SvgDisplay from "@/components/SvgDisplay";
import Table from "@/components/Table";
import { useState } from "react";

export default function HomePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex p-4">
      {/* SVGの表示 */}
      <div className="w-1/2">
        <SvgDisplay hoveredId={hoveredId} setHoveredId={setHoveredId} />
      </div>

      {/* テーブルの表示 */}
      <div className="w-1/2">
        <Table hoveredId={hoveredId} setHoveredId={setHoveredId} />
      </div>
    </div>
  );
}
