import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

export default function ImageDialog({ open, src, alt, onClose }) {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95 translate-y-2"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-2"
                        >
                            <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#05070b] border border-[#F4A52E] shadow-[0_0_40px_rgba(0,0,0,.8)] p-4 sm:p-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-slate-100 hover:bg-black/80 border border-white/10"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="mt-4">
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="mx-auto max-h-[80vh] w-auto rounded-xl bg-black object-contain"
                                    />
                                    {alt && (
                                        <Dialog.Description className="mt-3 text-center text-sm text-slate-300">
                                            {alt}
                                        </Dialog.Description>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
