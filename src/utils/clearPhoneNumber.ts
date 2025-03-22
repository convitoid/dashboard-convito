export const  cleanPhoneNumber = (phone: string): string =>  {
    return phone
    .normalize("NFKC") // Normalisasi Unicode
    .replace(/[^\d]/g, ''); // Hapus semua karakter kecuali angka
}

export function removeBidiChars(str: string): string {
    // Menghapus U+202A (LEFT-TO-RIGHT EMBEDDING), U+202C (POP DIRECTIONAL FORMATTING) 
    // dan control characters lainnya
    return str.replace(/[\u200E\u200F\u202A-\u202E\u061C\u2066-\u2069]/g, '');
  }
  
  // Jika perlu, perbarui fungsi cleanString untuk menggunakan fungsi baru ini
  export function cleanString(str: string): string {
    if (!str) return str;
    
    // Hapus karakter bidi terlebih dahulu
    let cleaned = removeBidiChars(str);
    
    // Hapus karakter non-visible lainnya (seperti zero-width)
    cleaned = cleaned.replace(/[^\x20-\x7E\d]/g, '');
    
    return cleaned;
  }


export const detectHiddenChars = (str: string) => {
    return str.split('').map(char => `${char} (${char.charCodeAt(0)})`).join(' | ');
};