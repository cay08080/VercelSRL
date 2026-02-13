
export const saveVideoFile = async (id: string, file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SRL_Database', 3);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['videos'], 'readwrite');
      const store = transaction.objectStore('videos');
      const putRequest = store.put(file, id);

      putRequest.onsuccess = () => resolve(`indexeddb://${id}`);
      putRequest.onerror = () => reject('Error saving video');
    };

    request.onerror = () => reject('Error opening DB');
  });
};

export const getVideoFile = async (id: string): Promise<File | null> => {
  return new Promise((resolve) => {
    const request = indexedDB.open('SRL_Database', 3);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('videos')) return resolve(null);
      const transaction = db.transaction(['videos'], 'readonly');
      const store = transaction.objectStore('videos');
      const getRequest = store.get(id);
      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => resolve(null);
    };
    request.onerror = () => resolve(null);
  });
};
