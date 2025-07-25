"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="card-modern w-10 h-10 p-0 hover:scale-105 transition-transform"
        >
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className="text-foreground"
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className="text-foreground"
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className="text-foreground"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="card-modern border"
        align="start"
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem 
            className="flex gap-2 text-foreground hover:bg-accent focus:bg-accent" 
            value="light"
          >
            <Sun size={ICON_SIZE} className="text-foreground" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex gap-2 text-foreground hover:bg-accent focus:bg-accent" 
            value="dark"
          >
            <Moon size={ICON_SIZE} className="text-foreground" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex gap-2 text-foreground hover:bg-accent focus:bg-accent" 
            value="system"
          >
            <Laptop size={ICON_SIZE} className="text-foreground" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
