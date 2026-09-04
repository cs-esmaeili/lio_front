"use client";

import TicketCard from "@/components/dashboard/ticket/TicketCard";

import type { Ticket } from "@/components/dashboard/ticket/ticket.model";

interface TicketListProps {
    tickets: Ticket[];

    onView: (ticket: Ticket) => void;
}

export default function TicketList({
    tickets,
    onView,
}: TicketListProps) {
    return (
        <div className="flex w-full flex-col gap-4">

            {tickets.map((ticket) => (
                <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onView={onView}
                />
            ))}

        </div>
    );
}