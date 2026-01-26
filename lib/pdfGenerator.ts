// @ts-nocheck
import { ExportProduct } from "@/types/product";

type JsPDFInstance = {
  internal: {
    pageSize: { getWidth: () => number; getHeight: () => number };
    getNumberOfPages?: () => number;
  };
  setFontSize: (n: number) => void;
  text: (
    text: string,
    x: number,
    y: number,
    opts?: Record<string, unknown>,
  ) => void;
  save: (name: string) => void;
  setLineWidth: (n: number) => void;
  setDrawColor: (...args: number[]) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  setPage: (n: number) => void;
};

type JsPDFCtor = new (opts: {
  orientation?: string;
  unit?: string;
  format?: string;
}) => JsPDFInstance;

export const generateProductReport = async (
  selectedPrintJurusan: string,
  selectedPrintMonth: string,
  selectedPrintLabor: string,
  selectedAcademicYear: string,
  cityForPrint: string,
  products: ExportProduct[],
  signatureName: string,
  printReporterNip: string,
) => {
  // dynamic import to avoid SSR issues and keep bundle small
  let jsPDFModule: any = null;
  try {
    jsPDFModule = await import("jspdf");
  } catch (e1) {
    try {
      // @ts-expect-error - Dynamic import path may not have declarations
      jsPDFModule = await import("jspdf/dist/jspdf.es.min.js");
    } catch (e2) {
      try {
        // @ts-expect-error - Dynamic import path may not have declarations
        jsPDFModule = await import("jspdf/dist/jspdf.umd.min.js");
      } catch (e3) {
        console.warn(
          "Local jspdf imports failed, will try CDN fallback",
          e3 || e2 || e1,
        );
        jsPDFModule = null;
      }
    }
  }

  let jsPDF: JsPDFCtor | null = null;
  if (jsPDFModule) {
    const moduleRecord = jsPDFModule as Record<string, unknown>;
    jsPDF =
      (moduleRecord.jsPDF as JsPDFCtor) ||
      (moduleRecord.default as JsPDFCtor) ||
      (jsPDFModule as JsPDFCtor);
  }

  // autotable plugin: try ESM then UMD plugin
  try {
    await import("jspdf-autotable");
  } catch (at1) {
    console.warn("autotable import failed", at1);
  }

  // If jsPDF still not available, attempt to load UMD bundles from CDN and use globals
  if (!jsPDF) {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (typeof window === "undefined")
          return reject(new Error("No window"));
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(s);
      });

    try {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/dist/jspdf.plugin.autotable.js",
      );
      const win = window as unknown as Record<string, unknown>;
      jsPDF =
        ((win &&
          (win["jspdf"] as unknown) &&
          (win["jspdf"] as unknown as Record<string, unknown>)[
            "jsPDF"
          ]) as unknown as JsPDFCtor) ||
        (win["jsPDF"] as unknown as JsPDFCtor) ||
        ((win &&
          (win["jspdf"] as unknown) &&
          (win["jspdf"] as unknown as Record<string, unknown>)["default"] &&
          (
            (win["jspdf"] as unknown as Record<string, unknown>)[
              "default"
            ] as Record<string, unknown>
          )["jsPDF"]) as unknown as JsPDFCtor);
      if (!jsPDF) throw new Error("jsPDF global not found after CDN load");
    } catch (cdnErr) {
      console.warn("CDN fallback for jsPDF failed:", cdnErr);
      throw cdnErr;
    }
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const title = `DAFTAR INVENTARIS LABOR JURUSAN ${String(
    selectedPrintJurusan || "",
  ).toUpperCase()}`;
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, 40, { align: "center" });
  doc.setFontSize(10);
  doc.text(String(selectedPrintMonth || ""), pageWidth / 2, 56, {
    align: "center",
  });

  if (selectedPrintLabor) {
    doc.text(String(selectedPrintLabor), pageWidth / 2, 72, {
      align: "center",
    });
    if (selectedAcademicYear) {
      doc.setFontSize(9);
      doc.text(String(selectedAcademicYear), pageWidth / 2, 88, {
        align: "center",
      });
      doc.setFontSize(10);
    }
  } else if (selectedPrintMonth) {
    doc.text(String(selectedPrintMonth), pageWidth / 2, 72, {
      align: "center",
    });
    if (selectedAcademicYear) {
      doc.setFontSize(9);
      doc.text(String(selectedAcademicYear), pageWidth / 2, 88, {
        align: "center",
      });
      doc.setFontSize(10);
    }
  } else {
    doc.text(`TP. ${new Date().getFullYear()}`, pageWidth / 2, 72, {
      align: "center",
    });
  }

  const body = products.map((p: ExportProduct, idx: number) => [
    idx + 1,
    p.nama ?? "",
    p.jumlah ?? "",
    String(p.status ?? "").toLowerCase() === "baik",
    String(p.status ?? "").toLowerCase() !== "baik",
    p.keterangan ?? "",
  ]);

  let checkPngDataUrl: string | null = null;
  if (typeof window !== "undefined") {
    try {
      const createCheckPng = (size: number) =>
        new Promise<string>((resolve, reject) => {
          try {
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'><path d='M20 6L9 17l-5-5' fill='none' stroke='#000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5'/></svg>`;
            const img = new Image();
            img.onload = () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("no-canvas-ctx"));
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(img, 0, 0, size, size);
                resolve(canvas.toDataURL("image/png"));
              } catch (err) {
                reject(err);
              }
            };
            img.onerror = (e) => reject(e);
            img.src =
              "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
          } catch (err) {
            reject(err);
          }
        });

      checkPngDataUrl = await createCheckPng(48);
    } catch (err) {
      console.warn(
        "Failed to render check icon PNG, will fallback to vector drawing:",
        err,
      );
      checkPngDataUrl = null;
    }
  }

  (
    doc as unknown as {
      autoTable?: (opts: Record<string, unknown>) => void;
    }
  ).autoTable?.({
    startY: selectedPrintLabor ? 100 : 90,
    head: [["No", "Nama Barang", "Jumlah", "Baik", "Rusak", "Keterangan"]],
    body,
    styles: { font: "helvetica", fontSize: 9, textColor: 20 },
    headStyles: { fillColor: [34, 34, 34], textColor: 255 },
    theme: "grid",
    margin: { left: 40, right: 40 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 220 },
      2: { cellWidth: 60 },
      3: { cellWidth: 40 },
      4: { cellWidth: 40 },
      5: { cellWidth: 140 },
    },
    didParseCell: (data: any) => {
      try {
        const column = data.column;
        const cell = data.cell;
        if (
          column &&
          (column.index === 3 || column.index === 4) &&
          cell &&
          typeof cell.raw === "boolean"
        ) {
          cell.text = [""];
        }
      } catch {
        // ignore
      }
    },
    didDrawCell: (data: any) => {
      try {
        const col = data.column?.index as number;
        const cell = data.cell;
        if (
          col !== undefined &&
          (col === 3 || col === 4) &&
          cell &&
          cell.raw === true
        ) {
          const w = (cell.width as number) || 0;
          const h = (cell.height as number) || 0;
          const imgSize = Math.min(w * 0.6, h * 0.6, 18);
          const imgX = ((cell.x as number) || 0) + (w - imgSize) / 2;
          const imgY = ((cell.y as number) || 0) + (h - imgSize) / 2;

          if (checkPngDataUrl) {
            try {
              (doc as any).addImage(
                checkPngDataUrl,
                "PNG",
                imgX,
                imgY,
                imgSize,
                imgSize,
              );
            } catch (imgErr) {
              try {
                if ((doc as any).setLineCap) (doc as any).setLineCap("round");
                if ((doc as any).setLineJoin) (doc as any).setLineJoin("round");
              } catch {}
              doc.setDrawColor(0, 0, 0);
              doc.setLineWidth(1.6);
              const startX = ((cell.x as number) || 0) + w * 0.22;
              const startY = ((cell.y as number) || 0) + h * 0.62;
              const midX = ((cell.x as number) || 0) + w * 0.42;
              const midY = ((cell.y as number) || 0) + h * 0.78;
              const endX = ((cell.x as number) || 0) + w * 0.78;
              const endY = ((cell.y as number) || 0) + h * 0.28;
              doc.line(startX, startY, midX, midY);
              doc.line(midX, midY, endX, endY);
            }
          } else {
            try {
              if ((doc as any).setLineCap) (doc as any).setLineCap("round");
              if ((doc as any).setLineJoin) (doc as any).setLineJoin("round");
            } catch {}
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(1.6);
            const startX = ((cell.x as number) || 0) + w * 0.22;
            const startY = ((cell.y as number) || 0) + h * 0.62;
            const midX = ((cell.x as number) || 0) + w * 0.42;
            const midY = ((cell.y as number) || 0) + h * 0.78;
            const endX = ((cell.x as number) || 0) + w * 0.78;
            const endY = ((cell.y as number) || 0) + h * 0.28;
            doc.line(startX, startY, midX, midY);
            doc.line(midX, midY, endX, endY);
          }
        }
      } catch {
        // ignore
      }
    },
  });

  try {
    const pageCount =
      typeof doc.internal.getNumberOfPages === "function"
        ? doc.internal.getNumberOfPages()!
        : 1;
    const lastPage = pageCount || 1;
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setPage(lastPage);
    doc.setFontSize(10);

    try {
      const now = new Date();
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
      const printedDate = cityForPrint
        ? `${cityForPrint}, ${monthYear}`
        : monthYear;

      const leftX = 40;
      const labelY = pageHeight - 140;
      const printedDateY = labelY - 22;

      try {
        doc.setFontSize(10);
        doc.text(String(printedDate || monthYear), leftX, printedDateY, {
          align: "left",
        });
      } catch (dateErr) {
        console.warn("Failed to draw printed date:", dateErr);
      }
      const sigLineYLeft = pageHeight - 90;
      const sigNameYLeft = pageHeight - 60;

      const jurusanLabel = (
        String(selectedPrintJurusan || "").trim() || ""
      ).toUpperCase();
      const labelLine = jurusanLabel
        ? `Mengetahui Kabeng ${jurusanLabel}`
        : `Mengetahui Kabeng`;
      doc.text(labelLine, leftX, labelY, { align: "left" });

      try {
        doc.setLineWidth(0.6);
        const leftLineStart = leftX + 10;
        const leftLineEnd = leftX + 150;
        doc.line(leftLineStart, sigLineYLeft, leftLineEnd, sigLineYLeft);
      } catch (leftLineErr) {
        console.warn("Failed to draw left signature line:", leftLineErr);
      }

      if (signatureName) {
        doc.text(String(signatureName), leftX + 10, sigNameYLeft, {
          align: "left",
        });
        try {
          const signatureNip = (printReporterNip || "").toString().trim();
          if (signatureNip) {
            doc.setFontSize(9);
            doc.text(
              `NIP. ${String(signatureNip)}`,
              leftX + 10,
              sigNameYLeft + 14,
              {
                align: "left",
              },
            );
            doc.setFontSize(10);
          }
        } catch {
          // ignore
        }
      }
    } catch (dateErr) {
      console.warn("Failed to draw printed date or signature blocks:", dateErr);
    }
  } catch (sigErr) {
    console.warn("Failed to draw signature/date on PDF:", sigErr);
  }

  const safeJurusan = (selectedPrintJurusan || "jurusan")
    .replace(/\s+/g, "-")
    .toLowerCase();
  const safeSchool = (selectedPrintMonth || String(new Date().getFullYear()))
    .replace(/\s+/g, "-")
    .toLowerCase();
  const fileName = `laporan-${safeJurusan}-${safeSchool}.pdf`;
  doc.save(fileName);
};

export const fallbackPrintHtml = (
  selectedPrintJurusan: string,
  selectedPrintMonth: string,
  selectedPrintLabor: string,
  selectedAcademicYear: string,
  cityForPrint: string,
  products: ExportProduct[],
  signatureName: string,
  printReporterNip: string,
) => {
  const escapeHtml = (unsafe: unknown) => {
    if (unsafe === null || unsafe === undefined) return "";
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const generateReportHtml = (
    jurusanTitle: string,
    monthLabel: string,
    laborLabel: string,
    academicYear: string,
    productsList: ExportProduct[],
    signatureName: string,
    signatureNip: string,
  ) => {
    const now = new Date();
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const printedDateHtml = `${escapeHtml(cityForPrint)}${
      cityForPrint ? ", " : ""
    }${escapeHtml(monthNames[now.getMonth()])} ${now.getFullYear()}`;

    const header = `<div style="position:relative;margin-bottom:12px;line-height:1.1"><div style="text-align:center"><h3 style="margin:0;padding:0;">DAFTAR INVENTARIS LABOR JURUSAN ${escapeHtml(
      jurusanTitle.toUpperCase(),
    )}</h3><div style="font-weight:700">${escapeHtml(
      (monthLabel && monthLabel.toString().trim()) || "",
    )}</div><div style="margin-top:4px">${escapeHtml(
      laborLabel || "",
    )}</div><div style="margin-top:2px;font-size:12px">${escapeHtml(
      academicYear || "",
    )}</div></div></div>`;

    const tableRows = productsList
      .map((p: ExportProduct, idx: number) => {
        const isBaik = String(p.status ?? "").toLowerCase() === "baik";
        const isRusak = !isBaik;
        return `
            <tr>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                idx + 1
              }</td>
              <td style="border:1px solid #444;padding:6px;">${escapeHtml(
                p.nama,
              )}</td>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                p.jumlah ?? ""
              }</td>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                isBaik ? "✓" : ""
              }</td>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                isRusak ? "✓" : ""
              }</td>
              <td style="border:1px solid #444;padding:6px;text-align:left;">${escapeHtml(
                p.keterangan ?? "",
              )}</td>
            </tr>`;
      })
      .join("\n");

    const table = `
        <table style="width:100%;border-collapse:collapse;background:#111;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">No</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Nama Barang</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Jumlah</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Baik</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Rusak</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>`;

    const signatureHtml = signatureName
      ? `
            <div style="position:fixed;left:40px;bottom:40px;font-family:Arial,Helvetica,sans-serif;">
              <div style="margin-bottom:6px;">${escapeHtml(
                printedDateHtml,
              )}</div>
              <div style="margin-bottom:6px;">${escapeHtml(
                (jurusanTitle || "").toString().trim()
                  ? `Mengetahui Kabeng ${escapeHtml(
                      (jurusanTitle || "").toString().toUpperCase(),
                    )}`
                  : `Mengetahui Kabeng`,
              )}</div>
              <div style="width:220px;border-bottom:1px solid #000;margin-bottom:8px;margin-top:18px;"></div>
              <div><strong>${escapeHtml(signatureName)}</strong></div>
              ${
                signatureNip
                  ? `<div style="margin-top:4px;">NIP. ${escapeHtml(
                      signatureNip,
                    )}</div>`
                  : ""
              }
            </div>
          `
      : `<div style="position:fixed;left:40px;bottom:40px;font-family:Arial,Helvetica,sans-serif;">${printedDateHtml}</div>`;

    return `<!doctype html><html><head><meta charset="utf-8"><title>Report ${escapeHtml(
      jurusanTitle,
    )}</title></head><body style="margin:20px;">${header}${table}${signatureHtml}</body></html>`;
  };

  if (typeof window !== "undefined") {
    const signatureNip = (printReporterNip || "").toString().trim();
    const html = generateReportHtml(
      selectedPrintJurusan || "",
      selectedPrintMonth || "",
      selectedPrintLabor || "",
      selectedAcademicYear || "",
      products,
      signatureName,
      signatureNip,
    );
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      alert("Popup diblokir. Izinkan popup untuk mendownload laporan.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch (e) {
        console.error("Print failed:", e);
      }
    }, 500);
  }
};
