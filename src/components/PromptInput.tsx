import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRef } from "react";

export interface PromptInputProps {
  sendPrompt: (prompt: string) => void;
}

export const PromptInput = (props: PromptInputProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef.current) return;
    else if (inputRef.current.value === "") return;
    else {
      console.log("sendPrompt", { prompt: inputRef.current.value });
      props.sendPrompt(inputRef.current.value);
    }
  };

  return (
    <>
      <form
        className="wrapForm"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          inputRef={inputRef}
          id="prompt"
          label="Escribe tu 'prompt' aqui..."
          className="wrapText"
        />
        <Button
          ref={buttonRef}
          variant="contained"
          color="primary"
          className="button"
          type="submit"
        >
          <SendIcon />
        </Button>
      </form>
    </>
  );
};
