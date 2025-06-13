import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { xai } from "@ai-sdk/xai";
import { google } from "@ai-sdk/google";

export const myProvider = customProvider({
  languageModels: {
    "chat-model": google("gemini-2.0-flash"),
    "chat-model-reasoning": wrapLanguageModel({
      model: google("gemini-2.0-flash"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": google("gemini-2.0-flash"),
    "artifact-model": google("gemini-2.0-flash"),
  },
  imageModels: {
    "small-model": xai.image("grok-2-image"),
  },
});
