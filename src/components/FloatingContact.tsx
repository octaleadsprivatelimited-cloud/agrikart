import { Phone, MessageCircle } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/919999999999"
        target="_blank" rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="grid h-12 w-12 place-items-center rounded-full bg-[oklch(0.68_0.18_150)] text-white shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:+919999999999"
        aria-label="Call"
        className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
