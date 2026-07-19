import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  doc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { HistoryItem } from '../../types/analysis';

const COLLECTION_NAME = 'telemetry_logs';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function isQuotaError(error: any): boolean {
  if (!error) return false;
  const message = error.message || String(error);
  const code = error.code;
  return (
    code === 'resource-exhausted' ||
    message.toLowerCase().includes('quota exceeded') ||
    message.toLowerCase().includes('quota limit exceeded') ||
    message.toLowerCase().includes('free daily read units')
  );
}

export function isPermissionError(error: any): boolean {
  if (!error) return false;
  if (FirestoreService.isPermissionDenied) return true;
  const message = error.message || String(error);
  const code = error.code;
  return (
    code === 'permission-denied' ||
    message.toLowerCase().includes('permission-denied') ||
    message.toLowerCase().includes('missing or insufficient permissions') ||
    message.toLowerCase().includes('permission_denied')
  );
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  if (isQuotaError(error)) {
    FirestoreService.isQuotaExceeded = true;
    console.warn("FirestoreService: Quota limit exceeded detected. Falling back to local offline mode.");
  }

  if (isPermissionError(error)) {
    FirestoreService.isPermissionDenied = true;
    console.warn("FirestoreService: Permission denied detected. Falling back to local offline mode.");
  }

  const isPermissionDenied = error && typeof error === 'object' && ('code' in error) && (error as any).code === 'permission-denied';

  if (isPermissionDenied) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: null,
        email: null,
        emailVerified: null,
        isAnonymous: null,
        tenantId: null,
        providerInfo: []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  throw error;
}

export class FirestoreService {
  static isQuotaExceeded = false;
  static isPermissionDenied = false;

  /**
   * Fetch logs from Firestore with pagination support
   */
  static async getLogs(
    limitCount: number = 10, 
    startAfterTimestamp?: number
  ): Promise<{ items: HistoryItem[]; hasMore: boolean }> {
    if (FirestoreService.isQuotaExceeded) {
      throw new Error("Quota exceeded (cached)");
    }
    if (FirestoreService.isPermissionDenied) {
      throw new Error("Permission denied (cached)");
    }
    try {
      let q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('timestamp', 'desc'), 
        limit(limitCount + 1)
      );
      
      if (startAfterTimestamp) {
        q = query(
          collection(db, COLLECTION_NAME), 
          orderBy('timestamp', 'desc'), 
          startAfter(startAfterTimestamp), 
          limit(limitCount + 1)
        );
      }
      
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
      
      const hasMore = logs.length > limitCount;
      if (hasMore) {
        logs.pop(); // Remove the extra item
      }
      
      return { items: logs, hasMore };
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, COLLECTION_NAME);
      return { items: [], hasMore: false };
    }
  }

  /**
   * Save a new log entry to Firestore
   */
  static async addLog(item: Omit<HistoryItem, 'id'>): Promise<string> {
    if (FirestoreService.isQuotaExceeded) {
      throw new Error("Quota exceeded (cached)");
    }
    if (FirestoreService.isPermissionDenied) {
      throw new Error("Permission denied (cached)");
    }
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        timestamp: item.timestamp,
        result: item.result,
        preview: item.preview,
        outcome: item.outcome
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, COLLECTION_NAME);
      throw e;
    }
  }

  /**
   * Delete a log entry by ID
   */
  static async deleteLog(id: string): Promise<void> {
    if (FirestoreService.isQuotaExceeded) {
      throw new Error("Quota exceeded (cached)");
    }
    if (FirestoreService.isPermissionDenied) {
      throw new Error("Permission denied (cached)");
    }
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  }

  /**
   * Delete all log entries (clears the history)
   */
  static async clearAllLogs(): Promise<void> {
    if (FirestoreService.isQuotaExceeded) {
      throw new Error("Quota exceeded (cached)");
    }
    if (FirestoreService.isPermissionDenied) {
      throw new Error("Permission denied (cached)");
    }
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((document) => {
        batch.delete(doc(db, COLLECTION_NAME, document.id));
      });
      
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, COLLECTION_NAME);
    }
  }
}
