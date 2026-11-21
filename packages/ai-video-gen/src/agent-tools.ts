export const aiVideoTools = [
  {
    name: "generate_video",
    description:
      "Generate a new video clip with AI (text-to-video or image-to-video). Returns job ID. Media is automatically imported when ready.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        mode: { type: "string", enum: ["text-to-video", "image-to-video"] },
        durationSec: { type: "number" },
        aspectRatio: { type: "string" },
        provider: { type: "string", default: "fal-kling" },
        imageMediaId: {
          type: "string",
          description: "Existing media ID for image-to-video",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "list_generation_jobs",
    description: "List current AI video generation jobs and their status",
  },
  {
    name: "cancel_generation",
    description: "Cancel a running generation job",
    parameters: {
      type: "object",
      properties: { jobId: { type: "string" } },
      required: ["jobId"],
    },
  },
];
