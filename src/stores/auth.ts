import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { ADMIN_UIDS, auth, googleProvider } from "@/services/firebase";

let unsubscribeAuth: Unsubscribe | null = null;
let initPromise: Promise<void> | null = null;

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null); // Firebase Auth user record
  const loading = ref(false); // login / subscription state
  const ready = ref(false); // ensures single onAuthStateChanged listener
  const error = ref<string | null>(null); // displayable auth errors

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => (user.value ? ADMIN_UIDS.includes(user.value.uid) : false));

  const init = () => {
    if (ready.value || initPromise) {
      return initPromise;
    }

    loading.value = true;
    initPromise = new Promise<void>((resolve) => {
      unsubscribeAuth = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          user.value = firebaseUser;
          loading.value = false;
          ready.value = true;
          error.value = null;
          resolve();
        },
        (err) => {
          error.value = err.message;
          loading.value = false;
          ready.value = true;
          resolve();
        },
      );
    });

    return initPromise;
  };

  const ensureAuthReady = async () => {
    if (!ready.value) {
      await (init() ?? Promise.resolve());
      if (initPromise) {
        await initPromise;
      }
    }
  };

  const signInWithGooglePopup = async () => {
    try {
      loading.value = true;
      error.value = null;
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unable to sign in.";
    } finally {
      loading.value = false;
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const dispose = () => {
    if (unsubscribeAuth) {
      unsubscribeAuth();
      unsubscribeAuth = null;
    }
  };

  return {
    user,
    loading,
    ready,
    error,
    isAuthenticated,
    isAdmin,
    init,
    ensureAuthReady,
    signInWithGoogle: signInWithGooglePopup,
    signOut: signOutUser,
    dispose,
  };
});
