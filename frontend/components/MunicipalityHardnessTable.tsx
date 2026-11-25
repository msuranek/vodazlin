"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { formatNumber, getHardnessLabel } from "@/lib/utils";

interface MunicipalityHardnessTableProps {
  municipalities: { name: string; hardnessMmol: number }[];
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("cs-CZ");
}

export default function MunicipalityHardnessTable({
  municipalities,
}: MunicipalityHardnessTableProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return municipalities;
    return municipalities.filter((item) =>
      normalize(item.name).includes(normalizedQuery)
    );
  }, [municipalities, query]);

  return (
    <div className="not-prose my-8">
      <label htmlFor="municipality-search" className="block font-mono font-bold text-earth-900 mb-2">
        Najděte svou obec
      </label>
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-earth-500" />
        <input
          id="municipality-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Například Otrokovice, Fryšták nebo Březnice"
          className="w-full rounded-lg border border-water-200 bg-white py-3 pl-11 pr-4 text-earth-900 shadow-sm outline-none transition focus:border-water-500 focus:ring-2 focus:ring-water-200"
        />
      </div>

      <p className="mt-3 text-sm text-earth-600" aria-live="polite">
        {filtered.length === municipalities.length
          ? `${municipalities.length} obcí v přehledu`
          : `${filtered.length} nalezených obcí`}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-water-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead className="bg-water-50 text-sm text-earth-700">
              <tr>
                <th className="px-4 py-3 font-mono font-bold">Obec</th>
                <th className="px-4 py-3 font-mono font-bold whitespace-nowrap">mmol/l</th>
                <th className="px-4 py-3 font-mono font-bold whitespace-nowrap">°dH</th>
                <th className="px-4 py-3 font-mono font-bold">Zařazení</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-water-100">
              {filtered.map((item) => {
                const hardnessDh = item.hardnessMmol * 5.61;
                return (
                  <tr key={item.name} className="text-earth-800 hover:bg-water-50/60">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 font-mono whitespace-nowrap">
                      {formatNumber(item.hardnessMmol, 1)}
                    </td>
                    <td className="px-4 py-3 font-mono whitespace-nowrap">
                      {formatNumber(hardnessDh, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {getHardnessLabel(hardnessDh)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-water-200 bg-water-50 p-5 text-earth-700">
          Tato obec v přehledu Vodárny Zlín není. Zkuste kratší část názvu nebo
          zkontrolujte pravopis.
        </div>
      )}
    </div>
  );
}
