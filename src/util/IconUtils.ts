async function urlToDataUrl(url: string) {
    let response = await fetch(url);
    let blob: Blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as any)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    });
}

async function fileToDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result as any)
        reader.onerror = reject
        reader.readAsDataURL(file);
    })
}

function getImageDimensions(url: string): Promise<{width: number, height: number}> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({width: img.naturalWidth, height: img.naturalHeight});
        img.onerror = reject;
        img.src = url;
    });
}

async function hashImage(dataUrl: string): Promise<string> {
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export {urlToDataUrl, getImageDimensions, fileToDataUrl, hashImage}
