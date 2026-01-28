'use client';

import {FirebaseErrorListener} from '@/components/FirebaseErrorListener';
import {Auth, getAuth} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import React, {createContext, useContext} from 'react';

import type {FirebaseApp} from 'firebase/app';

// Define the context shape
interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

// Custom hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

// Separate hooks for individual services
export const useFirebaseApp = () => useFirebase().firebaseApp;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;

// Provider component
export function FirebaseProvider({
  children,
  firebaseApp,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
}) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return (
    <FirebaseContext.Provider value={{firebaseApp, auth, firestore}}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}
