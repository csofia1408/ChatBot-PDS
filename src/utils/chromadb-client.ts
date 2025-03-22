import { ChromaClient, Collection } from "chromadb";

export class ChromaDBClient {
  static #instance: ChromaDBClient;
  private readonly serverPath: string = "http://localhost:1000";
  private readonly client: ChromaClient;
  private dataCollection: Collection | null = null;

  public static get instance(): ChromaDBClient {
    if (!this.#instance) {
      this.#instance = new ChromaDBClient();
    }
    return this.#instance;
  }

  private constructor() {
    this.client = new ChromaClient({ path: this.serverPath });
  }

  public async addToCollection(
    collectionName: string,
    embeddings: number[][],
    documents: string[],
    indexes: string[]
  ) {
    if (!this.dataCollection)
      this.dataCollection = await this.client.getOrCreateCollection({
        name: collectionName,
      });
    try {
      await this.dataCollection.add({
        embeddings: embeddings,
        documents: documents,
        ids: indexes,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async queryCollection(
    collectionName: string,
    query: number[],
    results: number
  ) {
    if (!this.dataCollection)
      this.dataCollection = await this.client.getOrCreateCollection({
        name: collectionName,
      });
    const result = await this.dataCollection.query({
      queryEmbeddings: query,
      nResults: results,
    });
    return result;
  }
}
