import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SERVICE_CATALOG } from "@/features/services/data/catalog";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  Flower2,
  Hand,
  HeartPulse,
  Package,
  Sparkles,
  SprayCan,
  Waves,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, JSX.Element> = {
  "Body Massage": <Waves className="w-5 h-5" />,
  "Nail Spa": <Sparkles className="w-5 h-5" />,
  "Hand, Foot & Body Spa": <Hand className="w-5 h-5" />,
  "Facial Care": <Flower2 className="w-5 h-5" />,
  "Hair Removal": <SprayCan className="w-5 h-5" />,
  "Other Services": <HeartPulse className="w-5 h-5" />,
  Packages: <Package className="w-5 h-5" />,
};

const getSectionId = (title: string) =>
  `service-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const normalizeValue = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const DEFAULT_VISIBLE_ROWS = 6;

const sectionImageHints: Record<string, string[]> = {
  "Body Massage": ["bodymassage", "massage"],
  "Nail Spa": ["manicure", "pedicure", "nailspa"],
  "Hand, Foot & Body Spa": ["footspa", "bodyspa", "hand"],
  "Facial Care": ["facial", "faicial"],
  "Hair Removal": ["hairremoval", "hair"],
  "Other Services": ["lashlift", "other"],
  Packages: ["bridalparty", "package"],
};

const imageModules = import.meta.glob("../../../assets/services/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const imageEntries = Object.entries(imageModules).map(([path, url]) => {
  const filename = path.split("/").pop() ?? "";
  const baseName = filename.replace(/\.[a-zA-Z0-9]+$/, "");
  return {
    normalizedName: normalizeValue(baseName),
    url,
  };
});

const getSectionImage = (sectionTitle: string) => {
  const hints = sectionImageHints[sectionTitle] ?? [];

  for (const hint of hints) {
    const normalizedHint = normalizeValue(hint);
    const match = imageEntries.find(
      (image) =>
        image.normalizedName.includes(normalizedHint) || normalizedHint.includes(image.normalizedName)
    );
    if (match) {
      return match.url;
    }
  }

  const normalizedSection = normalizeValue(sectionTitle);
  const sectionMatch = imageEntries.find((image) => image.normalizedName.includes(normalizedSection));
  return sectionMatch?.url;
};

const ServicesSection = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(SERVICE_CATALOG[0]?.title ?? "");
  const [query, setQuery] = useState("");
  const [expandedRowsByGroup, setExpandedRowsByGroup] = useState<Record<string, boolean>>({});
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return SERVICE_CATALOG;
    }

    return SERVICE_CATALOG.map((section) => {
      const sectionMatches = section.title.toLowerCase().includes(normalized);

      const groups = section.groups
        .map((group) => {
          const groupMatches = group.title.toLowerCase().includes(normalized);
          const filteredRows =
            sectionMatches || groupMatches
              ? group.rows
              : group.rows.filter((row) =>
                  Object.values(row).some((value) => value.toLowerCase().includes(normalized))
                );

          return {
            ...group,
            rows: filteredRows,
          };
        })
        .filter((group) => group.rows.length > 0);

      return {
        ...section,
        groups,
      };
    }).filter((section) => section.groups.length > 0);
  }, [query]);

  const handleSectionJump = (sectionTitle: string) => {
    setActiveSection(sectionTitle);
    const target = document.getElementById(getSectionId(sectionTitle));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleGroupRows = (groupKey: string) => {
    setExpandedRowsByGroup((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return (
    <section id="services" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-4xl font-light text-gray-800 md:text-5xl">
            Services <span className="font-bold text-[#F1B2B5]">Catalog</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Browse categories, expand groups, and compare pricing quickly.
          </p>
        </div>

        <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-[#F5C5C5] bg-white/95 p-3 shadow-sm backdrop-blur md:p-4">
          <div className="mb-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service, category, or price..."
              className="h-10 border-[#F5C5C5] focus-visible:ring-[#F1B2B5]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SERVICE_CATALOG.map((section) => (
              <Button
                key={section.title}
                type="button"
                variant={activeSection === section.title ? "default" : "outline"}
                onClick={() => handleSectionJump(section.title)}
                className={
                  activeSection === section.title
                    ? "whitespace-nowrap bg-[#F1B2B5] text-white hover:bg-[#e4a0a6]"
                    : "whitespace-nowrap border-[#F5C5C5] text-[#6a6a6a] hover:bg-[#FFF7F8]"
                }
              >
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredCatalog.map((section) => {
            const sectionImage = getSectionImage(section.title);

            return (
              <Card
                key={section.title}
                id={getSectionId(section.title)}
                className="spa-card flex h-full flex-col overflow-hidden border border-[#F5C5C5]"
              >
                <CardHeader className="p-0">
                  {sectionImage ? (
                    <div className="relative h-36 w-full overflow-hidden md:h-40">
                      <img
                        src={sectionImage}
                        alt={`${section.title} category`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2f2f2f]/55 via-[#2f2f2f]/10 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-20 w-full bg-gradient-to-r from-[#F5C5C5]/80 via-[#EBECF0] to-[#D2D2D2]/60" />
                  )}
                  <div className="bg-gradient-to-r from-[#F5C5C5]/80 via-[#EBECF0] to-[#D2D2D2]/60 px-5 py-4">
                    <CardTitle className="flex items-center justify-between gap-3 text-xl text-gray-800">
                      <span className="flex items-center gap-3">
                        <span className="rounded-full bg-[#FFF7F8] p-2 text-[#7a7a7a] shadow-sm">{iconMap[section.title]}</span>
                        {section.title}
                      </span>
                    </CardTitle>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="border border-[#BEBEBE] bg-[#FFF7F8] text-[#6a6a6a]">
                        {section.groups.length} Groups
                      </Badge>
                      <Badge className="border border-[#F5C5C5] bg-[#F5C5C5] text-[#6a6a6a]">
                        {section.groups.reduce((total, group) => total + group.rows.length, 0)} Services
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 overflow-y-auto p-4 md:max-h-[620px] md:p-5">
                  {section.groups.map((group) => {
                    const groupKey = `${section.title}-${group.title}`;
                    const isCollapsed = Boolean(collapsedGroups[groupKey]);
                    const isExpanded = Boolean(expandedRowsByGroup[groupKey]);
                    const visibleRows = isExpanded ? group.rows : group.rows.slice(0, DEFAULT_VISIBLE_ROWS);
                    const chipColumns = group.columns.filter((column) => column !== "Service");

                    return (
                      <div key={group.title} className="rounded-2xl border border-[#F5C5C5] bg-[#FFF7F8]/40 p-3.5 shadow-sm md:p-4">
                        <button
                          type="button"
                          onClick={() => toggleGroupCollapse(groupKey)}
                          className="flex w-full items-center justify-between gap-3"
                          aria-expanded={!isCollapsed}
                        >
                          <div className="text-left">
                            <h3 className="text-base font-semibold text-[#5f5f5f]">{group.title}</h3>
                            <p className="text-xs text-[#8a8a8a]">{group.rows.length} services</p>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-[#7a7a7a] transition-transform ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
                          />
                        </button>

                        {!isCollapsed ? (
                          <div className="mt-3 border-t border-[#F5C5C5] pt-3">
                            <div className="mb-3 flex flex-wrap gap-2">
                              {chipColumns.map((column) => (
                                <Badge key={column} variant="secondary" className="border-[#BEBEBE] bg-[#FFF7F8] text-[#6a6a6a]">
                                  {column}
                                </Badge>
                              ))}
                            </div>

                            <div className="space-y-2.5">
                              {visibleRows.map((row) => (
                                <div
                                  key={`${group.title}-${row.Service}`}
                                  className="rounded-xl border border-[#F5C5C5] bg-white p-3"
                                >
                                  <div className="space-y-2.5">
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="flex-1 text-sm font-medium leading-5 text-gray-800">{row.Service}</p>
                                      <div className="max-w-[58%] flex-shrink-0 overflow-x-auto">
                                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap pl-1">
                                          {chipColumns.map((column) => (
                                            <span
                                              key={`${row.Service}-${column}`}
                                              className="inline-flex items-center gap-1 rounded-md border border-[#F5C5C5] bg-[#F5C5C5]/60 px-2 py-1 text-[11px] font-medium text-gray-700"
                                            >
                                              <span className="text-[#8a8a8a]">{column}:</span>
                                              <span>{row[column] ?? "-"}</span>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <Button
                                        type="button"
                                        onClick={() => navigate(`/book-now?service=${encodeURIComponent(row.Service)}`)}
                                        className="h-8 bg-[#F1B2B5] px-3 text-xs text-white hover:bg-[#e4a0a6]"
                                      >
                                        Book now
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group.rows.length > DEFAULT_VISIBLE_ROWS ? (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => toggleGroupRows(groupKey)}
                                className="mt-2 h-auto px-0 text-xs text-[#7a7a7a] hover:bg-transparent hover:text-[#5f5f5f]"
                              >
                                {isExpanded
                                  ? "Show less"
                                  : `Show ${group.rows.length - visibleRows.length} more services`}
                              </Button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filteredCatalog.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#F5C5C5] bg-[#FFF7F8] p-6 text-center text-sm text-[#7a7a7a]">
            No services matched your search.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ServicesSection;

