// RoomsCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "./SubpageCarousel.css";
import "swiper/css";
import "swiper/css/navigation";

export interface Props {
    images: string[];
}

export default function SubpageCarousel({ images }: Props) {
    return (
        <section className="max-w-[var(--container-max-width)] mx-auto px-[40px] py-20">
            <div className="relative mx-auto max-w-5xl py-10">
                <button id="subpagePrev" className="hidden md:block absolute left-0 top-1/2 rotate-180 w-10 z-10 hover:scale-110 active:scale-90 duration-300">
                    <img src="/icons/unordered-list-icon.svg" />
                </button>

                <button id="subpageNext" className="hidden md:block absolute right-0 top-1/2 w-10 z-10 hover:scale-110 active:scale-90 duration-300">
                    <img src="/icons/unordered-list-icon.svg" />
                </button>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: "#subpagePrev",
                        nextEl: "#subpageNext",
                    }}
                    loop
                    autoplay={{
                        delay: 2000,
                    }}
                    slidesPerView={1}
                    spaceBetween={10}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 18 },
                        768: { slidesPerView: 3, spaceBetween: 18 },
                        1024: { slidesPerView: 4, spaceBetween: 18 },
                    }}
                    className="SubpageCarousel"
                >
                    {images.map((src, i) => (
                        <SwiperSlide key={i} className="slide-wrap">
                            <div className="overflow-hidden shadow-md aspect-[3/4]">
                                <img
                                    src={src}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
