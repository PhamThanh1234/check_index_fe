export async function uploadImageWithMetadata(file: File, metadata: any) {
  const formData = new FormData();
  formData.append('file', file); // phải là 'file' trùng với BE
  formData.append('metadata', JSON.stringify(metadata));
  console.log(metadata)
  const res = await fetch('http://localhost:8888/sett', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  // Trả về blob để tải xuống nếu muốn
  const blob = await res.blob();
  return blob;
}
