export type MediaType = "text" | "image" | "video" | "audio";

export interface TextBlockData {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: "bold";
  fontStyle?: "italic";
  textDecoration?: "underline";
}

export interface MediaBlock {
  id?: string;
  type: MediaType;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  data: TextBlockData | any;
}
