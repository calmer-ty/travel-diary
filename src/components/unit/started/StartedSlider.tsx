import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export function StartedSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  const sliderItem = ["./images/start/img_slider01.png", "./images/start/img_slider02.png", "./images/start/img_slider03.png"];

  return (
    <div className="size-full overflow-hidden" ref={emblaRef}>
      <div className="size-full flex">
        {sliderItem.map((src, i) => (
          <img key={i} src={src} className="flex-none w-full object-contain"></img>
        ))}
      </div>
    </div>
  );
}
