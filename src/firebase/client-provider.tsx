'use client';

import React, {useEffect, useState} from 'react';
import type {FirebaseApp} from 'firebase/app';
import type {Auth} from 'firebase/auth';
import type {Firestore} from 'firebase/firestore';
import {FirebaseProvider, initializeFirebase} from '@/firebase';
import {Skeleton} from '@/components/ui/skeleton';
import {getFirebaseConfig} from './config';

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
    let attempts = 0;
    const maxAttempts = 20; // Try for up to 2 seconds
    const interval = 100;

    const tryInitialize = () => {
      const config = getFirebaseConfig();

      if (config && config.apiKey) {
        try {
          const firebaseInstances = initializeFirebase(config);
          setFirebase(firebaseInstances);
        } catch (e: any) {
          console.error('Firebase initialization failed:', e);
          setError(
            'An unexpected error occurred during Firebase initialization.'
          );
        }
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryInitialize, interval);
        } else {
          setError(
            'Firebase configuration could not be loaded. This might be a network issue or a problem with the project setup. Please refresh the page.'
          );
        }
      }
    };

    tryInitialize();
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
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
