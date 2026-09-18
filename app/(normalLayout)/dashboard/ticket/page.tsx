'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MessageText1 } from 'iconsax-reactjs';

import PageHeader from '@/components/dashboard/PageHeader';
import GhostCloseButton from '@/components/global/Buttons/GhostCloseButton';
import { StrokePrimaryButton } from '@/components/global/Buttons/StrokeAddSquareButton';
import Icon from '@/components/global/Icon';

import TicketModal from '@/components/dashboard/ticket/TicketModal';
import TicketViewModal from '@/components/dashboard/ticket/TicketViewModal';
import TicketList from '@/components/dashboard/ticket/TicketList';

import { PaginationGenerator } from '@/components/global/PaginationGenerator';
import { normalizePagination } from '@/utils/pagination';
import { Spinner } from '@/components/shadcn/spinner';

import { useTicketsList } from '@/hooks/useTicketsList';
import type { Ticket } from '@/components/dashboard/ticket/ticket.model';

export default function TicketPage() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchTickets, loading, tickets, pagination } = useTicketsList();
  const paginationInfo = normalizePagination(pagination);

  useEffect(() => {
    fetchTickets(currentPage);
  }, [currentPage]);

  const handleCreate = () => {
    setIsTicketModalOpen(true);
  };

  const handleView = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTicketCreated = useCallback(() => {
    if (currentPage === 1) {
      fetchTickets(1);
    } else {
      setCurrentPage(1);
    }
  }, [currentPage, fetchTickets]);

  const pageInfo = {
    href: '/dashboard/ticket',
    label: 'تیکت‌ها',
    icon: MessageText1,
  };

  return (
    <>
      <div className="flex h-full flex-col items-start gap-6 rounded-2xl border-2 border-gray-1 p-4">
        <PageHeader
          titleSlot={
            <div className="inline-flex items-center gap-2 border-b border-primary-1 pb-1 pl-1">
              <Icon
                IconComponent={pageInfo.icon}
                className="text-secondary-black-3 transition-colors duration-200"
                size={24}
                variant="TwoTone"
                toneTwoColor="--color-primary-1"
              />
              <span className="text-regular text-secondary-1">{pageInfo.label}</span>
            </div>
          }
          actionsSlot={
            <GhostCloseButton iconPath="/icons/add-square.svg" className="bg-transparent hover:bg-primary-2/50" onClick={handleCreate}>
              افزودن تیکت
            </GhostCloseButton>
          }
        />

        {/* Loading */}
        {loading && (
          <div className="flex flex-1 w-full items-center justify-center p-20">
            <Spinner className="size-8 text-primary-1" />
          </div>
        )}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <div className="flex h-full w-full min-h-64 flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-primary-1 text-center">
            <div className="relative mb-4 h-20 w-20">
              <Image src="/icons/empty-data.svg" alt="No tickets" fill className="object-contain" />
            </div>
            <h6 className="text-gray-3">لیست تیکت‌های شما خالی است</h6>
            <StrokePrimaryButton href="" desktopText="ثبت تیکت" mobileText="ثبت تیکت" className="mt-3" onClick={handleCreate} />
          </div>
        )}

        {/* Ticket List */}
        {!loading && tickets.length > 0 && (
          <>
            <TicketList tickets={tickets} onView={handleView} />

            {paginationInfo.totalPages > 1 && (
              <div className="flex w-full items-center justify-center py-4">
                <PaginationGenerator pagination={paginationInfo} onChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </div>

      <TicketModal open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen} onSuccess={handleTicketCreated} />

      <TicketViewModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} ticket={selectedTicket} onRefresh={() => fetchTickets(currentPage)} />
    </>
  );
}
