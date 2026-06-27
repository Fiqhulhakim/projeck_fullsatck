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
  verified:{ bg: "#f0fdf4", text: "#166534" },
  rejected:{ bg: "#fef2f2", text: "#991b1b" },
};

export const STATUS_ICON = {
  aman:"ti-circle-check",
  waspada:"ti-wave-sine",
  siaga:"ti-alert-triangle",
  bahaya:"ti-alert-octagon",
  pending:"ti-clock",
  verified:"ti-shield-check",
  rejected:"ti-x-circle",
};

export const waterLevelToStatus = (wl) => {
  const level = Number(wl);
  if (level >= 100) return "bahaya";
  if (level >= 60) return "siaga";
  if (level >= 30) return "waspada";
  return "aman";
};