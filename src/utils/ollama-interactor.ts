import axios, { AxiosInstance } from "axios";

export class OllamaInteractor {
  static #instance: OllamaInteractor;
  private readonly baseUrl: string = "http://localhost:11434";
  private readonly axionClient: AxiosInstance;
  private readonly chatModel: string = "phi4";
  private readonly role: string = "user";

  private constructor() {
    this.axionClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 90000,
    });
  }

  public static get instance(): OllamaInteractor {
    if (!this.#instance) {
      this.#instance = new OllamaInteractor();
    }
    return this.#instance;
  }

  public async sendPromptChat(prompt: string) {
    const ollamaRequest = await this.axionClient.post("/api/chat", {
      model: this.chatModel,
      messages: [
        {
          role: this.role,
          content: prompt,
        },
      ],
      stream: false,
    });
    if (ollamaRequest.status !== 200) throw new Error("Ollama request failed");
    console.log("ollamaChatResponse", ollamaRequest.data);
    return ollamaRequest.data;
  }

  public async generateEmbedings(
    input: string | Array<string>,
    model: string = this.chatModel
  ) {
    const ollamaRequest = await this.axionClient.post("api/embed", {
      model: model,
      input: input,
    });
    if (ollamaRequest.status !== 200) throw new Error("Ollama request failed");
    console.log("ollamaEmbeddingsResponse", ollamaRequest.data.embeddings);
    return ollamaRequest.data.embeddings;
  }

  public async answerPromptUsingEmbbedings(
    prompt: string,
    context: (number[] | string | null )[],
    model: string = this.chatModel
  ) {
    const ollamaRequest = await this.axionClient.post("api/generate", {
      model: model,
      prompt: `${context}\n\n${prompt}`,
      stream: false,
    });
    if (ollamaRequest.status !== 200) throw new Error("Ollama request failed");
    console.log("ollamaGenerateResponse", ollamaRequest.data);
    return ollamaRequest.data;
  }
}
