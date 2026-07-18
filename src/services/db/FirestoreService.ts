import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  doc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { HistoryItem } from '../../types/analysis';

const COLLECTION_NAME = 'telemetry_logs';

export class FirestoreService {
  /**
   * Fetch all logs from Firestore ordered by timestamp descending
   */
  static async getLogs(): Promise<HistoryItem[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const logs: HistoryItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          timestamp: data.timestamp,
          result: data.result,
          preview: data.preview,
          outcome: data.outcome
        } as HistoryItem);
      });
      
      return logs;
    } catch (e) {
      console.error("FirestoreService: Failed to fetch logs", e);
      throw e;
    }
  }

  /**
   * Save a new log entry to Firestore
   */
  static async addLog(item: Omit<HistoryItem, 'id'>): Promise<string> {
    try {
      // Create a document with auto-generated ID
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        timestamp: item.timestamp,
        result: item.result,
        preview: item.preview,
        outcome: item.outcome
      });
      return docRef.id;
    } catch (e) {
      console.error("FirestoreService: Failed to add log", e);
      throw e;
    }
  }

  /**
   * Delete a log entry by ID
   */
  static async deleteLog(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.error(`FirestoreService: Failed to delete log ${id}`, e);
      throw e;
    }
  }

  /**
   * Delete all log entries (clears the history)
   */
  static async clearAllLogs(): Promise<void> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((document) => {
        batch.delete(doc(db, COLLECTION_NAME, document.id));
      });
      
      await batch.commit();
    } catch (e) {
      console.error("FirestoreService: Failed to clear all logs", e);
      throw e;
    }
  }
}
