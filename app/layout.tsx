import type { Metadata } from "next";
import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import ThirdPartyProvider from "@/context/ThirdPartyProvider";

const inter = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://get-repos.vercel.app/"),
  title: "Get Repos",
  description:
    "An easy way to find repositories of your favorite developers. Just enter their name to see all their repositories and information about each one. Get started now!",
  openGraph: {
    title: "Get Repos",
    description:
      "An easy way to find repositories of your favorite developers. Just enter their name to see all their repositories and information about each one. Get started now!",
    url: "https://get-repos.vercel.app/",
  },
  keywords: [
    "repos",
    "repositories",
    "get repos",
    "get repositories",
    "github repositories",
    "github repo",
    "github repos",
    "repo",
    "developers repo",
    "repositorios",
    "repositorios github",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdPartyProvider>{children}</ThirdPartyProvider>
      </body>
    </html>
  );
}
