"use client";

import type { TicketMessage as TicketMessageModel } from "@/components/dashboard/ticket/ticket.model";

interface TicketMessageProps {
    message: TicketMessageModel;
}

export default function TicketMessage({
    message,
}: TicketMessageProps) {
    const isUser = message.sender === "user";

    return (
        <div
            className={`flex ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isUser
                        ? "bg-primary-1 text-white"
                        : "border border-gray-200 bg-gray-50 text-secondary-1"
                }`}
            >
                {/* Header */}

                <div className="mb-2 flex items-center justify-between gap-6">

                    <span
                        className={`text-xs font-medium ${
                            isUser
                                ? "text-white/80"
                                : "text-primary-1"
                        }`}
                    >
                        {isUser
                            ? "شما"
                            : "پشتیبانی دودی"}
                    </span>

                    <span
                        className={`text-xs ${
                            isUser
                                ? "text-white/70"
                                : "text-gray-500"
                        }`}
                    >
                        {message.createdAt}
                    </span>

                </div>

                {/* Message */}

                <p className="whitespace-pre-wrap text-sm leading-7">
                    {message.message}
                </p>

                {/* Attachment */}

                {message.attachment && (
                    <button
                        type="button"
                        className={`mt-4 text-sm underline underline-offset-4 ${
                            isUser
                                ? "text-white"
                                : "text-primary-1"
                        }`}
                    >
                        مشاهده فایل پیوست
                    </button>
                )}
            </div>
        </div>
    );
}