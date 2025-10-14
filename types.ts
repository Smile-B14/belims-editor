import { ReactNode } from "react";

export interface ImageData {
  data: string; // base64 encoded image
  mimeType: string;
}

export interface TextOverlayData {
  id: string;
  text: string;
  x: number; // percentage of container width
  y: number; // percentage of container height
  fontSize: number; // uses vw for responsiveness, so it's a relative unit
  color: string;
  fontFamily: string;
}

export interface ImageEditingState {
  originalImage: ImageData | null;
  currentImage: ImageData | null;
  history: ImageData[];
  historyIndex: number;
  isLoading: boolean;
  isSuggesting: boolean;
  error: string | null;
  suggestions: string[];
  loadingMessage: string;
  textOverlays: TextOverlayData[];
  selectedTextId: string | null;
  // Brush tool state
  isBrushModeActive: boolean;
  brushSize: number; // in pixels
  brushMask: ImageData | null;
}