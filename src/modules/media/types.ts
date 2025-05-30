import { Trigger } from "../triggers/types";

export type MediaType =
  | "screen"
  | "feedback"
  | "inter_stimulus"
  | "text"
  | "image"
  | "video"
  | "audio"
  | "save";

export interface TextBlockData {
  html: string;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
}

export interface MediaBlock {
  id?: string;
  type: MediaType;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  data: TextBlockData | any;
  triggers?: Trigger[];
  deleted?: boolean;
}
