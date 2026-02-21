export interface ServiceCatalogGroup {
  title: string;
  columns: string[];
  rows: Array<Record<string, string>>;
}

export interface ServiceCatalogSection {
  title: string;
  groups: ServiceCatalogGroup[];
}

export const SERVICE_CATALOG: ServiceCatalogSection[] = [
  {
    title: "Body Massage",
    groups: [
      {
        title: "Massages",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Swedish Massage", M: "PHP 400", NM: "PHP 450" },
          { Service: "Combination Massage", M: "PHP 450", NM: "PHP 500" },
          { Service: "Aromatherapy Massage", M: "PHP 550", NM: "PHP 600" },
          { Service: "Deep Tissue Massage", M: "PHP 650", NM: "PHP 700" },
          { Service: "Shiatsu Massage", M: "PHP 650", NM: "PHP 700" },
          { Service: "Pre-natal Massage", M: "PHP 450", NM: "PHP 500" },
          { Service: "Post-natal Massage", M: "PHP 450", NM: "PHP 500" },
          { Service: "Kiddie Massage", M: "PHP 350", NM: "PHP 400" },
        ],
      },
      {
        title: "Add-ons",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Hot Stone", M: "PHP 350", NM: "PHP 400" },
          { Service: "Ventosa (Fire Cupping)", M: "PHP 350", NM: "PHP 400" },
          { Service: "Additional 30 Minutes", M: "PHP 250", NM: "PHP 300" },
          { Service: "Ear Candling", M: "PHP 150", NM: "PHP 200" },
          { Service: "Sauna (20 mins)", M: "PHP 150", NM: "PHP 200" },
          { Service: "Quick Shower", M: "PHP 100", NM: "PHP 150" },
        ],
      },
      {
        title: "30 Minutes Spot Massage",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Foot Reflexology", M: "PHP 350", NM: "PHP 400" },
          { Service: "Back Massage", M: "PHP 300", NM: "PHP 350" },
          { Service: "Head, Shoulder & Arms", M: "PHP 300", NM: "PHP 350" },
          { Service: "Back, Head & Shoulder", M: "PHP 300", NM: "PHP 350" },
          { Service: "Foot & Leg Massage", M: "PHP 300", NM: "PHP 350" },
        ],
      },
    ],
  },
  {
    title: "Nail Spa",
    groups: [
      {
        title: "Manicure",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Regular Polished Manicure", M: "PHP 120", NM: "PHP 150" },
          { Service: "Premium Polished Manicure", M: "PHP 150", NM: "PHP 180" },
          { Service: "Korean Gel Manicure", M: "PHP 400", NM: "PHP 500" },
          { Service: "Premium Gel Manicure", M: "PHP 450", NM: "PHP 550" },
        ],
      },
      {
        title: "Pedicure",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Regular Polished Pedicure", M: "PHP 150", NM: "PHP 180" },
          { Service: "Premium Polished Pedicure", M: "PHP 180", NM: "PHP 200" },
          { Service: "Korean Gel Pedicure", M: "PHP 450", NM: "PHP 550" },
          { Service: "Premium Gel Pedicure", M: "PHP 550", NM: "PHP 650" },
        ],
      },
      {
        title: "Nail Extension",
        columns: ["Service", "S", "M", "L"],
        rows: [
          { Service: "Acrylic with Gel Polish", S: "PHP 1100", M: "PHP 1200", L: "PHP 1300" },
          { Service: "Polygel with Gel Polish", S: "PHP 1100", M: "PHP 1200", L: "PHP 1300" },
          { Service: "Softgel with Gel Polish", S: "PHP 900", M: "PHP 1000", L: "PHP 1100" },
        ],
      },
      {
        title: "Other",
        columns: ["Service", "Price"],
        rows: [
          { Service: "Gems / Nail Art (per nail)", Price: "PHP 50" },
          { Service: "Removal", Price: "PHP 200" },
        ],
      },
    ],
  },
  {
    title: "Hand, Foot & Body Spa",
    groups: [
      {
        title: "Hand Treatment",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Detox Bliss Hand Spa", M: "PHP 200", NM: "PHP 250" },
          { Service: "Radiant Glow Hand Spa", M: "PHP 200", NM: "PHP 250" },
          { Service: "Sweat-Free Paraffin Treatment", M: "PHP 250", NM: "PHP 300" },
          { Service: "Radiant Glow Paraffin Treatment", M: "PHP 250", NM: "PHP 300" },
          { Service: "Hand Spa & Hand Paraffin Package", M: "PHP 399", NM: "PHP 499" },
        ],
      },
      {
        title: "Foot Treatment",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Classic Foot Spa w/ Foot Scrub", M: "PHP 200", NM: "PHP 250" },
          { Service: "Classic Foot Spa w/ Leg Scrub", M: "PHP 250", NM: "PHP 300" },
          { Service: "Muscular Relief Leg & Foot Spa", M: "PHP 300", NM: "PHP 350" },
          { Service: "Moisture Drench Leg & Foot Spa", M: "PHP 300", NM: "PHP 350" },
          { Service: "Whitening Leg & Foot Spa", M: "PHP 350", NM: "PHP 380" },
          { Service: "Callous Care Paraffin (w/ Foot Spa)", M: "PHP 450", NM: "PHP 500" },
          { Service: "Sweat-Free Paraffin (w/ Foot Spa)", M: "PHP 450", NM: "PHP 500" },
        ],
      },
      {
        title: "Body Treatment",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Exfoliating Body Scrub", M: "PHP 600", NM: "PHP 650" },
          { Service: "Hydrating Body Scrub", M: "PHP 650", NM: "PHP 700" },
          { Service: "Whitening Body Scrub", M: "PHP 700", NM: "PHP 750" },
          { Service: "Backcial Treatment", M: "PHP 1499", NM: "PHP 1599" },
          { Service: "Butt Facial Treatment", M: "PHP 900", NM: "PHP 999" },
        ],
      },
    ],
  },
  {
    title: "Facial Care",
    groups: [
      {
        title: "Facial Treatment",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Classic Facial", M: "PHP 300", NM: "PHP 350" },
          { Service: "Signature Facial", M: "PHP 500", NM: "PHP 550" },
          { Service: "Deep Cleansing Facial", M: "PHP 600", NM: "PHP 650" },
          { Service: "Diamond Peel Facial", M: "PHP 700", NM: "PHP 750" },
          { Service: "Tightening Facial Treatment", M: "PHP 650", NM: "PHP 700" },
          { Service: "Acne Marks Facial Treatment", M: "PHP 650", NM: "PHP 700" },
          { Service: "PDT (Add-on)", M: "PHP 200", NM: "PHP 250" },
        ],
      },
      {
        title: "Face Tightening / Slimming",
        columns: ["Service", "Price"],
        rows: [
          { Service: "RF Whole Face", Price: "PHP 1500" },
          { Service: "RF Chin", Price: "PHP 550" },
          { Service: "RF Cheek & Eyes", Price: "PHP 750" },
          { Service: "RF V-line", Price: "PHP 550" },
        ],
      },
      {
        title: "Facial Whitening",
        columns: ["Service", "Price"],
        rows: [
          { Service: "IPL Skin Rejuvenating Treatment", Price: "PHP 1550" },
          { Service: "Black Doll Facial Treatment", Price: "PHP 1300" },
          { Service: "5 Session Black Doll Facial (Cash)", Price: "PHP 4599" },
          { Service: "5 Session Black Doll Facial (Installment)", Price: "PHP 4999" },
        ],
      },
    ],
  },
  {
    title: "Hair Removal",
    groups: [
      {
        title: "Waxing",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Half Arm", M: "PHP 300", NM: "PHP 350" },
          { Service: "Full Arm", M: "PHP 400", NM: "PHP 450" },
          { Service: "Lower Leg", M: "PHP 450", NM: "PHP 500" },
          { Service: "Upper Leg", M: "PHP 400", NM: "PHP 450" },
          { Service: "Full Leg", M: "PHP 750", NM: "PHP 800" },
          { Service: "Underarm", M: "PHP 300", NM: "PHP 350" },
          { Service: "Bikini", M: "PHP 550", NM: "PHP 600" },
          { Service: "Brazilian", M: "PHP 600", NM: "PHP 650" },
        ],
      },
      {
        title: "IPL Hair Removal",
        columns: ["Service", "Price"],
        rows: [
          { Service: "IPL Underarms", Price: "PHP 500" },
          { Service: "IPL Upper Lips", Price: "PHP 350" },
          { Service: "IPL Whole Face", Price: "PHP 1500" },
          { Service: "IPL Brazilian", Price: "PHP 2000" },
          { Service: "IPL Thighs", Price: "PHP 1000" },
          { Service: "IPL Lower Leg", Price: "PHP 1500" },
          { Service: "IPL Full Legs", Price: "PHP 2500" },
        ],
      },
      {
        title: "IPL Packages",
        columns: ["Service", "Price"],
        rows: [
          { Service: "IPL UA - 12 Sessions", Price: "PHP 4999" },
          { Service: "Unlimited Lifetime UA Sessions", Price: "PHP 20000" },
          { Service: "10 IPL + 5 Intensive Whitening (Cash)", Price: "PHP 6999" },
          { Service: "10 IPL + 5 Intensive Whitening (Installment)", Price: "PHP 7500" },
        ],
      },
    ],
  },
  {
    title: "Other Services",
    groups: [
      {
        title: "Whitening Treatments",
        columns: ["Service", "Price"],
        rows: [
          { Service: "IPL Underbutt Skin Rejuv", Price: "PHP 1200" },
          { Service: "IPL Underarm Skin Rejuv", Price: "PHP 1200" },
          { Service: "Intensive Underarm Peel", Price: "PHP 750" },
          { Service: "UA Carbon Peel Laser", Price: "PHP 1500" },
          { Service: "Knee Carbon Peel Laser", Price: "PHP 1500" },
          { Service: "Elbow Carbon Peel Laser", Price: "PHP 1250" },
        ],
      },
      {
        title: "Tightening / Slimming",
        columns: ["Service", "Price"],
        rows: [
          { Service: "RF Thighs", Price: "PHP 1500" },
          { Service: "RF Arms", Price: "PHP 550" },
          { Service: "RF Love Handle", Price: "PHP 750" },
          { Service: "RF Lower Belly", Price: "PHP 550" },
          { Service: "RF Upper Belly", Price: "PHP 550" },
          { Service: "RF Whole Belly", Price: "PHP 1000" },
        ],
      },
      {
        title: "Lash",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Lash Lift", M: "PHP 400", NM: "PHP 450" },
          { Service: "Lash Lift with Tint", M: "PHP 550", NM: "PHP 600" },
        ],
      },
    ],
  },
  {
    title: "Packages",
    groups: [
      {
        title: "Spa Packages",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Anti-Stress Package", M: "PHP 899", NM: "PHP 999" },
          { Service: "Gentleman's Spa Package", M: "PHP 1250", NM: "PHP 1400" },
          { Service: "Maternal Bliss", M: "PHP 999", NM: "PHP 1099" },
          { Service: "His & Her Package", M: "PHP 2699", NM: "PHP 2799" },
          { Service: "Besties Spa Escape (3 pax)", M: "PHP 2550", NM: "PHP 2850" },
          { Service: "Infinity Package", M: "PHP 1399", NM: "PHP 1599" },
        ],
      },
      {
        title: "Foot Spa Packages",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Package A", M: "PHP 299", NM: "PHP 399" },
          { Service: "Package B", M: "PHP 399", NM: "PHP 499" },
          { Service: "Package C", M: "PHP 499", NM: "PHP 599" },
          { Service: "Package D", M: "PHP 599", NM: "PHP 699" },
          { Service: "Package E", M: "PHP 649", NM: "PHP 699" },
        ],
      },
      {
        title: "Bridal / Birthday Party",
        columns: ["Service", "Member", "Non-Member"],
        rows: [
          { Service: "Package A", Member: "PHP 5000", "Non-Member": "PHP 6500" },
          { Service: "Package B", Member: "PHP 5000", "Non-Member": "PHP 6500" },
        ],
      },
    ],
  },
];

