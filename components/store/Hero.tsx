"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  headline: string;
  subheadline?: string;
  backgroundImage?: string;
}

export function Hero({ headline, subheadline, backgroundImage }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        gsap.from(".hero-word", { 
          y: 40, 
          opacity: 0, 
          stagger: 0.08, 
          duration: 0.8, 
          ease: "power2.out" 
        });
        
        gsap.from(".hero-sub", { 
          y: 20, 
          opacity: 0, 
          duration: 0.6, 
          delay: 0.5, 
          ease: "power2.out" 
        });
        
        gsap.from(".hero-cta", { 
          y: 15, 
          opacity: 0, 
          duration: 0.5, 
          delay: 0.7, 
          ease: "power2.out" 
        });
      }
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  const words = headline.split(" ");

  return (
    <div 
      ref={heroRef}
      className="relative flex flex-col items-center justify-center min-h-[80vh] md:min-h-screen w-full px-6 text-center overflow-hidden"
    >
      {backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50 z-0" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)] z-0" />
      )}
      
      <div className="relative z-10 max-w-4xl flex flex-col items-center space-y-8">
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${backgroundImage ? 'text-white' : 'text-[var(--color-primary-950)]'}`}>
          {words.map((word, i) => (
            <span key={i} className="hero-word inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
        </h1>
        
        {subheadline && (
          <p className={`hero-sub text-lg md:text-2xl max-w-2xl ${backgroundImage ? 'text-zinc-200' : 'text-[var(--color-primary-700)]'}`}>
            {subheadline}
          </p>
        )}
        
        <div className="hero-cta pt-4">
          <Button 
            asChild 
            size="lg" 
            className="rounded-full px-8 text-lg bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity border-0"
          >
            <Link href="/products">
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
