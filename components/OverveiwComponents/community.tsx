import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CommunitySection = () => {
  return (
    <section id="community" className="mb-28">
      <div className="container py-12 sm:py-24">
        <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center w-full">
          <CardHeader>
            <CardTitle className="text-5xl md:text-6xl lg:text-8xl font-bold flex flex-col items-center">
              <DiscordIcon />
              <div>Ready to help shape tomorrow?</div>
            </CardTitle>
          </CardHeader>
          {/* <CardContent className="text-xl text-muted-foreground">
            Join our vibrant Discord community! Connect, share, and grow with
            like-minded enthusiasts. Click to dive in!
          </CardContent> */}

          <CardFooter>
            <Button className="w-40 p-4 mx-2 bg-secondary" asChild>
              <a
                href="https://discord.com/"
                target="_blank"
                className="text-card-foreground"
              >
                join discord
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
