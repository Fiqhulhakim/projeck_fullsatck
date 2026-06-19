export const WILAYAH_DEPOK = [
  "Beji","Bojongsari","Cilodong","Cimanggis",
  "Cinere","Cipayung","Limo","Pancoran Mas",
  "Sawangan","Sukmajaya","Tapos",
];

export const STATUS_BANJIR = [
  { value: "aman",    label: "Aman"    },
  { value: "waspada", label: "Waspada" },
  { value: "siaga",   label: "Siaga"   },
  { value: "bahaya",  label: "Bahaya"  },
];

export const STATUS_COLOR = {
  aman:    { bg: "#dcfce7", text: "#166534" },
  waspada: { bg: "#dbeafe", text: "#1e40af" },
  siaga:   { bg: "#fef3c7", text: "#92400e" },
  bahaya:  { bg: "#fee2e2", text: "#991b1b" },
  pending: { bg: "#f3f4f6", text: "#374151" },
};

export const STATUS_ICON = {
  aman:"✅", waspada:"🔵", siaga:"⚠", bahaya:"🔴", pending:"⏳",
};