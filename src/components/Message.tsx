import Avatar from "@mui/material/Avatar";

export interface MessageProps {
  message: string;
  photoURL: string;
  displayName: string;
  side: "left" | "right";
}

export const Message = (props: MessageProps) => {
  const message = props.message ? props.message : "no message";
  const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  const displayName = props.displayName ? props.displayName : "Yo";

  const renderMessage = () => {
    if (props.side === "left") {
      return (
        <div className="messageRow">
          <Avatar alt={displayName} className="orange" src={photoURL}></Avatar>
          <div>
            <div className="displayName">{displayName}</div>
            <div className="messageBlue">
              <div>
                <pre>
                  <p className="messageContent">{message}</p>
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (props.side === "right") {
      return (
        <div className="messageRowRight">
          <div style={{ justifyItems: "flex-end" }}>
            <div className="displayNameRight">{displayName}</div>
            <div className="messageOrange">
              <div>
                <pre>
                  <p className="messageContent">{message}</p>
                </pre>
              </div>
            </div>
          </div>
          <Avatar alt={displayName} className="orange" src={photoURL}></Avatar>
        </div>
      );
    }
  };
  return <>{renderMessage()}</>;
};
