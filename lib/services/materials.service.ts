// Materials service — downloadable study materials for the Downloads tab.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";

export interface Material {
  id: string;
  title: string;
  subject: string;
  type: "pdf" | "video";
  file_size: number;
  url: string;
  category: string;
}

export const materialsApi = {
  list(): Promise<Material[]> {
    return api<Material[]>(Endpoints.materials);
  },
};
