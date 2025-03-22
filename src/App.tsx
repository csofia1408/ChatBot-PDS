import { Button, CircularProgress, Paper } from "@mui/material";
import { PromptInput } from "./components/PromptInput";
import { Message } from "./components/Message";
import { useEffect, useRef, useState } from "react";
import { OllamaInteractor } from "./utils/ollama-interactor";
import { ChromaDBClient } from "./utils/chromadb-client";

export default function App() {
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [embeddings, setEmbeddings] = useState<number[][]>([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
        (bottomRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
}, [message]);

  const toEmbed: Array<string> = [
    "humedad de suelo=50%",
    "llenado de tanque de fertilizante=30%",
    "nivel de agua para riego=20%",
  ];

  const modelEmbbeding = "phi4";

  const handlePromptRequest = async (prompt: string) => {
    setMessage((prevMessage) => [...prevMessage, prompt]);
    setLoading(true);
    try {
      let response: any;
      if (embeddings.length > 0) {
        const queryEmbeddings = await OllamaInteractor.instance.generateEmbedings(
          prompt,
          modelEmbbeding
        );
        const context = await ChromaDBClient.instance.queryCollection(
          "agro",
          queryEmbeddings,
          10
        );
        response = await OllamaInteractor.instance.answerPromptUsingEmbbedings(
          prompt,
          context.documents[0]
        );
      } else {
        response = await OllamaInteractor.instance.sendPromptChat(prompt);
      }
      if (response.response) {
        setMessage((prevMessage) => [...prevMessage, response.response]);
      } else {
        setMessage((prevMessage) => [...prevMessage, response.message.content]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmbeddings = async () => {
    let matrix: number[][] = [];
    setLoading(true);
    try {
      const response = await OllamaInteractor.instance.generateEmbedings(
        toEmbed,
        modelEmbbeding
      );
      const indexes: string[] = toEmbed.map((_, index) => index.toString());
      await ChromaDBClient.instance.addToCollection(
        "agro",
        response,
        toEmbed,
        indexes
      );
      matrix = response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setEmbeddings(matrix);
    }
  };

  return (
    <div className="container">
      <Paper className="paper">
        <Paper className="messagesBody">
          {message.map((message, index) => (
            <Message
              key={index}
              message={message}
              photoURL="dummy.js"
              displayName={index % 2 === 0 ? "Yo" : "Ollama"}
              side={index % 2 === 0 ? "left" : "right"}
            />
          ))}
          <div ref={bottomRef} />
        </Paper>
        {loading ? (
          <CircularProgress />
        ) : (
          <PromptInput
            sendPrompt={(prompt: string) => handlePromptRequest(prompt)}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          className="button"
          style={{ marginTop: "10px", marginBottom: "10px" }}
          disabled={loading || embeddings.length > 0}
          onClick={generateEmbeddings}
        >
          Generar Embeddings
        </Button>
      </Paper>
    </div>
  );
}
