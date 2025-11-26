import type { ChatMessage } from "./FoodRecomTypes";
import { parseBoolFlag } from "./FoodRecomTypes";

interface FoodRecommendationMessageProps {
  message: ChatMessage;
}

const FoodRecommendationMessage = ({ message }: FoodRecommendationMessageProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mr-2 mt-1 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-semibold text-emerald-700 shrink-0">
          VA
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-emerald-600 text-white rounded-br-sm"
            : "bg-white text-slate-900 border border-slate-100 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>

        {isAssistant &&
          message.recommendations &&
          message.recommendations.length > 0 && (
            <div className="mt-3 border-t border-slate-100 pt-2">
              <p className="text-[11px] font-semibold text-slate-500 mb-1">
                Opciones sugeridas:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {message.recommendations.map((rec, idx) => {
                  const diab = parseBoolFlag(rec.apto_diabetico);
                  const hiper = parseBoolFlag(rec.apto_hipertenso);

                  const aptoDiab = diab !== false;
                  const aptoHiper = hiper !== false;

                  return (
                    <div
                      key={`${rec.nombre}-${idx}`}
                      className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            {rec.nombre}
                          </p>
                          {rec.categoria_salud && (
                            <p className="text-[10px] text-emerald-700 mt-0.5">
                              {rec.categoria_salud}
                            </p>
                          )}
                        </div>

                        {rec.calorias && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-700 font-medium">
                            {rec.calorias} kcal
                          </span>
                        )}
                      </div>

                      {rec.descripcion && (
                        <p className="mt-1 text-[11px] text-slate-600">
                          {rec.descripcion}
                        </p>
                      )}

                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600">
                          {rec.tipo}
                        </span>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${
                            aptoDiab
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {aptoDiab
                            ? "Apta para diabéticos"
                            : "⚠ NO apta diabéticos"}
                        </span>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${
                            aptoHiper
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {aptoHiper
                            ? "Apta para hipertensos"
                            : "⚠ NO apta hipertensos"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>

      {isUser && (
        <div className="ml-2 mt-1 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
          Tú
        </div>
      )}
    </div>
  );
};

export default FoodRecommendationMessage;
