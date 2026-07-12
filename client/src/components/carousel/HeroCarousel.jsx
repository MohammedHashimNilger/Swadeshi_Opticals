import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { fetchBanners } from "../../services/bannerService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroCarousel() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners()
      .then(setBanners)
      .catch((err) => console.error("Failed to load banners:", err));
  }, []);

  if (!banners.length) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={banners.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation
        className="hero-carousel"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id}>
            {banner.linkUrl ? (
              <Link to={banner.linkUrl}>
                <img
                  src={banner.imageUrl}
                  alt={banner.title || "Banner"}
                  className="w-full h-auto max-h-[400px] object-cover md:max-h-[500px]"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Link>
            ) : (
              <img
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                className="w-full h-auto max-h-[400px] object-cover md:max-h-[500px]"
                loading={index === 0 ? "eager" : "lazy"}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
