// Tool definitions handed to Claude. Each maps 1:1 to an action in
// operations.ts. Scene numbers are 1-based.

export type ToolDef = {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties: false;
  };
};

const scene = { type: "integer", description: "1-based scene number" };

export const toolDefinitions: ToolDef[] = [
  {
    name: "add_text_scene",
    description:
      "Append (or insert) a full-screen title/caption card generated from text.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", description: "Headline text" },
        subtitle: { type: "string" },
        durationInSeconds: { type: "number" },
        background: { type: "string", description: "Hex colour, e.g. #101820" },
        color: { type: "string", description: "Text hex colour" },
        position: { type: "integer", description: "1-based index to insert at; omit to append" },
      },
      required: ["text"],
    },
  },
  {
    name: "add_image_scene",
    description:
      "Add one uploaded image as a full-screen scene. Omit `image` to use the next unused image.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        image: { type: "string", description: "Image file name or its number from the asset list" },
        caption: { type: "string" },
        durationInSeconds: { type: "number" },
        kenBurns: { type: "boolean", description: "Slow zoom, default true" },
        position: { type: "integer" },
      },
    },
  },
  {
    name: "add_video_scene",
    description: "Add the uploaded video (or a trimmed part of it) as a scene.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        video: { type: "string", description: "Video file name or number; omit for the first one" },
        caption: { type: "string" },
        trimStartSeconds: { type: "number", description: "Seconds to skip from the source start" },
        durationInSeconds: { type: "number", description: "How long this clip stays on screen" },
        speed: { type: "number", description: "0.25-4, where 1 is normal speed" },
        position: { type: "integer" },
      },
    },
  },
  {
    name: "add_slideshow",
    description:
      "Turn every not-yet-used uploaded image into a timed sequence of image scenes.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        captions: { type: "array", items: { type: "string" }, description: "One caption per image, in order" },
        durationEach: { type: "number" },
        kenBurns: { type: "boolean" },
        transition: { type: "string", enum: ["none", "fade", "slide", "wipe"] },
      },
    },
  },
  {
    name: "add_text_overlay",
    description:
      "Lay a line of text ON TOP of an existing scene (over the video or image).",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scene,
        text: { type: "string" },
        position: {
          type: "string",
          enum: [
            "top",
            "center",
            "bottom",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ],
        },
        startSeconds: { type: "number", description: "Relative to the scene start" },
        endSeconds: { type: "number" },
        fontSize: { type: "number" },
        color: { type: "string" },
        background: { type: "string", description: "Hex colour for a pill behind the text; omit for none" },
      },
      required: ["scene", "text"],
    },
  },
  {
    name: "remove_overlays",
    description: "Remove all text overlays from a scene.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { scene },
      required: ["scene"],
    },
  },
  {
    name: "split_scene",
    description: "Cut one scene into two at the given number of seconds.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { scene, atSeconds: { type: "number" } },
      required: ["scene", "atSeconds"],
    },
  },
  {
    name: "trim_scene",
    description: "Change a scene's on-screen duration, and for video its start point.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scene,
        durationInSeconds: { type: "number" },
        trimStartSeconds: { type: "number", description: "Video only" },
      },
      required: ["scene"],
    },
  },
  {
    name: "set_speed",
    description: "Set the playback speed of a video scene (0.25-4).",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { scene, speed: { type: "number" } },
      required: ["scene", "speed"],
    },
  },
  {
    name: "set_duration",
    description: "Set how long a scene stays on screen.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { scene, durationInSeconds: { type: "number" } },
      required: ["scene", "durationInSeconds"],
    },
  },
  {
    name: "reorder_scene",
    description: "Move a scene to a new position.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { from: { type: "integer" }, to: { type: "integer" } },
      required: ["from", "to"],
    },
  },
  {
    name: "delete_scene",
    description: "Remove a scene.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { scene },
      required: ["scene"],
    },
  },
  {
    name: "set_transition",
    description: "Set the transition used between every scene.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", enum: ["none", "fade", "slide", "wipe"] },
        durationInSeconds: { type: "number" },
      },
      required: ["kind"],
    },
  },
  {
    name: "set_audio",
    description: "Use an uploaded audio file as background music / voiceover for the whole video.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        audio: { type: "string", description: "Audio file name or number; omit for the first one" },
        volume: { type: "number", description: "0-1, default 0.7" },
      },
    },
  },
  {
    name: "remove_audio",
    description: "Remove the background audio track.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
  {
    name: "remove_asset",
    description:
      "Delete an uploaded file from the project and remove any scenes that use it.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asset: { type: "string", description: "File name or its number from the asset list" },
      },
      required: ["asset"],
    },
  },
  {
    name: "set_project",
    description: "Change project-wide settings (title, size, fps).",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        width: { type: "integer" },
        height: { type: "integer" },
        fps: { type: "integer" },
      },
    },
  },
  {
    name: "clear_scenes",
    description: "Delete every scene and start over.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
];

export const SYSTEM_PROMPT = `You are the editing assistant inside a Remotion-based video builder.
The user describes what they want in plain language and you build it by calling tools.

Rules:
- Work only through the provided tools. Never invent file names — use the uploaded
  assets exactly as listed, by name or by their number.
- Scene numbers are 1-based and refer to the CURRENT scene list you are given.
- When the user uploads images and asks for "a video", prefer add_slideshow.
- add_video_scene keeps the WHOLE clip by default (the asset list shows each
  clip's length). Only pass durationInSeconds / trimStartSeconds when the user
  asks to shorten or trim it.
- "Text over the video" / "overlapping text" / "caption on top" means add_text_overlay,
  not add_text_scene (which is a separate full-screen card).
- You may call several tools in one turn. After editing, reply with one or two short
  sentences describing what you changed. Do not restate the whole timeline.
- If something can't be done (e.g. no video uploaded), say so briefly instead of guessing.`;
