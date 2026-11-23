import { proxyLazy } from "@utils/lazy";
import { zustandCreate } from "@webpack/common";
import { getUsers } from "../lib/api";
import { debounce } from "@shared/debounce";
import { FETCH_COOLDOWN } from "../constants";

interface UserData {
    banner?: string;
    avatar?: string;
    nameplate?: string;
    fetchedAt: Date;
}

interface UsersState {
    users: Map<string, UserData>;
    fetchQueue: Set<string>;
    bulkFetch: () => Promise<void>;
    fetch: (userId: string, force?: boolean) => Promise<void>;
    fetchMany: (userIds: string[]) => Promise<void>;
    get: (userId: string) => UserData | undefined;
    set: (userId: string, data: Partial<UserData>) => void;
}

export interface Nameplate {
    imgAlt: string;
    palette: {
        darkBackground: string;
        lightBackground: string;
        name: string;
    };
    src: string;
}

export const usersStore = proxyLazy(() => zustandCreate((set: any, get: any) => ({
    users: new Map<string, UserData>(),
    fetchQueue: new Set(),
    bulkFetch: debounce(async () => {
        const { fetchQueue, users } = get();

        if (fetchQueue.size === 0) return;

        set({ fetchQueue: new Set() });

        const fetchIds = [...fetchQueue];
        const fetchedUsers = await getUsers(fetchIds);
        const newUsers = new Map(users);

        const now = new Date();
        for (const fetchId of fetchIds) {
            const newUser = fetchedUsers[fetchId] ?? null;
            newUsers.set(fetchId, newUser);
        }

        set({ users: newUsers });
    }),
    async fetch(userId: string, force: boolean = false) {
        const { users, fetchQueue, bulkFetch } = get();

        const { fetchedAt } = users.get(userId) ?? {};
        if (fetchedAt) {
            if (!force && Date.now() - fetchedAt.getTime() < FETCH_COOLDOWN) return;
        }

        set({ fetchQueue: new Set(fetchQueue).add(userId) });
        bulkFetch();
    },
    async fetchMany(userIds) {
        if (!userIds.length) return;
        const { users, fetchQueue, bulkFetch } = get();

        const newFetchQueue = new Set(fetchQueue);

        const now = Date.now();
        for (const userId of userIds) {
            const { fetchedAt } = users.get(userId) ?? {};
            if (fetchedAt) {
                if (now - fetchedAt.getTime() < FETCH_COOLDOWN) continue;
            }
            newFetchQueue.add(userId);
        }

        set({ fetchQueue: newFetchQueue });
        bulkFetch();
    },
    get(userId: string) { return get().users.get(userId); },
    getDecorAsset(userId: string) { return get().users.get(userId)?.decoration; },
    set(userId: string, data: Partial<UserData>) {
        const { users } = get();
        const newUsers = new Map(users);

        newUsers.set(userId, { ...data, fetchedAt: new Date() });
        set({ users: newUsers });
    }
} as UsersState)));
