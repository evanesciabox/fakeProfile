import { API_URL } from "../constants";

// Maybe it'll be useful soon, who knows...
async function api<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}/${path}`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json() as T;
}

export interface Badge {
    badge: string;
    tooltip: string;
    badge_id?: string;
}

export const getBadges = async (): Promise<Badge[]> => await api("badges");

export const getUsers = async (ids?: string[]): Promise<Record<string, string | null>> => {
    if (ids?.length === 0) return {};

    const url = new URL(API_URL + "/users");
    if (ids && ids.length !== 0) url.searchParams.set("ids", JSON.stringify(ids));

    return await fetch(url).then(c => c.json());
};
