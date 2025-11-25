import { useEffect, useRef, useState } from "react";

type WorkshopVariant = {
  id: "kynologia" | "artystyczne" | "rozwojowe";
  label: string;
  heading: string;
  highlight: string;
  descriptions: string[];
  image: string;
};

const WORKSHOP_VARIANTS: WorkshopVariant[] = [
  {
    id: "kynologia",
    label: "Kynologiczne",
    heading: "Jesteśmy miejscem przyjaznym dla",
    highlight: "zwierząt!",
    descriptions: [
      "Również tych, które przyjeżdżają z misją ",
      "– jeśli prowadzisz szkolenia, warsztaty mantrailing, tropienie, nosework, posłuszeństwo, dogtrekking, spotkania edukacyjne, zajęcia z komunikacji z psem, terapię z udziałem psa lub inne warsztaty kynologiczne – u nas znajdziesz odpowiednie warunki.",
      "",
      "",
    ],
    image: "/images/workshops/krynologiczne.png",
  },
  {
    id: "artystyczne",
    label: "Artystyczne i Twórcze",
    heading: "Twórz z serca, wśród drzew,",
    highlight: "w zgodzie z naturą!",
    descriptions: [
      "Jeśli szukasz miejsca, które wspiera twórczość, luz i autentyczną ekspresję ",
      "– dobrze trafiłeś. Otoczenie natury, swoboda i wyposażona przestrzeń dają idealne warunki do kreatywnego działania.",
      "",
      "Zorganizuj u nas warsztaty malarskie, fotograficzne, pisarskie, muzyczne, taneczne czy rzemieślnicze. Tu każdy głos, kolor i ruch znajdzie przestrzeń do wybrzmienia.",
    ],
    image: "/images/workshops/artystyczne_i_tworcze.png",
  },
  {
    id: "rozwojowe",
    label: "Rozwojowe i Terapeutyczne",
    heading: "Nasza przestrzeń \nsprzyja głębokiej",
    highlight: "\npracy wewnętrznej!",
    descriptions: [
      "W otoczeniu ciszy, zieleni i z dala od codziennego zgiełku ",
      "- tu możesz tworzyć bezpieczną i uważną przestrzeń do rozwoju, pracy z emocjami, ciałem i umysłem.",
      "Jeśli potrzebujesz przestrzeni do ciszy, skupienia i głębokiego zatrzymania",
      "– mamy wszystko, czego potrzeba, by zorganizować retreat: rozwojowy, duchowy, uważnościowy, oddechowy lub w odosobnieniach.",
    ],
    image: "/images/workshops/rozwojowe_i_terapeutyczne.png",
  },
];

export default function Workshops() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const fadeOutTimeout = useRef<NodeJS.Timeout | null>(null);
  const fadeInTimeout = useRef<NodeJS.Timeout | null>(null);

  const activeVariant = WORKSHOP_VARIANTS[activeIndex];

  const handleVariantChange = (index: number) => {
    if (index === activeIndex) return;

    if (fadeOutTimeout.current) clearTimeout(fadeOutTimeout.current);
    if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);

    setIsFading(true);

    fadeOutTimeout.current = setTimeout(() => {
      setActiveIndex(index);
      fadeInTimeout.current = setTimeout(() => {
        setIsFading(false);
      }, 100);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (fadeOutTimeout.current) clearTimeout(fadeOutTimeout.current);
      if (fadeInTimeout.current) clearTimeout(fadeInTimeout.current);
    };
  }, []);

  return (
    <section className="bg-brand-white-125 px-[40px] py-16" id="workshops">
      <div className="mx-auto flex max-w-[var(--container-max-width)] flex-col gap-10">
        <div className="text-center">
          <p className="mb-5 font-brand-serif font-semibold italic text-[45px] md:text-[50px] lg:text-[72px] uppercase tracking-[2px] text-brand-black-100">
            Warsztaty
          </p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-12 ">
            {WORKSHOP_VARIANTS.map((variant, index) => (
              <button
                key={variant.id}
                className={`pb-1 transition-all duration-200 uppercase text-[18px] lg:text-[20px] tracking-[2px] font-semibold ${
                  activeIndex === index
                    ? "text-brand-black-100"
                    : "text-brand-grey-200 hover:text-brand-grey-350"
                }`}
                onClick={() => handleVariantChange(index)}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div
            className={`flex flex-col gap-6 transition-opacity duration-300 items-center lg:items-start ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <h2 className="font-brand-serif font-semibold italic text-[35px] md:text-[50px] lg:text-[55px] xl:text-[70px] text-brand-black-100 lg:whitespace-pre-line lg:text-left text-center">
              {activeVariant.heading}{" "}
              <span className="text-brand-green-125 lg:whitespace-pre-line">
                {activeVariant.highlight}
              </span>
            </h2>

            <div className="flex flex-col gap-4 lg:text-[16px] xl:text-[18px] leading-relaxed text-brand-grey-350 font-semibold lg:text-left text-center">
              {activeVariant.descriptions
                .reduce<string[][]>((acc, curr, index) => {
                  if (index % 2 === 0) {
                    acc.push([curr]);
                  } else {
                    acc[acc.length - 1].push(curr);
                  }
                  return acc;
                }, [])
                .map((pair, idx) => (
                  <p key={`paragraph-${idx}`}>
                    <span className="text-brand-green-125 font-bold">
                      {pair[0]}
                    </span>
                    {pair[1] ?? ""}
                  </p>
                ))}
            </div>

            <button className="group inline-flex items-center gap-2 font-brand-sans font-semibold text-brand-black-100 text-[24px] underline decoration-transparent hover:decoration-brand-black-100 transition">
              Dowiedz się więcej!{" "}
              <img
                src="/icons/arrow-corner.svg"
                alt="Arrow Right"
                className="w-4 h-4 group-hover:-rotate-45 transition-transform"
                style={{ filter: "brightness(0) saturate(100%)" }}
              />
            </button>
          </div>
          <div
            className={`h-auto overflow-hidden transition-opacity duration-300 flex justify-center lg:justify-end ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={activeVariant.image}
              alt={activeVariant.label}
              className="h-full w-[650px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
