import type { Session } from "../cognitive/types";
const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open("synaptik", 1);
    r.onupgradeneeded = () =>
      r.result.createObjectStore("sessions", { keyPath: "id" });
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
async function transact<T>(
  mode: IDBTransactionMode,
  action: (s: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction("sessions", mode);
    const r = action(tx.objectStore("sessions"));
    tx.oncomplete = () => {
      db.close();
      resolve(r.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}
export const save = (s: Session) => transact("readwrite", (o) => o.put(s));
export const list = () => transact<Session[]>("readonly", (o) => o.getAll());
export const remove = (id: string) =>
  transact("readwrite", (o) => o.delete(id));
export const clear = () => transact("readwrite", (o) => o.clear());
