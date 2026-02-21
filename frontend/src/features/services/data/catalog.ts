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
          {
            Service: "Swedish Massage",
            M: "PHP 400",
            NM: "PHP 450",
            Description: "Relieves stress and muscle tension",
          },
          {
            Service: "Combination Massage",
            M: "PHP 450",
            NM: "PHP 500",
            Description: "Combination of different massage techniques",
          },
          {
            Service: "Aromatherapy Massage",
            M: "PHP 550",
            NM: "PHP 600",
            Description: "Uses essential oils for relaxation",
          },
          {
            Service: "Deep Tissue Massage",
            M: "PHP 650",
            NM: "PHP 700",
            Description: "Targets deeper muscle layers",
          },
          {
            Service: "Shiatsu Massage",
            M: "PHP 650",
            NM: "PHP 700",
            Description: "Japanese massage using pressure points",
          },
          {
            Service: "Pre-natal Massage",
            M: "PHP 450",
            NM: "PHP 500",
            Description: "Designed for expecting mothers",
          },
          {
            Service: "Post-natal Massage",
            M: "PHP 450",
            NM: "PHP 500",
            Description: "Helps relieve soreness after childbirth",
          },
          {
            Service: "Kiddie Massage",
            M: "PHP 350",
            NM: "PHP 400",
            Description: "Gentle massage for children",
          },
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
          { Service: "Classic Foot Spa with Foot Scrub", M: "PHP 200", NM: "PHP 250" },
          { Service: "Classic Foot Spa with Leg Scrub", M: "PHP 250", NM: "PHP 300" },
          { Service: "Muscular Relief Leg & Foot Spa", M: "PHP 300", NM: "PHP 350" },
          { Service: "Moisture Drench Leg & Foot Spa", M: "PHP 300", NM: "PHP 350" },
          { Service: "Whitening Leg & Foot Spa", M: "PHP 350", NM: "PHP 380" },
          {
            Service: "Callous Care Paraffin Treatment",
            M: "PHP 450",
            NM: "PHP 500",
            Description: "(with Foot Spa)",
          },
          {
            Service: "Sweat-Free Paraffin Treatment",
            M: "PHP 450",
            NM: "PHP 500",
            Description: "(with Foot Spa)",
          },
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
          { Service: "PDT (Photodynamic Therapy)", M: "PHP 200", NM: "PHP 250" },
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
        title: "Facial Whitening Treatment",
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
        title: "IPL Hair Removal Treatment",
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
        title: "Packages",
        columns: ["Service", "Price"],
        rows: [
          { Service: "IPL UA - 12 Sessions", Price: "PHP 4999" },
          { Service: "Unlimited Lifetime UA Sessions", Price: "PHP 20000" },
          { Service: "10 IPL + 5 Intensive Whitening Package (Cash)", Price: "PHP 6999" },
          { Service: "10 IPL + 5 Intensive Whitening Package (Installment Basis*)", Price: "PHP 7500" },
        ],
      },
    ],
  },
  {
    title: "Non-invasive Treatments",
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
        title: "Warts Removal",
        columns: ["Service", "Price"],
        rows: [
          { Service: "Per Piece ( Big Size )", Price: "PHP 299" },
          { Service: "Per Area Except Big Size", Price: "PHP 599" },
          { Service: "Unlimited Face and Neck", Price: "PHP 1499" },
        ],
      },
    ],
  },
  {
    title: "Lashes",
    groups: [
      {
        title: "Lash Lift",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Lash Lift", M: "PHP 400", NM: "PHP 450" },
          { Service: "Lash Lift with Tint", M: "PHP 550", NM: "PHP 600" },
        ],
      },
      {
        title: "Eyelash Extension",
        columns: ["Service", "M", "NM"],
        rows: [
          { Service: "Classic", M: "PHP 1200", NM: "PHP 1300" },
          { Service: "Classic Natural", M: "PHP 1000", NM: "PHP 1100" },
          { Service: "Hybrid", M: "PHP 1500", NM: "PHP 1600" },
          { Service: "Volume", M: "PHP 1800", NM: "PHP 1900" },
        ],
      },
      {
        title: "Refills (within 2-3 weeks)",
        columns: ["Service", "Price"],
        rows: [
          { Service: "Classic Refill", Price: "PHP 700" },
          { Service: "Hybrid Refill", Price: "PHP 900" },
          { Service: "Volume Refill", Price: "PHP 1100" },
        ],
      },
      {
        title: "Removal & Notes",
        columns: ["Service", "Price"],
        rows: [
          { Service: "More than 50% loss = full set price", Price: "-" },
          { Service: "Professional Lash Removal", Price: "PHP 300" },
          { Service: "Removal + new set", Price: "PHP 200 discounted" },
        ],
      },
      {
        title: "Add-ons",
        columns: ["Service", "Price"],
        rows: [
          { Service: "Super Bonder Upgrade", Price: "PHP 150" },
          { Service: "Lash Shampoo", Price: "PHP 100" },
          { Service: "Aftercare Lash Brush", Price: "PHP 50" },
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
          {
            Service: "Anti-Stress Package",
            M: "PHP 899",
            NM: "PHP 1099",
            Description: "Classic Foot Spa + 15mins Sauna + 90mins Swedish Massage",
          },
          {
            Service: "Gentleman's Spa Package",
            M: "PHP 1250",
            NM: "PHP 1400",
            Description: "90mins Combination Massage + Signature Facial + Gent's Pedicure",
          },
          {
            Service: "Maternal Bliss",
            M: "PHP 999",
            NM: "PHP 1099",
            Description: "Pre-natal Massage + Basic Facial + Standard ManiPedi",
          },
          {
            Service: "His & Her Package",
            M: "PHP 2699",
            NM: "PHP 2799",
            Description: "Hydrating Body Scrub + Sauna + 90mins Combination Massage",
          },
          {
            Service: "Besties Spa Escape (3 pax)",
            M: "PHP 2550",
            NM: "PHP 2850",
            Description: "60mins Combination Massage + Signature Facial for 3 pax",
          },
          {
            Service: "Infinity Package",
            M: "PHP 1399",
            NM: "PHP 1599",
            Description: "Exfoliating Body Scrub + 15mins Sauna + Combination Massage + Classic Facial",
          },
          {
            Service: "4+1 Barakada Package",
            M: "-",
            NM: "-",
            Description: "Avail any 4 massages and get 1 free Swedish Massage (available from M-F | 1pm-5pm)",
          },
        ],
      },
      {
        title: "Foot Spa Packages",
        columns: ["Service", "M", "NM"],
        rows: [
          {
            Service: "Package A",
            M: "PHP 299",
            NM: "PHP 399",
            Description: "Classic Foot Spa + Standard Pedicure",
          },
          {
            Service: "Package B",
            M: "PHP 399",
            NM: "PHP 499",
            Description: "Classic Foot Spa + Standard ManiPedi",
          },
          {
            Service: "Package C",
            M: "PHP 499",
            NM: "PHP 599",
            Description: "Classic Foot Spa w Leg Scrub + Standard ManiPedi",
          },
          {
            Service: "Package D",
            M: "PHP 599",
            NM: "PHP 699",
            Description: "Muscular Relief or Moisture Drench Foot Spa + Premium ManiPedi",
          },
          {
            Service: "Package E",
            M: "PHP 649",
            NM: "PHP 699",
            Description: "Whitening Foot Spa + Premium ManiPedi",
          },
        ],
      },
    ],
  },
  {
    title: "Bridal / Birthday Party",
    groups: [
      {
        title: "Party Packages",
        columns: ["Service", "Member", "Non-Member"],
        rows: [
          {
            Service: "Package A",
            Member: "PHP 5000",
            "Non-Member": "PHP 6500",
            Description:
              "GOOD FOR 5 PAX\n\nFor the Bride/Celebrant\nPremium UV Gel Manicure & Pedicure\nWhitening Foot Spa\n\nFor the Guests ~ 4 pax\nPremium Manicure & Pedicure\nClassic Foot Spa with Leg Scrub\n\n5 pax Swedish Massage\n\n4hrs exclusive use of VIP Area\nBasic Party Decor\nBento Cake\n*Regular price will be charge to the additional guests.",
          },
          {
            Service: "Package B",
            Member: "PHP 5000",
            "Non-Member": "PHP 6500",
            Description:
              "GOOD FOR 5 PAX\n\nFor the Bride/Celebrant\nKorean Gel Manicure & Pedicure\nClassic Foot Spa w Foot Scrub\n\nFor the Guests ~ 4 pax\nPremium Manicure & Pedicure\nClassic Foot Spa with Foot Scrub\n\n5 pax Classic Facial\n\n4hrs exclusive use of VIP Area\nBasic Party Decor\nBento Cake\n*Regular price will be charge to the additional guests.",
          },
        ],
      },
    ],
  },
];
