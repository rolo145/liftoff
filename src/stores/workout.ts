import { defineStore } from 'pinia';
import { ref } from 'vue';
import { doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import type { Workout } from '@/types';
import { db } from '@/services/firebase';

const workoutRef = doc(db, 'workout', 'current');
let unsubscribe: Unsubscribe | null = null;

export const useWorkoutStore = defineStore('workout', () => {
  const workout = ref<Workout | null>(null); // latest workout description
  const loading = ref(false); // watcher state
  const error = ref<string | null>(null); // Firestore error messages
  const ready = ref(false); // avoids duplicating listeners

  const init = () => {
    if (ready.value || unsubscribe) return;
    loading.value = true;
    unsubscribe = onSnapshot(
      workoutRef,
      (snapshot) => {
        if (snapshot.exists()) {
          workout.value = {
            id: snapshot.id,
            ...(snapshot.data() as Omit<Workout, 'id'>),
          };
        } else {
          workout.value = null;
        }
        loading.value = false;
        error.value = null;
        ready.value = true;
      },
      (err) => {
        error.value = err.message;
        loading.value = false;
      },
    );
  };

  const saveWorkout = async (payload: Omit<Workout, 'id'>) => {
    await setDoc(workoutRef, payload, { merge: true });
  };

  const dispose = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    ready.value = false;
  };

  return {
    workout,
    loading,
    error,
    ready,
    init,
    saveWorkout,
    dispose,
  };
});
