"use client";

import type { TicketMessage } from "@/components/dashboard/ticket/ticket.model";

interface TicketConversationProps {
    messages: TicketMessage[];
}

export default function TicketConversation({
    messages,
}: TicketConversationProps) {
    if (messages.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                هنوز پاسخی برای این تیکت ثبت نشده است.
            </div>
        );
    }

    const sortedMessages = [...messages].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
    );

    return (
        <div className="flex flex-col gap-4">
            {sortedMessages.map((message) => {
                const isUser = message.sender === "user";

                return (
                    <div
                        key={message.id}
                        className={`flex ${
                            isUser
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                                isUser
                                    ? "bg-primary-1 text-white"
                                    : "bg-gray-100 text-secondary-1"
                            }`}
                        >
                            <div className="mb-2 flex items-center justify-between gap-6 text-xs opacity-70">
                                <span>
                                    {isUser
                                        ? "شما"
                                        : "پشتیبانی"}
                                </span>

                                <span>{message.createdAt}</span>
                            </div>

                            <p className="whitespace-pre-wrap leading-7">
                                {message.message}
                            </p>

                            {message.attachment && (
                                <a
                                    href={message.attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-3 inline-block text-sm underline ${
                                        isUser
                                            ? "text-white"
                                            : "text-primary-1"
                                    }`}
                                >
                                    مشاهده فایل پیوست
                                </a>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}