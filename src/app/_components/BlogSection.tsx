"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css";

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

const posts: BlogPost[] = [
  {
    title: "The History of Cryptocurrency",
    excerpt: "An overview of cryptocurrency history",
    image: "/images/blog/test.jpg",
    date: "2024-03-13",
    readTime: "4 min read",
  },
  {
    title: "How to Invest in Crypto Safely",
    excerpt: "Learn the fundamentals of secure crypto investment",
    image: "/images/blog/test.jpg",
    date: "2024-03-10",
    readTime: "1 min read",
  },
  {
    title: "How safe is cryptocurrency?",
    excerpt: "Understanding crypto security and risks",
    image: "/images/blog/test.jpg",
    date: "2024-03-03",
    readTime: "1 min read",
  },
  {
    title: "Understanding Blockchain Technology",
    excerpt: "A deep dive into blockchain",
    image: "/images/blog/test.jpg",
    date: "2024-02-28",
    readTime: "3 min read",
  },
  {
    title: "Top 5 Cryptocurrencies to Watch",
    excerpt: "An analysis of promising cryptocurrencies",
    image: "/images/blog/test.jpg",
    date: "2024-02-20",
    readTime: "5 min read",
  },
  {
    title: "Crypto Mining Explained",
    excerpt: "The basics of cryptocurrency mining",
    image: "/images/blog/test.jpg",
    date: "2024-02-15",
    readTime: "2 min read",
  },
  {
    title: "Smart Contracts 101",
    excerpt: "Understanding smart contracts",
    image: "/images/blog/test.jpg",
    date: "2024-02-10",
    readTime: "2 min read",
  },
  {
    title: "Decentralized Finance (DeFi)",
    excerpt: "An introduction to DeFi",
    image: "/images/blog/test.jpg",
    date: "2024-02-05",
    readTime: "3 min read",
  },
  {
    title: "The Future of Cryptocurrency",
    excerpt: "Predictions and trends",
    image: "/images/blog/test.jpg",
    date: "2024-01-30",
    readTime: "4 min read",
  },
];

const BlogSection = () => {
  const swiperRef = useRef(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMouseWithinBounds, setIsMouseWithinBounds] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);

  const slideGroups = Array.from(
    { length: Math.ceil(posts.length / 3) },
    (_, i) => posts.slice(i * 3, (i + 1) * 3),
  );

  const getPositionInGroup = (index: number) => index % 3;

  useEffect(() => {
    if (hoveredIndex !== null && !isPositioned) {
      const timer = setTimeout(() => {
        setIsPositioned(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hoveredIndex]);

  useEffect(() => {
    if (isPositioned && !isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isPositioned]);

  const slideVariants = {
    normal: {
      flex: 1,
      opacity: 1,
      x: 0,
      width: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    hovered: (index: number) => {
      const position = getPositionInGroup(index);
      const xOffset = position === 0 ? 0 : position === 1 ? "-100%" : "-200%";
      const adjustedX = isExpanded
        ? position === 0
          ? 0
          : position === 1
            ? 0
            : 0
        : xOffset;

      return {
        flex: 1,
        opacity: 1,
        width: isExpanded ? "70rem" : "auto",
        x: xOffset,
        transition: {
          x: { duration: 0.5, ease: "easeInOut" },
          width: {
            delay: isPositioned ? 0.5 : 0,
            duration: 0.3,
          },
          opacity: { duration: 0.2 },
        },
      };
    },
    hidden: {
      flex: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        opacity: { duration: 0.2 },
      },
    },
  };

  const handleHoverStart = (globalIndex: number) => {
    if (!isTransitioning) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      swiperRef.current?.autoplay.stop();
      setIsTransitioning(true);
      setHoveredIndex(globalIndex);
      setIsPositioned(false);
      setIsExpanded(false);

      hoverTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setHoveredIndex(null);
        setIsPositioned(false);
        setIsExpanded(false);
        swiperRef.current?.autoplay.start();
      }, 3000);
    }
  };

  const handleHoverEnd = () => {
    if (!isMouseWithinBounds) {
      setIsTransitioning(false);
      setIsPositioned(false);
      setIsExpanded(false);

      setTimeout(() => {
        setHoveredIndex(null);
        swiperRef.current?.autoplay.start();
      }, 100);
    }
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-3.5">
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsMouseWithinBounds(true)}
          onMouseLeave={() => {
            setIsMouseWithinBounds(false);
            handleHoverEnd();
          }}
        >
          <AnimatePresence>
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={3}
              slidesPerGroup={3}
              loop={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setActiveGroup(Math.floor(swiper.realIndex / 3));
              }}
              onSlideChange={(swiper) => {
                if (!isTransitioning) {
                  setActiveGroup(Math.floor(swiper.realIndex / 3));
                  setHoveredIndex(null);
                }
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="!px-4 !py-12"
            >
              {slideGroups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {group.map((post, index) => {
                    const globalIndex = groupIndex * 3 + index;
                    const position = getPositionInGroup(index);

                    return (
                      <SwiperSlide
                        key={post.title}
                        className="transition-all duration-500"
                      >
                        <motion.div
                          layout
                          initial="normal"
                          animate={
                            hoveredIndex === null
                              ? "normal"
                              : hoveredIndex === globalIndex
                                ? "hovered"
                                : "hidden"
                          }
                          variants={slideVariants}
                          custom={index}
                          className="h-full cursor-pointer"
                          style={{
                            transformOrigin:
                              position === 1
                                ? "left"
                                : position === 2
                                  ? "left"
                                  : "right",
                          }}
                          onHoverStart={() => handleHoverStart(globalIndex)}
                          onHoverEnd={handleHoverEnd}
                          onAnimationComplete={() => {
                            if (!isMouseWithinBounds) {
                              setIsTransitioning(false);
                            }
                          }}
                        >
                          <motion.div
                            // animate={{
                            //   scale: hoveredIndex === globalIndex ? 1.05 : 1,
                            // }}
                            // transition={{ duration: 0.3 }}
                            className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500"
                          >
                            <div className="relative h-48">
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500"
                              />
                            </div>

                            <div className="p-6">
                              <h3 className="text-primary mb-2 text-xl font-bold">
                                {post.title}
                              </h3>
                              <p className="mb-4 text-gray-600">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                  {new Date(post.date).toLocaleDateString()}
                                </span>
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </SwiperSlide>
                    );
                  })}
                </React.Fragment>
              ))}
            </Swiper>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
