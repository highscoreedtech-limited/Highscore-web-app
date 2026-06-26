// Game service — matchmaking (online users, friends, challenges).
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import type { OnlineUser } from "@/lib/domain/models";

export const gameApi = {
  onlineUsers: () => api<OnlineUser[]>(Endpoints.users.online),
  friends: () => api<OnlineUser[]>(Endpoints.friends.list),
  searchUsers: (q: string) => api<OnlineUser[]>(`${Endpoints.users.search}?q=${encodeURIComponent(q)}`),
  addFriend: (userId: string) => api(Endpoints.friends.add, { method: "POST", body: { user_id: userId } }),
  sendChallenge: (toUserId: string, subject: string) =>
    api(Endpoints.challenge.send, { method: "POST", body: { to_user_id: toUserId, subject } }),
  respondChallenge: (challengeId: string, accept: boolean) =>
    api(Endpoints.challenge.respond, { method: "POST", body: { challenge_id: challengeId, accept } }),
};
