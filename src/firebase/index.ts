import {
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';

// Re-export hooks and providers
export {
  FirebaseProvider,
  useAuth,
  useFirebase,
  useFirebaseApp,
  useFirestore,
} from './provider';
export {FirebaseClientProvider} from './client-provider';
export {useUser} from './auth/use-user';
export {useDoc} from './firestore/use-doc';
export {useCollection} from './firestore/use-collection';
export {FirestorePermissionError} from './errors';
export {errorEmitter} from './error-emitter';

// Initialize Firebase App
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase(firebaseConfig: FirebaseOptions): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (firebaseConfig && firebaseConfig.apiKey) {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);

    return {firebaseApp, auth, firestore};
  } else {
    throw new Error(
      'Firebase config is not defined or is missing an API key.'
    );
  }
}
