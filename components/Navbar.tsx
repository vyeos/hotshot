import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import Logo from "./Logo";
import Link from "next/link";
import {
  AnimeTodayIcon,
  AnimeArchiveIcon,
  AnimeRankingIcon
} from "./AnimeIcons";

interface NavLinkProps {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const { signOut } = useAuthActions();

  const navLinks: NavLinkProps[] = [
    {
      name: "DROPS",
      url: "/",
      icon: <AnimeTodayIcon className="w-6 h-6" />,
    },
    {
      name: "VAULT",
      url: "/vault",
      icon: <AnimeArchiveIcon className="w-6 h-6" />,
    },
    {
      name: "LEADERBOARD",
      url: "/leaderboard",
      icon: <AnimeRankingIcon className="w-6 h-6" />,
    },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Logo />
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/20 transition-colors group"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {link.icon}
              </span>
              <span className="font-semibold text-sm tracking-wide group-hover:text-primary transition-colors">
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <Button
        variant="destructive"
        onClick={() => void signOut()}
        className="font-bold tracking-wider"
      >
        SIGN OUT
      </Button>
    </div>
  );
};

export default Navbar;
