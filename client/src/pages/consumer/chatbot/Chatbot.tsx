import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import axiosConfig from "../../../config/axiosConfig";
import { getStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";
import ShoppingCartIcon from "../../../assets/shopping cart consumer.svg?react";

import LogoConsumer from "../../../assets/logo consumer.png";
import SendIcon from "../../../assets/send.svg?react";
import { useNavigate } from "react-router-dom";

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
    content: "Hi!, Welcome to PickU",
    role: "assistant",
    user_id: "preview",
    parent_id: null,
    created_at: "",
  },
  {
    id: "mood",
    content: "What are you going to have today?",
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
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasSubmittedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const { data } = await axiosConfig.get<ChatMessage[]>(
          "/picku/api/chatbot",
          {
            headers: getAuthHeaders(),
          },
        );

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
            : "No pudimos cargar tu chat en este momento.";

        setFeedbackMessage(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
          : "No pudimos enviar tu mensaje por ahora.";

      setFeedbackMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="app-shell mb-24">
      <header className="fixed w-full px-12 pt-16 top-0 z-50 bg-white pb-8 shadow-sm">
        <div className="flex items-center justify-between ">
          <img
            src={LogoConsumer}
            onClick={() => navigate("/consumer/home")}
            alt="PickU"
            className="w-16 cursor-pointer"
          />

          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            className="flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      <section className="app-screen">
        <div className="flex flex-col mt-22 gap-4 transition-all duration-500">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 w-full gap-3">
              <img
                src="/resources/muffy.svg"
                alt="Loading chat..."
                className="w-30 h-auto animate-bounce duration-1000"
              />
              <p className="font-light text-black/50 animate-pulse">
                Looking for Muffy...
              </p>
            </div>
          ) : (
            displayMessages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-64 rounded-2xl p-4 text-[16px] leading-[1.05] shadow-none transition-all duration-500 ${
                      isUser
                        ? "rounded-br-none border border-black/15 bg-orange text-white"
                        : "rounded-bl-none border border-black/15 text-black bg-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })
          )}

          {isSending ? (
            <div className="flex justify-start">
              <div className="max-w-64 rounded-2xl transition-all duration-500 animate-pulse rounded-bl-none border border-black/15 bg-white p-4 text-[16px] text-black">
                Muffy is thinking...
              </div>
            </div>
          ) : null}

          {feedbackMessage ? (
            <p className="text-[16px] text-center text-black/50 mt-4">
              {feedbackMessage}
            </p>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-20 left-1/2 z-200 w-full -translate-x-1/2 px-12 ">
          <form
            className="flex items-center gap-3 rounded-lg border border-black/15 bg-white px-4 transition-all duration-500 "
            onSubmit={handleSubmit}
          >
            <input
              className="w-full bg-transparent text-[16px] font-light py-4 text-black outline-none placeholder:text-black/50"
              type="text"
              placeholder="Ask muffy..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={loading}
            />

            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent disabled:opacity-50"
              type="submit"
              disabled={isSending || !question.trim() || loading}
              aria-label="Send message"
            >
              <SendIcon className="h-6 w-6" />
            </button>
          </form>
          <div className="h-4.75 backdrop-blur-xs"></div>
        </div>
      </section>

      <BottomNav variant="consumer" />
    </main>
  );
};

export default Chatbot;
