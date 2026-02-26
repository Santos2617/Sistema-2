import { deleteImage, saveImage } from '../services/imageDb';

export async function persistPhotoChanges(previousPhotos = [], photoState) {
  const keptPhotos = photoState.existingPhotos.map(({ id, name }) => ({ id, name }));
  const removed = previousPhotos.filter((photo) => !keptPhotos.some((kept) => kept.id === photo.id));

  await Promise.all(removed.map((photo) => deleteImage(photo.id)));

  await Promise.all(
    photoState.newPhotos.map((photo) =>
      saveImage({
        id: photo.id,
        name: photo.name,
        dataUrl: photo.dataUrl,
      }),
    ),
  );

  const createdPhotos = photoState.newPhotos.map(({ id, name }) => ({ id, name }));
  return [...keptPhotos, ...createdPhotos];
}
