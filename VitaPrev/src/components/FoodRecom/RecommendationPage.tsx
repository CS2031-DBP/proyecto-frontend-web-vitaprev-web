import { useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useAxiosForApi } from "../hooks/useAxiosForApi";

import FoodRecommendationsHeader from "./RecommendationHeader";
import FoodRecommendationMessage from "./FoodRecomMessage";
import MealTypeQuickActions from "./QuickActions";

import type {
  MealType,
  ChatMessage,
  RecommendationsResponse,
} from "./FoodRecomTypes";

const FoodRecommendationsPage = () => {
  const [axiosApi] = useAxiosForApi();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text:
        "Hola, soy VitaAI 🤖🥗\n"+
        "Estoy aquí para ayudarte a tomar mejores decisiones alimenticias.\n"+
        "Selecciona el tipo de comida y te brindaré recomendaciones adaptadas a tus necesidades de salud.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTipo, setLastTipo] = useState<MealType | null>(null);

  const messageIdRef = useRef(2);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, loading]);

  const pushMessage = (msg: Omit<ChatMessage, "id">) => {
    const id = messageIdRef.current++;
    setMessages((prev) => [...prev, { ...msg, id }]);
  };

  const handleSelectTipo = async (tipo: MealType) => {
    setError(null);
    setLastTipo(tipo);

    const label = tipo === "DESAYUNO"
      ? "Desayuno"
      : tipo === "ALMUERZO"
      ? "Almuerzo"
      : tipo === "CENA"
      ? "Cena"
      : "Snack";

    // Mensaje usuario
    pushMessage({
      role: "user",
      text: label,
      tipo,
    });

    setLoading(true);

    try {
      const res = await axiosApi.get<RecommendationsResponse>("/recomendaciones", {
        params: { tipo },
      });

      const data = res.data;
      const vita = data.vitaAI;

      let title: string | undefined;
      let messageText: string | undefined;

      if (vita && typeof vita === "object") {
        if (typeof vita.title === "string") title = vita.title.trim();
        if (typeof vita.message === "string") messageText = vita.message.trim();
      }

      if (!title && !messageText && typeof vita === "string") {
        try {
          const parsed = JSON.parse(vita);
          if (typeof parsed.title === "string") title = parsed.title.trim();
          if (typeof parsed.message === "string")
            messageText = parsed.message.trim();
        } catch {
          messageText = vita.trim();
        }
      }

      if (!messageText) {
        messageText =
          "Aquí tienes algunas recomendaciones basadas en tus datos de salud.";
      }

      if (title) {
        pushMessage({
          role: "assistant",
          text: `🩺 ${title}`,
          tipo,
        });
      }

      pushMessage({
        role: "assistant",
        text: messageText,
        tipo,
        recommendations: data.recomendaciones || [],
        rawVitaAi: vita,
      });
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const msg =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        "Ocurrió un error al obtener recomendaciones.";
      setError(msg);

      pushMessage({
        role: "assistant",
        text:
          "Hubo un problema al obtener recomendaciones. Intenta de nuevo en unos minutos.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-5xl px-8 py-8">
        <FoodRecommendationsHeader />

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[540px]">
          {/* Área de mensajes */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            {messages.map((m) => (
              <FoodRecommendationMessage key={m.id} message={m} />
            ))}

            {loading && (
              <div className="flex justify-start mt-2">
                <div className="mr-2 mt-1 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-semibold text-emerald-700">
                  VA
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-3 py-2 text-sm shadow-sm"
                >
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse delay-75" />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse delay-150" />
                  </div>
                </motion.div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Botones rápidos */}
          <MealTypeQuickActions
            lastTipo={lastTipo}
            loading={loading}
            onSelectTipo={handleSelectTipo}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodRecommendationsPage;
