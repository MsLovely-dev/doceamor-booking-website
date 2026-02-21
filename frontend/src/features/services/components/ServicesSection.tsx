import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICE_CATALOG } from "@/features/services/data/catalog";
import {
  Flower2,
  Hand,
  HeartPulse,
  Package,
  Sparkles,
  SprayCan,
  Waves,
} from "lucide-react";

const iconMap: Record<string, JSX.Element> = {
  "Body Massage": <Waves className="w-5 h-5" />,
  "Nail Spa": <Sparkles className="w-5 h-5" />,
  "Hand, Foot & Body Spa": <Hand className="w-5 h-5" />,
  "Facial Care": <Flower2 className="w-5 h-5" />,
  "Hair Removal": <SprayCan className="w-5 h-5" />,
  "Other Services": <HeartPulse className="w-5 h-5" />,
  Packages: <Package className="w-5 h-5" />,
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-3">
            Services <span className="font-bold text-[#F1B2B5]">Catalog</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose a category card to explore available services and pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SERVICE_CATALOG.map((section) => (
            <Card
              key={section.title}
              className="spa-card overflow-hidden border border-[#F5C5C5] h-full"
            >
              <CardHeader className="bg-gradient-to-r from-[#F5C5C5]/80 via-[#EBECF0] to-[#D2D2D2]/60">
                <CardTitle className="text-xl md:text-2xl text-gray-800 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="p-2 rounded-full bg-[#FFF7F8] text-[#7a7a7a] shadow-sm">{iconMap[section.title]}</span>
                    {section.title}
                  </span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#FFF7F8] text-[#6a6a6a] border border-[#BEBEBE]">
                    {section.groups.length} Groups
                  </Badge>
                  <Badge className="bg-[#F5C5C5] text-[#6a6a6a] border border-[#F5C5C5]">
                    {section.groups.reduce((total, group) => total + group.rows.length, 0)} Services
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.groups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-[#F5C5C5] bg-[#FFF7F8]/40 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <h3 className="text-base font-semibold text-[#6a6a6a]">{group.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.columns
                          .filter((column) => column !== "Service")
                          .map((column) => (
                            <Badge key={column} variant="secondary" className="bg-[#FFF7F8] text-[#6a6a6a] border-[#BEBEBE]">
                              {column}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {group.rows.slice(0, 4).map((row) => (
                        <div
                          key={`${group.title}-${row.Service}`}
                          className="rounded-xl border border-[#F5C5C5] bg-white p-3"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <p className="font-medium text-gray-800 text-sm">{row.Service}</p>
                            <div className="flex flex-wrap gap-2">
                              {group.columns
                                .filter((column) => column !== "Service")
                                .map((column) => (
                                  <span
                                    key={`${row.Service}-${column}`}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[#F5C5C5] bg-[#F5C5C5]/60 px-2.5 py-1 text-xs text-gray-700"
                                  >
                                    <span className="text-[#BEBEBE] font-semibold">{column}:</span>
                                    {row[column] ?? "-"}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {group.rows.length > 4 ? (
                        <p className="text-xs text-[#7a7a7a]">+ {group.rows.length - 4} more services in this group</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

