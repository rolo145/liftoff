import { defineStore } from "pinia";
import { ref } from "vue";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import type { ScheduleEntry, SchedulePayload } from "@/types";
import { db } from "@/services/firebase";

const scheduleCollection = collection(db, "schedule");
let unsubscribe: Unsubscribe | null = null;

export const useScheduleStore = defineStore("schedule", () => {
  const slots = ref<ScheduleEntry[]>([]); // per-team event slots
  const loading = ref(false); // realtime watcher state
  const ready = ref(false); // indicates init already ran
  const error = ref<string | null>(null); // surfaced errors from Firestore

  const init = () => {
    if (ready.value || unsubscribe) { return; }
    loading.value = true;
    const q = query(scheduleCollection, orderBy("snatchTime"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        slots.value = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data() as SchedulePayload;
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

  const saveSlot = async (payload: SchedulePayload) => {
    const existing = await getDocs(query(scheduleCollection, where("teamId", "==", payload.teamId)));
    if (!existing.empty) {
      const docSnapshot = existing.docs[0];
      if (docSnapshot) {
        const slotRef = doc(db, "schedule", docSnapshot.id);
        await updateDoc(slotRef, payload);
        return;
      }
    }
    await addDoc(scheduleCollection, payload);
  };

  const replaceSlot = async (id: string, payload: SchedulePayload) => {
    const slotRef = doc(db, "schedule", id);
    await setDoc(slotRef, payload);
  };

  const dispose = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    ready.value = false;
  };

  return {
    slots,
    loading,
    ready,
    error,
    init,
    saveSlot,
    replaceSlot,
    dispose,
  };
});
