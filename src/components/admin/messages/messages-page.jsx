import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Mail, Check, Clock, User, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { dbHelpers } from "../../../lib/supabase";

const MessagesPage = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getContactSubmissions();
      if (error) throw error;
      return data || [];
    },
  });

  const handleMarkRead = async (id) => {
    await dbHelpers.markContactRead(id);
    queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
  };

  const unread = messages.filter((m) => !m.is_read).length;

  const formatDate = (ts) =>
    new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <MessageSquare size={15} className="text-indigo-400" />
            Contact Messages
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            {messages.length} total · {unread} unread
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800/60" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-800 py-16 text-center">
          <Inbox size={36} className="mx-auto mb-3 text-gray-700" />
          <p className="text-sm font-semibold text-gray-500">No messages yet</p>
          <p className="text-xs text-gray-700 mt-1">Contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={[
                  "rounded-2xl border transition-all duration-200",
                  msg.is_read
                    ? "border-gray-800/60 bg-gray-900/40"
                    : "border-indigo-500/20 bg-gray-900/60"
                ].join(" ")}
              >
                {/* Row header */}
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                >
                  {/* Unread dot */}
                  <div className="flex-shrink-0 mt-1">
                    {msg.is_read ? (
                      <div className="h-2 w-2 rounded-full bg-gray-700" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={["text-sm font-semibold truncate", msg.is_read ? "text-gray-400" : "text-gray-100"].join(" ")}>
                          {msg.subject}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-gray-600">
                            <User size={10} /> {msg.name}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-600">
                            <Mail size={10} /> {msg.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="flex items-center gap-1 text-[10px] text-gray-600">
                          <Clock size={10} /> {formatDate(msg.created_at)}
                        </span>
                        {isExpanded ? <ChevronUp size={14} className="text-gray-600" /> : <ChevronDown size={14} className="text-gray-600" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-800/60 pt-4 space-y-4">
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all"
                      >
                        <Mail size={11} /> Reply via email
                      </a>
                      {!msg.is_read && (
                        <button
                          onClick={() => handleMarkRead(msg.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all"
                        >
                          <Check size={11} /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
