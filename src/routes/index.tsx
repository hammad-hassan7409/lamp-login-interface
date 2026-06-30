import { createFileRoute } from "@tanstack/react-router";
import LampLogin from "@/components/LampLogin";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Sign in" },
      { name: "description", content: "A cinematic dark-luxury sign in experience." },
      { property: "og:title", content: "Lumen — Sign in" },
      { property: "og:description", content: "A cinematic dark-luxury sign in experience." },
    ],
  }),
  component: Index,
});

function Index() {
  return <LampLogin />;
}
