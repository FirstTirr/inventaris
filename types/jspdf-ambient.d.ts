declare module "jspdf";
declare module "jspdf/dist/jspdf.es.min.js";
declare module "jspdf/dist/jspdf.umd.min.js";
declare module "jspdf-autotable";
declare module "jspdf-autotable/dist/jspdf.plugin.autotable.mjs";
declare module "jspdf-autotable/dist/jspdf.plugin.autotable.js";

// Minimal typing for jsPDF's autoTable augmentation
interface jsPDF {
  autoTable?: any;
}

declare const jsPDF: any;

export {};
