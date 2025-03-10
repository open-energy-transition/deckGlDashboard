export const ReverseInfo = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row-reverse flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16 justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-right text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          Predicting the Future with
          <span className="px-2 dark:text-card-foreground text-destructive">
            Energy Modeling
          </span>
        </div>
        <div className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          This output data visualisation model aids to showcase the predictions
          of Pypsa-Earth’s Energy Model. Specifically pointing out the changes
          necessary in energy generation to achieve a net-zero target by 2050.
          This helps in the decision making of energy politics and ultimately
          contributes to a better future.
        </div>
      </div>
    </section>
  );
};
