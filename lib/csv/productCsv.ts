export type ProductCsvPayload = {
  nama_barang: string;
  category: string;
  jurusan: string;
  labor: string;
  jumlah: number;
  status: string;
};

export type ProductCsvParseResult = {
  rows: ProductCsvPayload[];
  errors: string[];
};

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur.trim());
  return out;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/\s+/g, " ").trim();
}

function resolveColumnIndexes(headers: string[]) {
  const normalized = headers.map(normalizeHeader);

  const findIndex = (aliases: string[]) =>
    normalized.findIndex((h) => aliases.includes(h));

  return {
    nama: findIndex(["nama perangkat", "nama barang", "nama_product", "nama product"]),
    kategori: findIndex(["kategori", "category"]),
    jurusan: findIndex(["jurusan", "nama jurusan"]),
    labor: findIndex(["labor", "nama labor"]),
    jumlah: findIndex(["jumlah", "jumlah barang", "qty", "quantity"]),
    status: findIndex(["status", "kondisi"]),
  };
}

function toStatusValue(value: string): string {
  const v = value.trim().toLowerCase();
  if (v.includes("baik")) return "BAIK";
  if (v.includes("rusak")) return "RUSAK";
  return value.trim().toUpperCase();
}

export function parseProductCsv(raw: string): ProductCsvParseResult {
  const cleaned = raw.replace(/^\uFEFF/, "");
  const lines = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      rows: [],
      errors: ["CSV minimal harus memiliki header dan 1 baris data."],
    };
  }

  const headerCols = splitCsvLine(lines[0]);
  const idx = resolveColumnIndexes(headerCols);

  const requiredKeys: Array<keyof typeof idx> = [
    "nama",
    "kategori",
    "jurusan",
    "labor",
    "jumlah",
    "status",
  ];

  const missing = requiredKeys.filter((k) => idx[k] === -1);
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [
        `Header CSV tidak lengkap. Kolom wajib: Nama Perangkat, Kategori, Jurusan, Labor, Jumlah, Status. Missing: ${missing.join(", ")}`,
      ],
    };
  }

  const rows: ProductCsvPayload[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cols = splitCsvLine(lines[i]);
    const lineNo = i + 1;

    const nama = String(cols[idx.nama] ?? "").trim();
    const category = String(cols[idx.kategori] ?? "").trim();
    const jurusan = String(cols[idx.jurusan] ?? "").trim();
    const labor = String(cols[idx.labor] ?? "").trim();
    const jumlahRaw = String(cols[idx.jumlah] ?? "").trim();
    const statusRaw = String(cols[idx.status] ?? "").trim();

    if (!nama || !category || !jurusan || !labor || !jumlahRaw || !statusRaw) {
      errors.push(`Baris ${lineNo}: ada kolom wajib yang kosong.`);
      continue;
    }

    const jumlah = Number(jumlahRaw);
    if (!Number.isFinite(jumlah) || jumlah < 0) {
      errors.push(`Baris ${lineNo}: jumlah tidak valid (${jumlahRaw}).`);
      continue;
    }

    rows.push({
      nama_barang: nama,
      category,
      jurusan,
      labor,
      jumlah: Math.floor(jumlah),
      status: toStatusValue(statusRaw),
    });
  }

  return { rows, errors };
}
