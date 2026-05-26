"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  shopName: string;
  logo?: string;
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
];

export function Navbar({ shopName, logo }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    let st: ScrollTrigger | null = null;

    if (!reduced && navRef.current) {
      st = ScrollTrigger.create({
        start: "top -100",
        onUpdate: (self) => {
          gsap.to(navRef.current, {
            y: self.direction === 1 ? "-100%" : "0%",
            duration: 0.3,
            ease: "power2.out"
          });
        },
      });
    }

    return () => {
      if (st) st.kill();
    };
  }, []);

  return (
    <header 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[var(--color-primary-950)]/80 backdrop-blur-md border-b border-[var(--color-primary-200)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-10 relative">
          {logo ? (
            <Image 
              src={logo} 
              alt={shopName} 
              width={32} 
              height={32} 
              className="object-contain rounded-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-sm flex items-center justify-center text-white font-bold text-xl leading-none">
              {shopName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-xl tracking-tight text-[var(--color-primary-900)]">
            {shopName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-[var(--color-accent)]" 
                    : "text-[var(--color-primary-600)] hover:text-[var(--color-primary-900)]"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-[var(--color-accent)] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[var(--color-primary-900)]">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-[var(--color-primary-200)]">
              <SheetHeader>
                <SheetTitle className="text-left text-[var(--color-primary-900)]">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${
                        isActive 
                          ? "text-[var(--color-accent)]" 
                          : "text-[var(--color-primary-600)] hover:text-[var(--color-primary-900)]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
