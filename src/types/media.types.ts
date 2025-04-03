export type MediaType = "text" | "image" | "video" | "audio";

export interface MediaBlock {
  id?: string;
  type: MediaType;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  data: any;
}
