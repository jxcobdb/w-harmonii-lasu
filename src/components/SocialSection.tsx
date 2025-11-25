const mockPosts = [
  {
    id: "1",
    shortcode: "mock1",
    thumbnail: "/images/scroll-section/scroll-section-1.png",
  },
  {
    id: "2",
    shortcode: "mock2",
    thumbnail: "/images/scroll-section/scroll-section-2.png",
  },
  {
    id: "3",
    shortcode: "mock3",
    thumbnail: "/images/scroll-section/scroll-section-3.png",
  },
  {
    id: "4",
    shortcode: "mock4",
    thumbnail: "/images/scroll-section/scroll-section-4.png",
  },
  {
    id: "5",
    shortcode: "mock5",
    thumbnail: "/images/scroll-section/scroll-section-5.png",
  },
  {
    id: "6",
    shortcode: "mock6",
    thumbnail: "/images/scroll-section/scroll-section-6.png",
  },
  {
    id: "7",
    shortcode: "mock7",
    thumbnail: "/images/scroll-section/scroll-section-7.png",
  },
  {
    id: "8",
    shortcode: "mock8",
    thumbnail: "/images/scroll-section/scroll-section-8.png",
  },
] as const;

export default function SocialSection() {
  const posts = mockPosts;
  const state: "idle" | "loading" | "error" = "idle";

  return (

    <section
      className="relative"
      style={{
        backgroundImage: 'url("/images/social-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute w-full h-full bg-brand-grey-400 opacity-80">
      </div>
      <div className="px-5 py-20 z-10 relative">
        <h2 className="self-center justify-self-center font-brand-serif italic text-brand-white-100 text-[40px] sm:text-[50px] md:text-[70px]">
          Bądź na bieżąco!
        </h2>
        <h4 className="self-center justify-self-center font-brand-serif italic text-brand-green-100 md:text-[20px] mb-10">
          Obserwuj nasz instagram
        </h4>
        <div className="bg-brand-white-125 mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <div className="px-4 py-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/images/instagram-profile.png"
                alt="W Harmonii Lasu"
                className="shrink-0 "
              />
              <div className="text-left">
                <h2 className="text-lg font-bold text-brand-black-100">
                  W Harmonii Lasu
                </h2>
                <p className="text-brand-grey-200 text-[14px]">@wharmoniilasu</p>
              </div>
            </div>
            <div className="flex row gap-8 flex-wrap items-center justify-center">
              <div className="flex items-center gap-6 text-center">
                <div>
                  <p className="text-lg font-semibold text-brand-black-100">42</p>
                  <p className="text-[14px] text-brand-grey-200 ">Posty</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-brand-black-100">192</p>
                  <p className="text-[14px] text-brand-grey-200">obserwujących</p>
                </div>
              </div>
              <div className="flex items-center">
                <a
                  href="https://www.instagram.com/wharmoniilasu/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-brand-green-125 px-5 py-2 text-brand-white-100 shadow-md transition hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path
                      d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    ></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Obserwuj</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.slice(0, 8).map((post, index) => (
              <a
                key={post.id}
                href="https://www.instagram.com/wharmoniilasu/"
                target="_blank"
                rel="noreferrer"
                className={`group relative aspect-square overflow-hidden ${index >= 6 ? "hidden lg:block " : ""
                  }`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <img
                  src={post.thumbnail}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
