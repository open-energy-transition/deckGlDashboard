import Link from "next/link";

export const AboutInfo = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16  justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          about
          <span className="px-2 dark:text-card-foreground text-destructive">
            PyPSA-Earth
          </span>
        </div>
        <div className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          PyPSA-Earth is an independent community-owned research initiative
          which works thanks to the coordinated efforts of volunteers around the
          world. Together, we are making changes happen!{" "}
          <Link
            href="https://github.com/pypsa-meets-earth/"
            target="_blank"
            className="dark:text-secondary text-destructive"
          >
            Join us
          </Link>{" "}
          to try the model and contribute. Every bug report and typo fixed
          counts
        </div>
      </div>
    </section>
  );
};
