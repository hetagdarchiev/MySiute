import seed from "./seed.json";
export type Project = {
  cover?: string;
  logo?: string;
  title: string;
  category: string;
  description: string;
  details: string;
  tags: string[];
  url: string;
  demo: string;
};
export type Skill = { title: string; description: string; items: string[] };
export type Content = {
  summary: string;
  bio: string[];
  skills: Skill[];
  projects: Project[];
};
export const apiURL = () => process.env.API_URL || "http://127.0.0.1:8080";
export async function getContent(): Promise<Content> {
  if (process.env.DEMO_MODE === "true") return seed;
  const r = await fetch(`${apiURL()}/api/content`, {
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error("Content API unavailable");
  return r.json();
}
