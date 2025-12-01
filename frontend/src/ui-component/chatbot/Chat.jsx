import ChatBot from "react-chatbotify";
import "assets/scss/chatbot.scss";

import { GoogleGenerativeAI } from "@google/generative-ai";

import BotAvatar from "assets/images/gigachad.png";
import UserAvatar from "assets/images/gigachad.png";

export default function Bot() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const modelType = "gemini-2.0-flash"; // streaming-supported model

  const gemini_stream = async (params) => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelType });

      const result = await model.generateContentStream(params.userInput);

      let text = "";
      let offset = 0;

      for await (const chunk of result.stream) {
        const chunkText = chunk.text() || "";
        text += chunkText;

        // stream one character at a time
        for (let i = offset; i < text.length; i++) {
          await params.streamMessage(text.slice(0, i + 1));
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        offset = text.length;
      }

      await params.endStreamMessage();
    } catch (error) {
      console.error("Gemini error:", error);
      await params.injectMessage("⚠️ Không thể tải mô hình LLM. Vui lòng kiểm tra API key!");
    }
  };

  const flow = {
    start: {
      message: "Xin chào! Tôi có thể hỗ trợ gì cho bạn?",
      path: "chat_loop"
    },

    chat_loop: {
      message: async (params) => {
        await gemini_stream(params);
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
      simulateStream: true
    },

    chatWindow: {
      title: "Trợ lý ảo",
      showCloseButton: true
    },

    launchButton: {
      iconColor: "#fff"
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <ChatBot settings={settings} flow={flow} />
    </div>
  );
}
