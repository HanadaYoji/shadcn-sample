"use client";

interface TableProps {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

export default function Table({ hoveredId, setHoveredId }: TableProps) {
  const rows = [
    { id: "square1", description: "Blue Square" },
    { id: "circle1", description: "Orange Circle" },
    { id: "triangle1", description: "Purple Triangle" },
  ];

  return (
    <table className="border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className={`border border-gray-300 px-4 py-2 ${
              hoveredId === row.id ? "bg-blue-200" : ""
            }`}
            onMouseOver={() => setHoveredId(row.id)}
            onMouseOut={() => setHoveredId(null)}
          >
            <td className="px-4 py-2">{row.id}</td>
            <td className="px-4 py-2">{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
