import ChatBot from "react-chatbotify";
import LlmConnector, { GeminiProvider } from "@rcb-plugins/llm-connector";

import "assets/scss/chatbot.scss";

import BotAvatar from "assets/images/gigachad.png";
import UserAvatar from "assets/images/gigachad.png";

export default function Bot() {

  // ⭐ Create Gemini provider instance
  const gemini = new GeminiProvider({
    mode: "direct",                    // direct API call to Google
    model: "gemini-2.5-flash",         // required
    apiKey: import.meta.env.GEMINI_API_KEY, 
    responseFormat: "stream"           // or "json"
  });

  console.log(import.meta.env.GEMINI_API_KEY)
  
  const flow = {
    start: {
      message: "Xin chào! Tôi có thể hỗ trợ gì cho bạn?",
      path: "llm_block"
    },

    llm_block: {
      llmConnector: {
        provider: gemini     // ⭐ Use Gemini LLM here
      }
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
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%"
          }}
        />
      ),

      userAvatar: (
        <img
          src={UserAvatar}
          alt="user"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%"
          }}
        />
      )
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
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999
      }}
    >
      <ChatBot
        settings={settings}
        flow={flow}
        plugins={[LlmConnector()]}   // required
      />
    </div>
  );
}
