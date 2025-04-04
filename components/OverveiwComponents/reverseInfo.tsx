export const ReverseInfo = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row-reverse flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16 justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-right text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          Who are we?
          <span className="px-2 dark:text-card-foreground text-destructive">
            Open Energy Transition
          </span>
        </div>
        <div className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          Open Energy Transition (OET) researches and develops open-source tools
          and methodologies to drive the global energy transition towards 100%
          renewable energy.
        </div>
      </div>
    </section>
  );
};
