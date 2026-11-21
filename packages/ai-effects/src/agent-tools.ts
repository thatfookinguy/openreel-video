export const aiEffectsTools = [
  {
    name: "remove_background",
    description:
      "Remove or replace the background of a clip. Modes: transparent, blur, color, image.",
    parameters: {
      type: "object",
      properties: {
        clipId: { type: "string" },
        mode: {
          type: "string",
          enum: ["transparent", "blur", "color", "image"],
        },
        color: { type: "string" },
        edgeBlur: { type: "number" },
      },
      required: ["clipId"],
    },
  },
  {
    name: "remove_object",
    description: "Remove an object from a video clip using a mask or auto-detection.",
    parameters: {
      type: "object",
      properties: {
        clipId: { type: "string" },
        maskDescription: { type: "string" },
        prompt: { type: "string" },
      },
      required: ["clipId"],
    },
  },
  {
    name: "isolate_subject",
    description: "Cut the main subject onto a new transparent track.",
    parameters: {
      type: "object",
      properties: {
        clipId: { type: "string" },
        keepOriginal: { type: "boolean" },
      },
      required: ["clipId"],
    },
  },
  {
    name: "enhance_faces",
    description: "Enhance faces in the selected clip (skin, eyes, detail).",
    parameters: {
      type: "object",
      properties: {
        clipId: { type: "string" },
        strength: { type: "number" },
      },
      required: ["clipId"],
    },
  },
  {
    name: "upscale_clip",
    description: "AI upscale a clip (2x or 4x).",
    parameters: {
      type: "object",
      properties: {
        clipId: { type: "string" },
        scale: { type: "number", enum: [2, 4] },
      },
      required: ["clipId"],
    },
  },
];
