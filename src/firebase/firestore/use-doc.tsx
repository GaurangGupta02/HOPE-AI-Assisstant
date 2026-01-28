'use client';

import {useEffect, useState, useMemo} from 'react';
import {
  onSnapshot,
  doc,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';
import {useFirestore} from '@/firebase/provider';
import {FirestorePermissionError} from '@/firebase/errors';
import {errorEmitter} from '@/firebase/error-emitter';

export function useDoc<T extends DocumentData>(
  path: string,
  ...pathSegments: string[]
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const docRef = useMemo(
    () => (path ? doc(firestore, path, ...pathSegments) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [firestore, path, ...pathSegments]
  );

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        const data = snapshot.data() as T | undefined;
        setData(data ?? null);
        setIsLoading(false);
      },
      (err) => {
        console.error(`Error fetching doc: ${docRef.path}`, err);
        const permissionError = new FirestorePermissionError({
          path: (docRef as DocumentReference).path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return {data, isLoading, ref: docRef};
}
