'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates children of a container ref on scroll (fade up + stagger).
 * @param {string} selector - CSS selector for elements to animate inside the container
 * @param {object} options - GSAP from() vars override
 */
export function useScrollReveal(selector = '.reveal', options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements || elements.length === 0) return;

      gsap.fromTo(
        elements,
        { y: 60, opacity: 0, ...options.from },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.9,
          stagger: options.stagger || 0.15,
          ease: options.ease || 'power3.out',
          ...options.to,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}

/**
 * Animate a single element on scroll.
 */
export function useScrollRevealSingle(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: 50, opacity: 0, ...options.from },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.9,
          ease: options.ease || 'power3.out',
          ...options.to,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };
