import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./VerticalCarousel.css";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import useScreenWidth from "../../hooks/useScreenWidth";

export default function VerticalCardsStack() {

    const slideDescriptions = [
        "Sala warsztatowa w stodole – 60 m² drewna, wyposażona w maty, poduszki, sztalugi. Idealna na jogę, warsztaty, spotkania. Pomieści do 18 osób (joga) lub nawet 60 przy biesiadzie.",
        "Przestronna kuchnia z jadalnią – w pełni wyposażona, z dużym stołem do wspólnych posiłków i gotowania. Idealna do kulinarnych warsztatów i integracji przy jedzeniu.",
        "Komfortowe pokoje gościnne – przytulne wnętrza z łazienkami, zapewniające wygodę i relaks po dniu pełnym aktywności na świeżym powietrzu.",
        "Strefa relaksu na zewnątrz – taras z widokiem na las, miejsce na ognisko i hamaki, idealne do odpoczynku i integracji w otoczeniu natury.",
        "Przestrzeń do jogi na świeżym powietrzu – specjalnie przygotowane miejsce na zajęcia jogi i medytacji w otoczeniu przyrody, sprzyjające wyciszeniu i regeneracji.",
        "Dostęp do lasu – bezpośrednie wyjście na leśne ścieżki, umożliwiające spacery, bieganie i kontakt z naturą o każdej porze dnia.",
    ];
    const [activeIndex, setActiveIndex] = React.useState(0);
    const screenWidth = useScreenWidth();

    const optimizeSwipeForces = () => {
        if (screenWidth >= 1280) {
            return {
                speed: 1000,
                touchRatio: 1,
                longSwipes: false,
                resistanceRatio: 0.6,
            };
        } else if (screenWidth >= 768) {
            return {
                speed: 700,
                touchRatio: 0.7,
                longSwipes: true,
                resistanceRatio: 0.8,
            };
        } else {
            return {
                speed: 700,
                touchRatio: 0.5,
                longSwipes: true,
                resistanceRatio: 1,
            };
        }
    }

    return (
        <section className="vertical-carousel-section h-[80vh] md:h-screen">
            <div className="bg-brand-dark-green-50/80 h-[80vh] md:h-screen">
                <div className="h-[80vh] md:h-screen max-w-[var(--container-max-width)] grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(auto,700px)_minmax(0,1fr)] mx-auto items-center">
                    {/* lewa */}
                    <h2 className="hidden xl:block self-center justify-self-center font-brand-serif italic text-brand-white-100 xl:text-[80px] 2xl:text-[100px]">
                        Poznaj
                    </h2>
                    {/* srodek */}
                    <div className="flex flex-col ">
                        <h2 className="block xl:hidden self-center justify-self-center font-brand-serif italic text-brand-white-100 text-[50px] md:text-[70px] mb-10">Poznaj nas</h2>
                        <div className="place-self-center w-full inline-flex justify-center items-center">
                            <Swiper
                                effect="coverflow"
                                direction="vertical"
                                autoplay={{ delay: 5000, reverseDirection: false, pauseOnMouseEnter: true }}
                                loop
                                grabCursor
                                centeredSlides
                                slidesPerView={2}
                                spaceBetween={-200}
                                coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: false }}
                                modules={[EffectCoverflow, Autoplay]}
                                className="mySwiper h-[73vw] md:h-[600px] flex justify-center"
                                onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
                                {...optimizeSwipeForces()}
                            >
                                {[...Array(6)].map((_, i) => (
                                    <SwiperSlide key={i}>
                                        <img
                                            src="/images/vertical-carousel/vertical-carousel-slide-1.png"
                                            alt={`slide-${i}`}
                                            className="w-[86vw] md:w-[700px] h-auto rounded-md"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="h-[100px] text-center md:text-start flex justify-center font-light leading-[25px] text-brand-white-125 text-[18px]">
                            <p className="w-[700px] xl:w-auto px-15 md:px-5 xl:px-10">
                                {slideDescriptions[activeIndex]}
                            </p>
                        </div>
                    </div>

                    {/* prawa */}

                    <h2 className="hidden xl:block self-center justify-self-center font-brand-serif italic text-brand-white-100 xl:text-[80px] 2xl:text-[100px]">
                        Nas
                    </h2>

                    {/* Opis na dole – zawsze pod sliderem, nie w slajdzie */}
                </div>
            </div>
        </section>

    );
}
