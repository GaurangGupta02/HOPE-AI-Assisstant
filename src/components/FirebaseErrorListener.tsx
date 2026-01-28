'use client';

import {useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {errorEmitter} from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const {toast} = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      console.error(error); // Keep console.error for visibility during dev
      toast({
        variant: 'destructive',
        title: 'Permission Error',
        description: 'You do not have permission to perform this action.',
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
