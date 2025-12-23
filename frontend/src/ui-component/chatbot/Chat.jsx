import ChatBot from "react-chatbotify";
import "assets/scss/chatbot.scss";

import { GoogleGenerativeAI } from "@google/generative-ai";

import BotAvatar from "assets/images/gigachad.png";
import UserAvatar from "assets/images/gigachad.png";

export default function Bot() {

  const backend_stream = async (params) => {
  try {
    const response = await fetch("http://localhost:8000/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: params.userInput })
    });


    if (!response.ok || !response.body) {
      throw new Error("No streaming body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let partialText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partialText += chunk;

      // simulate streaming — stream 1 char at a time
      for (let i = 0; i < chunk.length; i++) {
        await params.streamMessage(partialText.slice(0, partialText.length - chunk.length + i + 1));
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    await params.endStreamMessage();

  } catch (error) {
    console.error("Backend streaming error:", error);
    await params.injectMessage("⚠️ Lỗi backend. Hãy kiểm tra FastAPI server!");
  }
};

  const flow = {
    start: {
      message: "Xin chào! Tôi có thể hỗ trợ gì cho bạn?",
      path: "chat_loop"
    },

    chat_loop: {
      message: async (params) => {
        await backend_stream(params);
      },
      path: "chat_loop"
    }
  };

  const settings = {
    general: {
      embedded: false,
      botBubbleColor: "var(--palette-secondary-light)",
      userBubbleColor: "var(--palette-primary-main)",

      botAvatar: (
        <img
          src={BotAvatar}
          alt="bot"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
      ),

      userAvatar: (
        <img
          src={UserAvatar}
          alt="user"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
      )
    },

    botBubble: {
      simulateStream: true,
      background: "#eef6ff",
      textColor: "#000",
      borderRadius: "16px",
      padding: "12px",
      fontSize: "15px",
    },

    chatWindow: {
      title: "Trợ lý ảo",
      width: "400px",
      height: "550px",
      borderRadius: "20px",
      background: "#ffffff",
      showCloseButton: true,
    },


    launchButton: {
      background: "#000",
      iconColor: "#fff",
      size: "55px",
      bottom: "40px",
      right: "40px",
      borderRadius: "50%",
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <ChatBot settings={settings} flow={flow} />
    </div>
  );
}
