import { useEffect, useMemo, useState } from 'react';
import { createId } from '../utils/id';
import { getImage, readFileAsDataUrl } from '../services/imageDb';

export function PhotoUploader({ existingPhotos = [], onChange }) {
  const [localFiles, setLocalFiles] = useState([]);
  const [existingPreviews, setExistingPreviews] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadExisting() {
      const results = await Promise.all(
        existingPhotos.map(async (photo) => {
          const img = await getImage(photo.id);
          return img ? { ...photo, dataUrl: img.dataUrl } : null;
        }),
      );
      if (isMounted) {
        setExistingPreviews(results.filter(Boolean));
      }
    }

    loadExisting();
    return () => {
      isMounted = false;
    };
  }, [existingPhotos]);

  const merged = useMemo(
    () => [
      ...existingPreviews.map((item) => ({ ...item, source: 'saved' })),
      ...localFiles.map((item) => ({ ...item, source: 'new' })),
    ],
    [existingPreviews, localFiles],
  );

  const emitChange = (nextExisting, nextLocal) => {
    onChange({ existingPhotos: nextExisting, newPhotos: nextLocal });
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files ?? []);
    const mapped = await Promise.all(
      files.map(async (file) => ({
        id: createId('img'),
        name: file.name,
        dataUrl: await readFileAsDataUrl(file),
      })),
    );

    const next = [...localFiles, ...mapped];
    setLocalFiles(next);
    emitChange(existingPreviews, next);
    event.target.value = '';
  };

  const removePhoto = (photo) => {
    if (photo.source === 'saved') {
      const nextExisting = existingPreviews.filter((item) => item.id !== photo.id);
      setExistingPreviews(nextExisting);
      emitChange(nextExisting, localFiles);
      return;
    }

    const nextLocal = localFiles.filter((item) => item.id !== photo.id);
    setLocalFiles(nextLocal);
    emitChange(existingPreviews, nextLocal);
  };

  return (
    <div className="photo-uploader">
      <input type="file" multiple accept="image/*" onChange={handleFileSelect} />
      <div className="thumb-grid">
        {merged.map((photo) => (
          <div className="thumb-item" key={photo.id}>
            <img src={photo.dataUrl} alt={photo.name} className="thumb" />
            <button type="button" className="danger-text" onClick={() => removePhoto(photo)}>
              remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
