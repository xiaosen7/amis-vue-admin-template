import { defaultActivePath } from "@/router";
import { defineStore } from "pinia";

export const usePageStore = defineStore("page", {
  state: () => {
    return {
      activePath: defaultActivePath,
    };
  },
  actions: {
    setActivePath(path: string) {
      this.activePath = path;
    },
  },
});
