'use client';

import React, {useEffect, useState} from 'react';
import type {FirebaseApp} from 'firebase/app';
import type {Auth} from 'firebase/auth';
import type {Firestore} from 'firebase/firestore';
import {FirebaseProvider, initializeFirebase} from '@/firebase';
import {Skeleton} from '@/components/ui/skeleton';

export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firebase, setFirebase] = useState<{
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const firebaseInstances = initializeFirebase();
      setFirebase(firebaseInstances);
    } catch (e: any) {
      console.error(e);
      setError(
        'Firebase configuration is missing. Please check your environment variables.'
      );
    }
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center text-destructive">
          <h2 className="text-lg font-semibold">Firebase Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!firebase) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider firebaseApp={firebase.firebaseApp}>
      {children}
    </FirebaseProvider>
  );
};
