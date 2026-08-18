import { createFileRoute } from "@tanstack/react-router";
import LampLogin from "@/components/LampLogin";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In — Lumen Studio" },
      { name: "description", content: "Access your Lumen Studio account through our premium, cinematic interactive interface." },
      { property: "og:title", content: "Sign In — Lumen Studio" },
      { property: "og:description", content: "Access your Lumen Studio account through our premium, cinematic interactive interface." },
    ],
  }),
  component: Index,
});

function Index() {
  return <LampLogin />;
}
