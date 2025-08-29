import React from "react";

const ChatMessage = ({ message, currentUser }) => {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isOwnMessage = message.sender === currentUser;

  return (
    <div
      className={`mb-4 p-3 rounded-lg border ${
        message.isPrivate
          ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
          : "bg-card"
      } ${isOwnMessage ? "ml-8" : "mr-8"}`}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold ${
              isOwnMessage ? "text-blue-600" : "text-primary"
            }`}
          >
            {message.sender}
          </span>
          {message.isPrivate && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-300">
              Private{" "}
              {message.recipient === currentUser
                ? "to you"
                : `to ${message.recipient}`}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{formattedTime}</span>
      </div>

      {message.type === "text" && message.text && (
        <p className="text-foreground leading-relaxed">{message.text}</p>
      )}

      {message.type === "image" && message.image && (
        <div className="mt-2">
          <img
            src={message.image}
            alt="Shared image"
            className="max-w-full max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.image, "_blank")}
          />
          {message.text && (
            <p className="text-foreground leading-relaxed mt-2">
              {message.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
