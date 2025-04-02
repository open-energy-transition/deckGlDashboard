import { AboutHero } from "@/components/OverveiwComponents/aboutHero";

import { InfoSection } from "@/components/OverveiwComponents/infoSection";
import { CommunitySection } from "@/components/OverveiwComponents/community";

import AboutSectionContainer from "@/components/OverveiwComponents/AboutSectionContainer";
import { AboutInfo } from "@/components/OverveiwComponents/aboutInfo";

export default function Page() {
  return (
    <>
      <AboutHero />
      <AboutSectionContainer />
      <AboutInfo />
      <CommunitySection />
    </>
  );
}
