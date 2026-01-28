'use client';

import {useEffect, useState, useMemo} from 'react';
import {
  onSnapshot,
  collection,
  query,
  type Query,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import {useFirestore} from '@/firebase/provider';
import {FirestorePermissionError} from '@/firebase/errors';
import {errorEmitter} from '@/firebase/error-emitter';

export function useCollection<T extends DocumentData>(
  path: string,
  ...queryConstraints: QueryConstraint[]
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const q = useMemo(
    () => (path ? query(collection(firestore, path), ...queryConstraints) : null),
    [firestore, path, ...queryConstraints]
  );

  useEffect(() => {
    if (!q) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setIsLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection: ${q.path}`, err);
        const permissionError = new FirestorePermissionError({
          path: q.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return {data, isLoading, ref: q};
}
