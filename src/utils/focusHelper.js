/**
 * Utility untuk membantu auto-focus ke elemen form pertama yang memiliki error.
 * 
 * @param {Object} errors - Objek error dari Zod atau state validasi. Contoh: { nama_lengkap: ["Error message"], nik: ["Error message"] }
 * @param {number} offset - Jarak offset dari atas layar (berguna jika ada fixed header/navbar). Default 120px.
 */
export const scrollToFirstError = (errors, offset = 120) => {
    if (!errors || Object.keys(errors).length === 0) return;

    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return;

    // Buat selector CSS untuk mencari elemen input, select, textarea yang memiliki atribut name sesuai field error
    const selector = errorFields.map(field => `[name="${field}"]`).join(',');
    
    // querySelectorAll mengembalikan elemen berdasarkan urutan kemunculannya di DOM (Document Object Model)
    // Jadi elemen indeks [0] pasti adalah elemen paling atas di layar
    const elements = document.querySelectorAll(selector);

    if (elements && elements.length > 0) {
        const firstElement = elements[0];
        
        // Kalkulasi posisi scroll
        const elementPosition = firstElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        // Scroll dengan efek smooth
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // Fokuskan kursor ke elemen tersebut, preventScroll agar tidak lompat secara default (karena sudah di-scroll smooth)
        setTimeout(() => {
            firstElement.focus({ preventScroll: true });
        }, 100); // Beri sedikit jeda agar scroll mulus terlebih dahulu
    }
};
