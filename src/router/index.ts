import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import type { Pinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/results" },
  {
    path: "/results",
    component: () => import("@/pages/Results/ResultsPage.vue"),
    meta: { title: "Leaderboard" },
  },
  {
    path: "/teams",
    component: () => import("@/pages/Teams/TeamsPage.vue"),
    meta: { title: "Teams" },
  },
  {
    path: "/schedule",
    component: () => import("@/pages/Schedule/SchedulePage.vue"),
    meta: { title: "Schedule" },
  },
  {
    path: "/admin/login",
    component: () => import("@/pages/Admin/Login.vue"),
    meta: { title: "Admin Login" },
  },
  {
    path: "/admin/dashboard",
    component: () => import("@/pages/Admin/Dashboard.vue"),
    meta: { requiresAdmin: true, title: "Admin Dashboard" },
  },
  {
    path: "/admin/dashboard/teams",
    component: () => import("@/pages/Admin/TeamsEditor.vue"),
    meta: { requiresAdmin: true, title: "Teams Editor" },
  },
  {
    path: "/admin/dashboard/workout",
    component: () => import("@/pages/Admin/WorkoutEditor.vue"),
    meta: { requiresAdmin: true, title: "Workout Editor" },
  },
  {
    path: "/admin/dashboard/results",
    component: () => import("@/pages/Admin/ResultsEditor.vue"),
    meta: { requiresAdmin: true, title: "Results Editor" },
  },
  {
    path: "/admin/dashboard/schedule",
    component: () => import("@/pages/Admin/ScheduleEditor.vue"),
    meta: { requiresAdmin: true, title: "Schedule Editor" },
  },
  { path: "/:pathMatch(.*)*", redirect: "/results" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export const registerGuards = (pinia: Pinia) => {
  // protect admin routes on navigation and keep document titles in sync
  router.beforeEach(async (to: RouteLocationNormalized) => {
    if (to.meta.requiresAdmin) {
      const authStore = useAuthStore(pinia);
      await authStore.ensureAuthReady();
      if (!authStore.isAdmin) {
        return {
          path: "/admin/login",
          query: { redirect: to.fullPath },
        };
      }
    }
    if (to.meta.title) {
      document.title = `LiftOff | ${to.meta.title as string}`;
    } else {
      document.title = "LiftOff";
    }
    return true;
  });
};

export default router;
