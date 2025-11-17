import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, doc, onSnapshot, orderBy, query, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Result, ResultPayload } from '@/types';

const resultsCollection = collection(db, 'results');
let unsubscribe: Unsubscribe | null = null;

export const useResultsStore = defineStore('results', () => {
  const results = ref<Result[]>([]); // per-team result documents
  const loading = ref(false); // realtime subscription state
  const ready = ref(false); // ensures init only wires once
  const error = ref<string | null>(null); // last Firestore error message

  const init = () => {
    if (ready.value || unsubscribe) return;
    loading.value = true;
    const q = query(resultsCollection, orderBy('teamId'));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        results.value = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data() as ResultPayload;
          return {
            id: docSnapshot.id,
            ...data,
          };
        });
        ready.value = true;
        loading.value = false;
        error.value = null;
      },
      (err) => {
        error.value = err.message;
        loading.value = false;
      },
    );
  };

  const saveResult = async (payload: ResultPayload) => {
    const resultRef = doc(db, 'results', payload.teamId);
    await setDoc(resultRef, payload, { merge: true });
    return resultRef.id;
  };

  const savePartial = async (teamId: string, partial: Partial<ResultPayload>) => {
    const resultRef = doc(db, 'results', teamId);
    await setDoc(resultRef, { teamId, ...partial }, { merge: true });
  };

  const dispose = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    ready.value = false;
  };

  return {
    results,
    loading,
    ready,
    error,
    init,
    saveResult,
    savePartial,
    dispose,
  };
});
