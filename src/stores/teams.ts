import { defineStore } from "pinia";
import { ref } from "vue";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import type { Team, TeamPayload } from "@/types";
import { db } from "@/services/firebase";

const teamsCollection = collection(db, "teams");
let unsubscribe: Unsubscribe | null = null;

export const useTeamsStore = defineStore("teams", () => {
  const teams = ref<Team[]>([]); // current realtime roster
  const loading = ref(false); // subscription spinner
  const error = ref<string | null>(null); // surface Firestore issues
  const ready = ref(false); // avoid duplicate subscriptions

  const init = () => {
    if (ready.value || unsubscribe) { return; }
    loading.value = true;
    const q = query(teamsCollection, orderBy("athlete1"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        teams.value = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data() as TeamPayload;
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

  const createTeam = async (payload: TeamPayload) => {
    await addDoc(teamsCollection, payload);
  };

  const updateTeam = async (id: string, payload: Partial<TeamPayload>) => {
    const teamRef = doc(db, "teams", id);
    await updateDoc(teamRef, payload);
  };

  const replaceTeam = async (id: string, payload: TeamPayload) => {
    const teamRef = doc(db, "teams", id);
    await setDoc(teamRef, payload);
  };

  const deleteTeam = async (id: string) => {
    const teamRef = doc(db, "teams", id);
    await deleteDoc(teamRef);
  };

  const dispose = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    ready.value = false;
  };

  return {
    teams,
    loading,
    error,
    ready,
    init,
    createTeam,
    updateTeam,
    replaceTeam,
    deleteTeam,
    dispose,
  };
});
