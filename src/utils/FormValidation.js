import { z } from 'zod';

/**
 * Skema Validasi Identitas Peserta Didik
 * Memetakan langsung ke model `identitas_peserta_didik` di database.
 */
export const identitasSchemaBase = z.object({
  // === WAJIB (NOT NULL di DB) ===
  nisn: z.string().min(10, "NISN harus 10 karakter").max(20, "NISN maksimal 20 karakter"),
  nis: z.string().min(4, "NIS harus 4 karakter").max(20, "NIS maksimal 20 karakter"),          // NOT NULL
  nama_lengkap: z.string().min(3, "Nama lengkap wajib diisi").max(120),
  id_jenis_kelamin: z.coerce.number({ invalid_type_error: "Jenis kelamin wajib dipilih" }).min(1, "Jenis kelamin wajib dipilih"),
  no_skhun: z.string().min(1, "No. SKHUN wajib diisi").max(50),                           // NOT NULL
  nilai_skhu: z.coerce.number({ invalid_type_error: "Nilai SKHU wajib diisi" }).min(0.01, "Nilai SKHU wajib diisi"),
  no_un: z.string().min(1, "No. Ujian Nasional wajib diisi").max(30),                     // NOT NULL
  nik: z.string().length(16, "NIK harus 16 karakter"),
  id_sekolah: z.coerce.number({ invalid_type_error: "Sekolah asal wajib dipilih" }).min(1, "Sekolah asal wajib dipilih"),
  tempat_lahir: z.string().min(3, "Tempat lahir wajib diisi").max(80),
  tanggal_lahir: z.union([z.string(), z.date()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Tanggal lahir wajib diisi",
    })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Format tanggal lahir tidak valid",
    }),
  id_agama: z.coerce.number({ invalid_type_error: "Agama wajib dipilih" }).min(1, "Agama wajib dipilih"),
  anak_ke: z.coerce.number({ invalid_type_error: "Anak ke- wajib diisi" }).min(1, "Anak ke- minimal 1"),
  id_transportasi: z.coerce.number({ invalid_type_error: "Transportasi wajib dipilih" }).min(1, "Transportasi wajib dipilih"),
  id_jenis_tinggal: z.coerce.number({ invalid_type_error: "Jenis tinggal wajib dipilih" }).min(1, "Jenis tinggal wajib dipilih"),
                                 // NOT NULL
  no_reg_akta_lahir: z.string().min(1, "No. Akta kelahiran wajib diisi").max(40, "Maks. 40 karakter"),
  alamat_tempat_tinggal: z.string().min(5, "Alamat wajib diisi").max(255),
  id_provinsi: z.coerce.number({ invalid_type_error: "Provinsi wajib dipilih" }).min(1, "Provinsi wajib dipilih"),
  id_kabupaten: z.coerce.number({ invalid_type_error: "Kabupaten/Kota wajib dipilih" }).min(1, "Kabupaten/Kota wajib dipilih"),
  id_kecamatan: z.coerce.number({ invalid_type_error: "Kecamatan wajib dipilih" }).min(1, "Kecamatan wajib dipilih"),
  id_kelurahan: z.coerce.number({ invalid_type_error: "Kelurahan wajib dipilih" }).min(1, "Kelurahan wajib dipilih"),   // NOT NULL (FK ke kelurahan)
  dusun: z.string().min(1, "Dusun wajib diisi").max(50),                                  // NOT NULL

  // === OPSIONAL (NULL DEFAULT di DB) ===
  no_ijazah: z.string().max(50).optional().nullable(),
  saudara_kandung: z.coerce.number().min(0).optional().nullable(),
  saudara_tiri: z.coerce.number().min(0).optional().nullable(),
  saudara_angkat: z.coerce.number().min(0).optional().nullable(),
  id_kebutuhan_khusus: z.coerce.number({ invalid_type_error: "Kebutuhan Khusus wajib dipilih" }).min(1, "Kebutuhan Khusus wajib dipilih").optional().nullable(),
  telp_rumah: z.string().max(20).optional().nullable(),
  no_hp: z.string().max(20).optional().nullable(),
  email_pribadi: z.string().email("Format email tidak valid").or(z.literal('')).optional().nullable(),
  penerima_kps_pkh: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional().nullable()),
  penerima_kip: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional().nullable()),
  rt: z.string().max(5).optional().nullable(),
  rw: z.string().max(5).optional().nullable(),

  // === CONDITIONAL REQUIRED (wajib hanya jika penerima_kip = true) ===

  nama_di_kip: z.string().max(120).optional().nullable(),
  no_kip: z.string().max(6).optional().nullable(),

  // 
// === CONDITIONAL REQUIRED (wajib hanya jika penerima_kps_pkh = true) ===
  no_kks: z.string().max(30).optional().nullable(),
});

export const addIdentitasRefinements = (schema) => schema.superRefine((data, ctx) => {
  if (data.penerima_kip === true || data.penerima_kip === 'true') {
    if (!data.no_kip || data.no_kip.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['no_kip'],
        message: 'No. KIP wajib diisi jika Anda penerima KIP',
      });
    }
    if (!data.nama_di_kip || data.nama_di_kip.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nama_di_kip'],
        message: 'Nama di KIP wajib diisi jika Anda penerima KIP',
      });
    }
  }
  if (data.penerima_kps_pkh === true || data.penerima_kps_pkh === 'true') {
    if (!data.no_kks || data.no_kks.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['no_kks'],
        message: 'No. KKS wajib diisi jika Anda penerima KPS/PKH',
      });
    }
  }
});

export const identitasSchema = addIdentitasRefinements(identitasSchemaBase);


/**
 * Skema Validasi Data Ayah
 */
export const ayahSchema = z.object({
  nama: z.string().min(3, "Nama Ayah wajib diisi").max(120),
  tahun_lahir: z.coerce.number().min(1900, "Tahun lahir tidak valid").max(new Date().getFullYear()),
  pekerjaan_ayah: z.coerce.number({ invalid_type_error: "Pekerjaan wajib dipilih" }).min(1, "Pekerjaan wajib dipilih"),
  pendidikan_ayah: z.coerce.number({ invalid_type_error: "Pendidikan wajib dipilih" }).min(1, "Pendidikan wajib dipilih"),
  penghasilan_bulanan_ayah: z.coerce.number({ invalid_type_error: "Penghasilan wajib dipilih" }).min(1, "Penghasilan wajib dipilih"),
  kebutuhan_khusus_ayah: z.coerce.number({ invalid_type_error: "Kebutuhan khusus wajib dipilih" }).min(1, "Kebutuhan khusus wajib dipilih"),
});

/**
 * Skema Validasi Data Ibu
 */
export const ibuSchema = z.object({
  nama: z.string().min(3, "Nama Ibu wajib diisi").max(120),
  tahun_lahir: z.coerce.number().min(1900, "Tahun lahir tidak valid").max(new Date().getFullYear()),
  pekerjaan_ibu: z.coerce.number({ invalid_type_error: "Pekerjaan wajib dipilih" }).min(1, "Pekerjaan wajib dipilih"),
  pendidikan_ibu: z.coerce.number({ invalid_type_error: "Pendidikan wajib dipilih" }).min(1, "Pendidikan wajib dipilih"),
  penghasilan_bulanan_ibu: z.coerce.number({ invalid_type_error: "Penghasilan wajib dipilih" }).min(1, "Penghasilan wajib dipilih"),
  kebutuhan_khusus_ibu: z.coerce.number({ invalid_type_error: "Kebutuhan khusus wajib dipilih" }).min(1, "Kebutuhan khusus wajib dipilih"),
});

/**
 * Skema Validasi Data Wali
 */
export const waliSchema = z.object({
  nama: z.string().min(3, "Nama Wali wajib diisi").max(120),
  tahun_lahir: z.coerce.number().min(1900, "Tahun lahir tidak valid").max(new Date().getFullYear()),
  pekerjaan_wali: z.coerce.number({ invalid_type_error: "Pekerjaan wajib dipilih" }).min(1, "Pekerjaan wajib dipilih"),
  pendidikan_wali: z.coerce.number({ invalid_type_error: "Pendidikan wajib dipilih" }).min(1, "Pendidikan wajib dipilih"),
  penghasilan_bulanan_wali: z.coerce.number({ invalid_type_error: "Penghasilan wajib dipilih" }).min(1, "Penghasilan wajib dipilih"),
  kebutuhan_khusus_wali: z.coerce.number({ invalid_type_error: "Kebutuhan khusus wajib dipilih" }).min(1, "Kebutuhan khusus wajib dipilih"),
});

/**
 * Skema Validasi Data Periodik (Kesehatan & Jarak)
 */
export const periodikSchema = z.object({
  tinggi_badan: z.coerce.number().min(10, "Tinggi badan tidak valid").max(300),
  berat_badan: z.coerce.number().min(1, "Berat badan tidak valid").max(300),
  jarak_tempat_tinggal_kesekolah: z.coerce.number().min(1, "Jarak tidak valid"),
  waktu_tempuh_berangkat_sekolah: z.coerce.number().min(1, "Waktu tempuh tidak valid"),
});

/**
 * Skema Validasi Data Prestasi
 */
export const prestasiSchema = z.object({
  jenis_prestasi: z.string().min(1, "Jenis prestasi wajib diisi"),
  tingkat_prestasi: z.string().min(1, "Tingkat prestasi wajib diisi"),
  nama_prestasi: z.string().min(3, "Nama prestasi wajib diisi").max(120),
  tahun_prestasi: z.coerce.number().min(2000, "Tahun tidak valid").max(new Date().getFullYear()),
  penyelenggara: z.string().optional().nullable(),
  bukti_prestasi: z.any().optional().nullable(), // Bisa string URL atau File object di frontend
});

/**
 * Validasi Komprehensif (Payload Gabungan)
 * Digunakan jika ingin memvalidasi seluruh form sekaligus (misal saat final submit)
 */
export const fullPendaftaranSchema = z.object({
  id_pendaftaran: z.coerce.number(),
  identitas_peserta_didik: addIdentitasRefinements(identitasSchemaBase.extend({
    ayah: ayahSchema.optional().nullable(),
    ibu: ibuSchema.optional().nullable(),
    wali: waliSchema.optional().nullable(),
    periodik: periodikSchema.optional().nullable(),
    prestasi: z.array(prestasiSchema).optional().nullable(),
  })),
});

/**
 * Skema Validasi Berkas Persyaratan
 */
export const berkasPersyaratanSchema = z.object({
  jenis_berkas: z.string().min(1, "Jenis berkas wajib diisi"),
  nama_file: z.string().min(1, "Nama file wajib diisi"),
  path_file: z.string().min(1, "Path file wajib diisi"),
  mandatory: z.boolean().optional().nullable(),
  status_upload: z.string().optional().nullable()
});

export const persyaratanPayloadSchema = z.object({
  id_pendaftaran: z.coerce.number(),
  berkas_persyaratan: z.array(berkasPersyaratanSchema).min(0, "Data persyaratan tidak boleh kosong")
});

