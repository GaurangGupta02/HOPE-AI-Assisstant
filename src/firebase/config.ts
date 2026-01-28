import {FirebaseOptions} from 'firebase/app';

/**
 * The configuration object for the Firebase app.
 *
 * This is a public configuration and can be exposed to the client.
 *
 * **Security Note:** This object is safe to expose to the client. Security is
 * enforced by Firebase Security Rules on the backend, not by hiding these keys.
 *
 * This configuration is automatically populated by Firebase App Hosting.
 *
 * @see https://firebase.google.com/docs/web/setup#config-object
 */
export const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

export function getFirebaseConfig() {
  if (typeof window !== 'undefined' && (window as any).__firebaseConfig) {
    return (window as any).__firebaseConfig;
  }

  if (!firebaseConfig.apiKey) {
    return undefined;
  }
  return firebaseConfig;
}
