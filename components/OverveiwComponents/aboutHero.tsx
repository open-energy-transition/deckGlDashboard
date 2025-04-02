import Image from "next/image";

export const AboutHero = () => {
  return (
    <section className="container relative w-full h-[10rem] lg:h-[27rem] overflow-hidden">
      <div className="relative z-10 flex flex-col justify-center h-full font-sans text-card-foreground text-3xl md:text-4xl lg:text-6xl font-bold">
        <h1 className="flex flex-col">
          {" "}
          Methods&
          <span className=" text-destructive dark:text-secondary">
            Limitations
          </span>
        </h1>
      </div>
      <Image
        src="/images/credits/turbinewind.png"
        alt="Background"
        fill
        objectFit="cover"
        className="z-0 rounded-xl"
      />
    </section>
  );
};
