// Profile service — read/update the current user.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import { session } from "@/lib/api/session";
import type { User } from "@/lib/domain/models";

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  exam_type?: string;
  state?: string;
  phone_number?: string;
  avatar_url?: string;
}

export const profileApi = {
  get(): Promise<User> {
    return api<User>(Endpoints.user.profile).then((u) => { session.saveUser(u); return u; });
  },
  update(patch: ProfileUpdate): Promise<void> {
    return api(Endpoints.user.profile, { method: "PUT", body: patch }).then(() => {});
  },
  setAvatar(avatarUrl: string): Promise<void> {
    return this.update({ avatar_url: avatarUrl });
  },
};
