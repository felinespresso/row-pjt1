// EXPORT BUTTON PEMBERKASAN

import { FC } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface PemberkasanItem {
  namaDesa: string;
  spanTower: string;
  bidangLahan: string;
  namaPemilik: string;
  tanggalPelaksanaan: string | null;
  keterangan: string;
}

interface ExportButtonProps {
  pemberkasanData: PemberkasanItem[];
}

const ExportButtonPemberkasan: FC<ExportButtonProps> = ({ pemberkasanData }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tabel Data Pemberkasan");

    // Tambahkan header dengan style
    worksheet.columns = [
      { header: "NO.", key: "no", width: 5 },
      { header: "NAMA DESA", key: "namaDesa", width: 30 },
      { header: "SPAN TOWER", key: "spanTower", width: 25 },
      { header: "NOMOR BIDANG", key: "bidangLahan", width: 25 },
      { header: "NAMA PEMILIK", key: "namaPemilik", width: 30 },
      { header: "TANGGAL PELAKSANAAN", key: "tanggalPelaksanaan", width: 30 },
      { header: "KETERANGAN", key: "keterangan", width: 25 },
    ];

    // Styling untuk header (baris pertama)
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" }, // Background color
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Tambahkan data ke worksheet
    pemberkasanData.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        namaDesa: item.namaDesa || "-",
        spanTower: item.spanTower || "-",
        bidangLahan: item.bidangLahan || "-",
        namaPemilik: item.namaPemilik || "-",
        tanggalPelaksanaan: item.tanggalPelaksanaan
          ? new Date(item.tanggalPelaksanaan).toLocaleDateString()
          : "-",
        keterangan: item.keterangan || "-",
      });
    });

    // Styling untuk setiap cell data
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generate dan simpan file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Tabel Data Pemberkasan.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="px-4 py-2 text-white transition duration-200 ease-in-out bg-green-600 hover:-translate-1 hover:scale-110 hover:bg-green-700 rounded-xl"
    >
      <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="22px"
          height="22px"
          fill="white"
        >
          <path d="M 24.607422 4.0429688 C 24.347041 4.0335549 24.0813 4.0541387 23.814453 4.1074219 L 8.6171875 7.1464844 C 6.5228355 7.5659519 5 9.4229991 5 11.558594 L 5 36.441406 C 5 38.576376 6.5230144 40.434668 8.6171875 40.853516 L 23.814453 43.892578 C 25.758786 44.281191 27.556602 42.890921 27.875 41 L 37.5 41 C 40.519774 41 43 38.519774 43 35.5 L 43 13.5 C 43 10.480226 40.519774 8 37.5 8 L 28 8 L 28 7.5390625 C 28 5.6340003 26.430086 4.1088659 24.607422 4.0429688 z M 24.402344 7.0488281 C 24.741566 6.9810934 25 7.1922764 25 7.5390625 L 25 40.460938 C 25 40.807724 24.741273 41.019122 24.402344 40.951172 A 1.50015 1.50015 0 0 0 24.402344 40.949219 L 9.2070312 37.910156 A 1.50015 1.50015 0 0 0 9.2050781 37.910156 C 8.4941947 37.768284 8 37.165812 8 36.441406 L 8 11.558594 C 8 10.834188 8.4953832 10.230423 9.2070312 10.087891 L 24.402344 7.0488281 z M 28 11 L 37.5 11 C 38.898226 11 40 12.101774 40 13.5 L 40 35.5 C 40 36.898226 38.898226 38 37.5 38 L 28 38 L 28 11 z M 31.5 15 A 1.50015 1.50015 0 1 0 31.5 18 L 35.5 18 A 1.50015 1.50015 0 1 0 35.5 15 L 31.5 15 z M 12.998047 17.158203 C 12.709209 17.150498 12.414094 17.226453 12.152344 17.392578 C 11.454344 17.837578 11.249359 18.763891 11.693359 19.462891 L 14.681641 24.158203 L 11.693359 28.853516 C 11.249359 29.552516 11.454344 30.478828 12.152344 30.923828 C 12.402344 31.081828 12.681031 31.158203 12.957031 31.158203 C 13.452031 31.158203 13.938609 30.913844 14.224609 30.464844 L 16.458984 26.953125 L 18.693359 30.462891 C 18.980359 30.911891 19.465937 31.158203 19.960938 31.158203 C 20.236938 31.158203 20.513672 31.083828 20.763672 30.923828 C 21.461672 30.478828 21.668609 29.550563 21.224609 28.851562 L 18.238281 24.158203 L 21.224609 19.464844 C 21.668609 18.765844 21.461672 17.837578 20.763672 17.392578 C 20.066672 16.948578 19.139359 17.153516 18.693359 17.853516 L 16.458984 21.363281 L 14.224609 17.851562 C 13.946484 17.414062 13.479443 17.171045 12.998047 17.158203 z M 31.5 23 A 1.50015 1.50015 0 1 0 31.5 26 L 35.5 26 A 1.50015 1.50015 0 1 0 35.5 23 L 31.5 23 z M 31.5 31 A 1.50015 1.50015 0 1 0 31.5 34 L 35.5 34 A 1.50015 1.50015 0 1 0 35.5 31 L 31.5 31 z" />
        </svg>
        <span>EKSPOR</span>
      </div>
    </button>
  );
};

export default ExportButtonPemberkasan;
