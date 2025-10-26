import { makeAutoObservable } from "mobx";
import type { User } from "./User.ts";

class AuthStore {
    token: string | null = localStorage.getItem("token");
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem("token", token);
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        window.location.href = "/login";

    }
}

export const authStore = new AuthStore();
