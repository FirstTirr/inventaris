export type ProductData = [
  number | string,
  string,
  string,
  string,
  string,
  number,
  string,
];

export type ExportProduct = {
  id: number;
  nama: string;
  kategori: string;
  jurusan: string;
  labor: string;
  jumlah: number;
  status: string;
  keterangan?: string;
};

export type UserMinimal = {
  id_user?: number;
  nama?: string;
  password?: string;
  id_role?: number;
  jurusan?: string;
  nama_jurusan?: string;
};
