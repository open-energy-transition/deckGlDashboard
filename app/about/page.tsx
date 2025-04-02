import { AboutHero } from "@/components/OverveiwComponents/aboutHero";

import { InfoSection } from "@/components/OverveiwComponents/infoSection";
import { CommunitySection } from "@/components/OverveiwComponents/community";

import AboutSectionContainer from "@/components/OverveiwComponents/AboutSectionContainer";

export default function Page() {
  return (
    <>
      <AboutHero />
          <AboutSectionContainer />
          <InfoSection />
             <CommunitySection />
    </>
  );
}

