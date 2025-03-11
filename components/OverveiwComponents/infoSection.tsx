export const InfoSection = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16  justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          How did we model
          <span className="px-2 dark:text-card-foreground text-destructive">
            2050?
          </span>
        </div>
        <div className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          We took our expertise in energy system modelling and calculated 2050 scenarios for various countries,
          while ensuring the constraint of zero CO₂ emissions is kept.
          All our work for this project is open-source and reproducable, a habit we've had for years.
          Reach out if you're interested in our open-source model.
          Enjoy our first-of-a-kind energy system visualizations.
        </div>
      </div>
    </section>
  );
};
