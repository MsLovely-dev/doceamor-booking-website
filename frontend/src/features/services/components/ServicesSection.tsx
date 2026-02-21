import { Button } from "@/components/ui/button";
import { SERVICE_CATALOG } from "@/features/services/data/catalog";
import { useRef, useState, type ReactNode } from "react";
import {
  ArrowUp,
  Flower2,
  Hand,
  HeartPulse,
  Package,
  Sparkles,
  SprayCan,
  Waves,
} from "lucide-react";

const iconMap: Record<string, ReactNode> = {
  "Body Massage": <Waves className="h-4 w-4" />,
  "Nail Spa": <Sparkles className="h-4 w-4" />,
  "Hand, Foot & Body Spa": <Hand className="h-4 w-4" />,
  "Facial Care": <Flower2 className="h-4 w-4" />,
  "Hair Removal": <SprayCan className="h-4 w-4" />,
  "Other Services": <HeartPulse className="h-4 w-4" />,
  Packages: <Package className="h-4 w-4" />,
  "Bridal / Birthday Party": <Sparkles className="h-4 w-4" />,
};

const COLUMN_ALIASES: Record<string, string[]> = {
  M: ["Member"],
  NM: ["Non-Member", "Non Member"],
  Member: ["M"],
  "Non-Member": ["NM", "Non Member"],
  "Non Member": ["NM", "Non-Member"],
};

const getColumnLabel = (column: string) => {
  if (column === "M" || column === "Member") return "Member";
  if (column === "NM" || column === "Non-Member" || column === "Non Member") return "Non-Member";
  return column;
};

const getColumnBadge = (column: string) => {
  if (column === "M" || column === "Member") return "M";
  if (column === "NM" || column === "Non-Member" || column === "Non Member") return "NM";
  return null;
};

const getRowValue = (row: Record<string, string>, column: string) => {
  if (row[column] != null) return row[column];

  const normalizedColumn = column.trim();
  if (row[normalizedColumn] != null) return row[normalizedColumn];

  const aliasKeys = COLUMN_ALIASES[column] ?? COLUMN_ALIASES[normalizedColumn] ?? [];
  for (const alias of aliasKeys) {
    if (row[alias] != null) return row[alias];
  }

  const normalizedRowKey = Object.keys(row).find((key) => key.trim() === normalizedColumn);
  if (normalizedRowKey && row[normalizedRowKey] != null) return row[normalizedRowKey];

  return "-";
};

const ServicesSection = () => {
  const [activeSection, setActiveSection] = useState(SERVICE_CATALOG[0]?.title ?? "");
  const sectionTopRef = useRef<HTMLElement>(null);

  const scrollToCategoriesTop = () => {
    if (!sectionTopRef.current) {
      return;
    }

    const fixedHeaderOffset = 88;
    const top = sectionTopRef.current.getBoundingClientRect().top + window.scrollY - fixedHeaderOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const selectedSection =
    SERVICE_CATALOG.find((section) => section.title === activeSection) ?? SERVICE_CATALOG[0];

  const visibleColumns = selectedSection?.groups[0]?.columns.filter((column) => column !== "Service") ?? [];

  return (
    <section ref={sectionTopRef} id="services" className="bg-gradient-to-b from-white via-[#FFF7F8] to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-4xl font-light tracking-wide text-gray-800 md:text-5xl">
            Services <span className="font-semibold text-[#F1B2B5]">Menu</span>
          </h2>
          <p className="mt-3 text-base text-gray-600 md:text-lg">
            Choose a category and compare rates instantly.
          </p>
          <div className="mx-auto mt-6 h-px w-44 bg-gradient-to-r from-transparent via-[#F5C5C5] to-transparent" />
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 pb-2">
          {SERVICE_CATALOG.map((section) => {
            const isActive = activeSection === section.title;

            return (
              <Button
                key={section.title}
                type="button"
                variant="outline"
                onClick={() => setActiveSection(section.title)}
                className={`rounded-full border px-5 py-2 text-sm whitespace-nowrap ${
                  isActive
                    ? "border-[#F1B2B5] bg-[#F1B2B5] text-white hover:bg-[#e4a0a6]"
                    : "border-[#F5C5C5] bg-white text-[#6b5b62] hover:bg-[#FFF7F8]"
                }`}
              >
                <span className="mr-2 inline-flex items-center">{iconMap[section.title]}</span>
                {section.title}
              </Button>
            );
          })}
        </div>

        {visibleColumns.length > 0 ? (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[#7d6d74]">
            {visibleColumns.map((column) => (
              <div key={column} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-[#F5C5C5]">
                {getColumnBadge(column) ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F5C5C5]/55 text-xs font-semibold text-[#7d6d74]">
                    {getColumnBadge(column)}
                  </span>
                ) : null}
                <span>{getColumnLabel(column)}</span>
              </div>
            ))}
          </div>
        ) : null}

        {selectedSection ? (
          <div className="rounded-3xl border border-[#F5C5C5] bg-white p-4 shadow-[0_20px_60px_-45px_rgba(186,132,139,0.55)] md:p-8">
            <div className="space-y-7">
              {selectedSection.groups.map((group) => {
                const priceColumns = group.columns.filter((column) => column !== "Service");

                return (
                  <div key={group.title} className="overflow-hidden rounded-2xl border border-[#F5C5C5]/90 bg-white">
                    <div className="flex items-center gap-3 border-b border-[#F5C5C5]/90 bg-[#FFF7F8] px-4 py-3 md:px-6">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C5C5]/55 text-[#7d6d74]">
                        {iconMap[selectedSection.title]}
                      </span>
                      <h3 className="text-xl font-semibold text-[#6b3b4f]">{group.title}</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full table-fixed border-collapse">
                        <thead>
                          <tr className="border-b border-[#F5C5C5]/85 text-left">
                            <th className="w-[52%] px-4 py-3 text-sm font-medium text-[#8d5e74] md:px-6">Service</th>
                            {priceColumns.map((column) => (
                              <th
                                key={`${group.title}-${column}`}
                                className="px-4 py-3 text-right text-sm font-medium text-[#8d5e74] md:px-6"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.rows.map((row, index) => (
                            <tr
                              key={`${group.title}-${row.Service}`}
                              className={index % 2 === 0 ? "bg-white" : "bg-[#FFF7F8]/55"}
                            >
                              <td className="px-4 py-3 text-sm text-[#5f4e55] md:px-6 md:text-base">
                                <p>{row.Service}</p>
                                {row.Description ? (
                                  <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#7d6d74] md:text-sm">
                                    {row.Description}
                                  </p>
                                ) : null}
                              </td>
                              {priceColumns.map((column) => (
                                <td
                                  key={`${group.title}-${row.Service}-${column}`}
                                  className="px-4 py-3 text-right text-sm font-medium text-[#7d6d74] md:px-6 md:text-base"
                                >
                                  {getRowValue(row, column)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none fixed bottom-6 right-6 z-30">
          <Button
            type="button"
            onClick={scrollToCategoriesTop}
            className="pointer-events-auto h-11 rounded-full bg-[#F1B2B5] px-4 text-white shadow-lg transition-all duration-300 motion-safe:animate-pulse hover:-translate-y-0.5 hover:bg-[#e4a0a6] hover:shadow-xl"
          >
            <ArrowUp className="mr-2 h-4 w-4 transition-transform duration-300" />
            Back to categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
