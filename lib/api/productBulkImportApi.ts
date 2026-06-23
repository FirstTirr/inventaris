import { postProduct } from "@/lib/api/productApi";
import type { ProductCsvPayload } from "@/lib/csv/productCsv";

export type BulkImportResult = {
  success: number;
  failed: number;
  failDetails: string[];
};

export async function importProductsInBulk(
  rows: ProductCsvPayload[],
): Promise<BulkImportResult> {
  let success = 0;
  let failed = 0;
  const failDetails: string[] = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    try {
      await postProduct(row);
      success += 1;
    } catch (error) {
      failed += 1;
      const message =
        error instanceof Error ? error.message : "Unknown import error";
      failDetails.push(`Baris ${i + 2} (${row.nama_barang}): ${message}`);
    }
  }

  return { success, failed, failDetails };
}
