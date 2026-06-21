export const handleDownload = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengambil file');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download error:', error);
        alert('Gagal mengunduh file. Silakan coba lagi.');
    }
};
