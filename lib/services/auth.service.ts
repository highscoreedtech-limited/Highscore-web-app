// Auth service — wraps the /auth/* endpoints and owns the login/logout side
// effects on the session store. Mirrors the mobile AuthNotifier.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import { session } from "@/lib/api/session";
import type { AuthData, User } from "@/lib/domain/models";

export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  referred_by?: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const data = await api<AuthData>(Endpoints.auth.login, { method: "POST", auth: false, body: { email, password } });
    session.save(data.access_token, data.refresh_token, data.user);
    return data.user;
  },

  async register(input: RegisterInput): Promise<void> {
    await api(Endpoints.auth.register, { method: "POST", auth: false, body: input });
  },

  // verify-email returns tokens → the user is logged in afterwards.
  async verifyEmail(email: string, code: string): Promise<User> {
    const data = await api<AuthData>(Endpoints.auth.verifyEmail, { method: "POST", auth: false, body: { email, code } });
    session.save(data.access_token, data.refresh_token, data.user);
    return data.user;
  },

  async resendOtp(email: string): Promise<void> {
    await api(Endpoints.auth.resendOtp, { method: "POST", auth: false, body: { email } });
  },

  async forgotPassword(email: string): Promise<void> {
    await api(Endpoints.auth.forgotPassword, { method: "POST", auth: false, body: { email } });
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await api(Endpoints.auth.resetPassword, { method: "POST", auth: false, body: { email, code, new_password: newPassword } });
  },

  async profile(): Promise<User> {
    const user = await api<User>(Endpoints.user.profile);
    session.saveUser(user);
    return user;
  },

  logout() {
    session.clear();
  },
};
