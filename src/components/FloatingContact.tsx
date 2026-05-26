import { useRouterState } from "@tanstack/react-router";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACT, waLink, telLink } from "@/lib/contact";

const HIDE_PREFIXES = ["/admin", "/staff", "/login", "/portal"];

export function FloatingContact() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp ${CONTACT.phoneDisplay}`}
        title="WhatsApp"
        className="group inline-flex items-center gap-2 rounded-full bg-[oklch(0.68_0.18_150)] py-2 pl-2 pr-3 text-white shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:shadow-xl"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
      </a>
      <a
        href={telLink()}
        aria-label={`Call ${CONTACT.phoneDisplay}`}
        title={`Call ${CONTACT.phoneDisplay}`}
        className="group inline-flex items-center gap-2 rounded-full bg-primary py-2 pl-2 pr-3 text-primary-foreground shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:shadow-xl"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
          <Phone className="h-5 w-5" />
        </span>
        <span className="hidden text-sm font-semibold sm:inline">Call</span>
      </a>
    </div>
  );
}
