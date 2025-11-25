import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "./WelcomeCarousel.css";

export default function WelcomeCarousel() {
  return (
    <section id="welcome-carousel" className="relative scroll-mt-[10px]">
      <div className="px-5 lg:px-0 py-20">
        <h1 className="text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] text-center font-brand-serif italic font-semibold mb-10 lg:mb-16">
          Witaj{" "}
          <span className="text-brand-green-125">W&nbsp;Harmonii Lasu</span>
        </h1>
        <div className="mx-auto w-full">
          <Swiper
            effect="coverflow"
            direction="horizontal"
            autoplay={{
              delay: 5000,
              reverseDirection: false,
              pauseOnMouseEnter: true,
            }}
            loop
            grabCursor
            centeredSlides
            slidesPerView={1}
            spaceBetween={1000}
            coverflowEffect={{
              rotate: 20,
              stretch: 60,
              depth: 400,
              modifier: 2,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="flex justify-center"
            breakpoints={{
              640: {
                spaceBetween: -120,
              },
              1024: {
                spaceBetween: -150,
              },
              1600: {
                spaceBetween: -500,
              },
            }}
          >
            {[...Array(6)].map((_, i) => (
              <SwiperSlide key={i} className="">
                <div className="md:max-w-[800px] flex items-center justify-center">
                  <img
                    src="/images/home-welcome.png"
                    alt="Forest Scene"
                    className="w-full h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex justify-center">
            <p className="sm:text-[16px] lg:text-[16px] xl:text-[18px] font-light py-5 md:max-w-[800px]">
              To miejsce powstało z myślą o tym , żebyś mógł odetchnąć od
              codzienności, zebrać myśli i rozwijać swoje pasje. Rozgość się,
              poczuj harmonię lasu, zjedz coś dobrego i pozwól sobie zwolnić w
              ciszy, spokoju i bliskości natury.
              <br />
              <span className="text-brand-green-125">
                Do zobaczenia w lesie!
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
