"use client";

import { useState } from "react";
import { Location, Trash, Edit } from "iconsax-reactjs";
import Icon from "@/components/global/Icon";
import { Button } from "@/components/shadcn/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import type { Address } from "@/components/dashboard/address/address.model";

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (address: Address) => Promise<void>;
    onSetMain?: (address: Address) => Promise<void> | void;
    selectable?: boolean;
    isSelected?: boolean;
    onSelect?: (address: Address) => void;
}

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetMain,
    selectable,
    isSelected,
    onSelect,
}: AddressCardProps) {
    const [deleting, setDeleting] = useState(false);
    const [settingMain, setSettingMain] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        await onDelete(address);
        setDeleting(false);
        setDeleteDialogOpen(false);
    };

    const handleSetMain = async () => {
        if (!onSetMain) return;
        setSettingMain(true);
        await onSetMain(address);
        setSettingMain(false);
    };

    const cardContent = (
        <div
            className={`flex items-start gap-3 rounded-xl border p-5 transition-colors ${
                isSelected
                    ? "border-primary-1 bg-primary-4/30"
                    : "border-gray-200"
            } ${
                selectable
                    ? "cursor-pointer hover:bg-primary-4/10"
                    : ""
            }`}
        >
            <Location
                size={22}
                variant="Bold"
                className="text-primary-1"
            />

            <div className="flex flex-1 flex-col gap-2">
                <span className="flex items-center gap-2 font-medium text-secondary-1">
                    {address.title}

                    {address.isMain && (
                        <span className="rounded-full bg-primary-3 px-2 py-0.5 text-xs text-primary-1">
                            پیش‌فرض
                        </span>
                    )}
                </span>

                <span className="text-sm text-secondary-2">
                    {address.province}، {address.city}
                </span>

                <span className="text-sm text-secondary-2">
                    {address.address}
                </span>

                <span className="text-sm text-secondary-2">
                    کد پستی: {address.postalCode}
                </span>

                {!address.isMain && onSetMain && (
                    <button
                        type="button"
                        disabled={settingMain}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSetMain();
                        }}
                        className="w-fit cursor-pointer text-sm text-primary-1 transition-colors hover:text-primary-black-1 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {settingMain ? "در حال ثبت..." : "تعیین به عنوان پیش‌فرض"}
                    </button>
                )}
            </div>

            <div
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={() => onEdit(address)}
                    className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-gray-100"
                >
                    <Icon
                        IconComponent={Edit}
                        className="text-secondary-2"
                        size={19}
                        variant="Linear"
                    />
                </button>

                <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setDeleteDialogOpen(true)}
                    className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                    <Icon
                        IconComponent={Trash}
                        className="text-destructive"
                        size={19}
                        variant="Linear"
                    />
                </button>
            </div>
        </div>
    );

    return (
        <>
            {selectable && onSelect ? (
                <div onClick={() => onSelect(address)}>
                    {cardContent}
                </div>
            ) : (
                cardContent
            )}

            <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            حذف آدرس
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-center text-secondary-2">
                        آیا از حذف این آدرس اطمینان دارید؟
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-3">
                        <Button
                            variant="outline"
                            className="h-10 min-w-24 cursor-pointer rounded-xl border border-primary-1 bg-white text-primary-1 hover:bg-white hover:text-primary-1"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            خیر
                        </Button>

                        <Button
                            variant="destructive"
                            className="h-10 min-w-24 cursor-pointer rounded-xl"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "در حال حذف..." : "بله"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
