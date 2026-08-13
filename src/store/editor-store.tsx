import { blur_type, generation_type } from "@/generated/prisma/enums";
import { create } from "zustand";

export interface editorStore {
  generation_type: generation_type;
  blur_type: blur_type;
  target_image: File | null;
  target_video: File | null;
  target_image_face: File | null;
  face_id: string | null;
  setGenerationType: (type: generation_type) => void;
  setBlurType: (type: blur_type) => void;
  setTargetImage: (file: File | null) => void;
  setTargetVideo: (file: File | null) => void;
  setTargetImageFace: (file: File | null) => void;
  setFaceId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  generation_type: "BLUR_PERSON" as generation_type,
  blur_type: "PIXELATE" as blur_type,
  target_image: null,
  target_video: null,
  target_image_face: null,
  face_id: null,
};

export const useEditor = create<editorStore>((set) => ({
  ...initialState,

  setGenerationType: (generation_type) => set({ generation_type }),

  setBlurType: (blur_type) => set({ blur_type }),

  setTargetImage: (target_image) => set({ target_image }),
  setTargetImageFace: (target_image_face) => set({ target_image_face }),

  setTargetVideo: (target_video) => set({ target_video }),
  setFaceId: (face_id) => set({ face_id }),

  reset: () => set(initialState),
}));
