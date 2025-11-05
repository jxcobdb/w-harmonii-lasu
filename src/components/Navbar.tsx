import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  return (
    <section className="sticky top-0 z-50 w-full">
      {/* NAVBAR */}
      <nav
        className={[
          "fixed w-full px-[40px] grid items-center transition-all duration-300 ease-in-out",
          // 🔹 tło zmienia się przy scrollu
          isScrolled || isOpen
            ? "bg-brand-grey-350/90 h-[80px] backdrop-blur-md shadow-xl"
            : "bg-transparent h-[96px]",
          !isOpen ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-[40px_auto_1fr]",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center gap-2 transition-all duration-500 ease-in-out",
            isOpen
              ? "opacity-0 -translate-x-4 pointer-events-none"
              : "opacity-100 translate-x-0",
          ].join(" ")}
        >
          {!isOpen && (
            <a
              href="/"
              className="flex items-center gap-2 duration-300 hover:scale-110"
            >
              <p className="hidden md:block uppercase text-brand-white-100 font-brand-sans font-semibold tracking-[2px] text-[13px] leading-none">
                Rezerwacja
              </p>
              <img
                src="public/icons/menu-burger-icon.svg"
                alt="Menu"
                className="h-5 w-5"
              />
            </a>
          )}
        </div>

        <a className="justify-self-center inline-flex duration-300 hover:scale-110">
          <img
            src="public/icons/brand-logo.svg"
            alt="Logo"
            className={[
              "h-10 w-auto transition-transform duration-500 ease-in-out",
              isOpen ? "-translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </a>

        <div className="justify-self-end leading-0">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex items-center gap-2 cursor-pointer h-auto transition-all duration-300 hover:scale-110"
            aria-expanded={isOpen}
            aria-controls="site-overlay"
          >
            {!isOpen ? (
              <>
                <img
                  src="public/icons/menu-burger-icon.svg"
                  alt="Menu"
                  className="h-5 w-5 scale-x-[-1]"
                />
                <p className="hidden md:block uppercase text-brand-white-100 font-brand-sans font-semibold tracking-[2px] text-[13px] leading-none whitespace-nowrap">
                  Menu
                </p>
              </>
            ) : (
              <img
                src="public/icons/closing-x.svg"
                alt="Close"
                className="h-5 w-5"
              />
            )}
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        id="site-overlay"
        className={[
          "absolute left-0 right-0 top-[80px] z-40 h-screen",
          "transition-opacity duration-500 ease-in-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-brand-grey-350/90 backdrop-blur-md" />

        <div
          className={[
            "relative px-[40px] pt-5 pb-10 w-full",
            "transition-transform duration-500 ease-out",
            isOpen ? "translate-y-0" : "-translate-y-2",
            "lg:h-[calc(100dvh-96px)] lg:overflow-hidden",
            "h-auto max-h-[calc(100dvh-96px)] overflow-y-auto",
          ].join(" ")}
        >
          <div
            className={[
              "grid gap-[20px] w-full",
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              "lg:grid-rows-2 lg:h-full",
            ].join(" ")}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                href="/"
                key={i}
                className={[
                  "relative w-full overflow-hidden group",
                  "transition-all duration-300",
                  "aspect-[4/3] lg:aspect-auto lg:h-full",
                ].join(" ")}
                style={{ transitionDelay: isOpen ? `${i * 0.06}s` : "0s" }}
              >
                <img
                  src="public/images/navbar/rezerwacja.png"
                  alt="Rezerwacje"
                  className="absolute inset-0 w-full h-full object-cover duration-700 grayscale group-hover:grayscale-0"
                />
                <h3 className="absolute inset-0 grid place-items-center text-brand-white-100 font-brand-sans font-semibold uppercase text-[28px] tracking-[2px] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                  Rezerwacja
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
