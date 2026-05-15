import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import axiosConfig from "../../../config/axiosConfig";
import { getStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

import LogoConsumer from "../../../assets/logo consumer.png";
import SendIcon from "../../../assets/send.svg?react";

type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  user_id: string;
  parent_id: string | null;
  created_at: string;
};

type SendMessageResponse = {
  question: ChatMessage;
  answer: ChatMessage;
};

const initialMessages: ChatMessage[] = [
  {
    id: "hello",
    content: "Hello!",
    role: "assistant",
    user_id: "preview",
    parent_id: null,
    created_at: "",
  },
  {
    id: "mood",
    content: "What are you in the mood for today?",
    role: "assistant",
    user_id: "preview",
    parent_id: null,
    created_at: "",
  },
];

const getAuthHeaders = () => {
  const token = getStoredAuth()?.session.access_token;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const isRetryableChatError = (error: unknown) =>
  axios.isAxiosError(error) &&
  (!error.response?.status || error.response.status >= 500);

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const { data } = await axiosConfig.get<ChatMessage[]>("/picku/api/chatbot", {
          headers: getAuthHeaders(),
        });

        if (!isMounted) return;

        if (!hasSubmittedRef.current) {
          setMessages(Array.isArray(data) ? data : []);
        }
        setFeedbackMessage("");
      } catch (error) {
        if (!isMounted) return;

        if (!hasSubmittedRef.current) {
          setMessages([]);
        }

        const message =
          axios.isAxiosError(error) &&
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : "No pudimos cargar tu chat en este momento, pero ya lo estamos revisando.";

        setFeedbackMessage(message);
      }
    };

    void loadMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const displayMessages = useMemo(
    () => (messages.length > 0 ? messages : initialMessages),
    [messages],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) {
      return;
    }

    const auth = getStoredAuth();
    const optimisticQuestion: ChatMessage = {
      id: `pending-${Date.now()}`,
      content: trimmedQuestion,
      role: "user",
      user_id: auth?.user.id ?? "me",
      parent_id: null,
      created_at: new Date().toISOString(),
    };

    hasSubmittedRef.current = true;
    setIsSending(true);
    setFeedbackMessage("");
    setQuestion("");
    setMessages((current) => [...current, optimisticQuestion]);

    try {
      const sendQuestion = () =>
        axiosConfig.post<SendMessageResponse>(
          "/picku/api/chatbot",
          {
            question: trimmedQuestion,
          },
          {
            headers: getAuthHeaders(),
          },
        );

      let response;

      try {
        response = await sendQuestion();
      } catch (error) {
        if (!isRetryableChatError(error)) {
          throw error;
        }

        await wait(600);
        response = await sendQuestion();
      }

      const { data } = response;

      setMessages((current) => [
        ...current.filter((message) => message.id !== optimisticQuestion.id),
        data.question,
        data.answer,
      ]);
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "No pudimos enviar tu mensaje por ahora. Inténtalo de nuevo en un momento.";

      setFeedbackMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia">
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-[220px]">
         <header className="flex items-center justify-between mb-8 mt-1.5">
          <img src={LogoConsumer} alt="PickU" className="w-[72px] " />
        </header>

        <div className="flex flex-col gap-[18px]">
          {displayMessages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[296px] rounded-[18px] px-4 py-3 text-[16px] leading-[1.05] shadow-none ${
                    isUser
                      ? "rounded-br-[2px] bg-orange text-white"
                      : "rounded-bl-[2px] border border-[#DCD6D3] text-black"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {isSending ? (
            <div className="flex justify-start">
              <div className="max-w-[296px] rounded-[18px] rounded-bl-[2px] border border-[#ddd2ca] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-[15px] text-[rgba(27,27,27,0.68)]">
                Muffy is thinking...
              </div>
            </div>
          ) : null}

          {feedbackMessage ? (
            <p className="pt-2 text-[13px] text-[rgba(27,27,27,0.58)]">
              {feedbackMessage}
            </p>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-[85px] left-1/2 z-200 w-full max-w-[430px] border-y border-[#EBEBEB] -translate-x-1/2 bg-white px-[18px] py-6">
          <form
            className="flex min-h-[56px] items-center gap-3 rounded-[12px] border border-[#e3d9d1] bg-white px-4"
            onSubmit={handleSubmit}
          >
            <input
              className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[rgba(27,27,27,0.28)]"
              type="text"
              placeholder="Ask muffy..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />

            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent disabled:opacity-50"
              type="submit"
              disabled={isSending || !question.trim()}
              aria-label="Send message"
            >
              <SendIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      </section>

      <BottomNav variant="consumer" />
    </main>
  );
};

export default Chatbot;
