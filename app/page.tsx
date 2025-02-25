import { HeroSection } from "@/components/Homepage/hero";
import { ScenariosSection } from "@/components/Homepage/scenarios";
import { GithubSection } from "@/components/Homepage/github";
import { CreditsSection } from "@/components/Homepage/credits";
import { CommunitySection } from "@/components/Homepage/community";
import ScrollButton from "@/components/Homepage/ScrollButton";
import { IntroOETSection } from "@/components/Homepage/introOET";

export default function Page() {
  return (
    <div className="w-screen min-h-screen overflow-y-scroll overflow-x-hidden bg-background flex flex-col items-center justify-center gap-4 p-4 lg:gap-8 lg:p-0 box-border max-w-screen">
      <HeroSection />
      <ScenariosSection />
      <IntroOETSection />
      <GithubSection />
      <CreditsSection />
      <CommunitySection />
    </div>
  );
}
