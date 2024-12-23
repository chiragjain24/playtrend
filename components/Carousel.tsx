"use client"
import React, { useEffect, useState, useRef, memo } from 'react'
import Image from 'next/image';
import { Play, Volume2, VolumeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultShowProps } from '@/types/types';

type Props = {
    shows: ResultShowProps[],
}

const Carousel = ({ shows }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLIFrameElement | null>(null);

    const handleUnmute = () => {
        if (videoRef.current?.contentWindow) {
            videoRef.current.contentWindow.postMessage(
                `{"event":"command","func":"${isMuted ? 'unMute' : 'mute'}","args":""}`,
                '*'
            );
            setIsMuted(!isMuted);
        }
    }

    const nextSlide = () => {
        setIsVideoLoaded(false);
        setCurrentIndex((prevIndex) =>
            prevIndex === shows.length - 1 ? 0 : prevIndex + 1
        );
    }

    const prevSlide = () => {
        setIsVideoLoaded(false);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? shows.length - 1 : prevIndex - 1
        );
    }

    const handleVideoLoad = () => {
        if (videoRef.current?.contentWindow) {
            videoRef.current.contentWindow.postMessage( `{"event":"command","func":"${!isMuted ? 'unMute' : 'mute'}","args":""}`, '*' );
            setTimeout(()=>{
                if(videoRef.current){
                    videoRef.current.style.opacity = '1';
                    setIsVideoLoaded(true);
                }
            },500)
        }
    }

    // Reset when shows change
    useEffect(() => {
        setIsVideoLoaded(false);
        setCurrentIndex(0);

        if (videoRef.current) {
            videoRef.current.style.opacity = '0';
        }
    }, [shows]);

    // Handle video state changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.style.opacity = '0';
        }
    }, [currentIndex]);


    if (shows.length === 0) return <div className="h-screen flex items-center justify-center"></div>;

    return (
        <div className="relative w-full h-screen max-lg:h-[90vh] overflow-hidden">
            <AnimatePresence mode="wait">
                {shows.map((item, index) => (
                    index === currentIndex && (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            {/* Background Image (always present) */}
                            <Image 
                                unoptimized 
                                src={`https://image.tmdb.org/t/p/original/${item.image}`} 
                                alt={item.title} 
                                fill 
                                className={`absolute inset-0 object-cover transition-opacity duration-500 ${
                                    item.videos.length > 0 && isVideoLoaded ? 'opacity-0' : 'opacity-50'
                                }`}
                            />

                            {/* YouTube Video */}
                            {item.videos.length > 0 && (
                                <iframe
                                    ref={videoRef}
                                    key={`video-${shows[shows.length-1].id}-${item.id}`}
                                    title='video'
                                    src={`https://www.youtube-nocookie.com/embed/${item.videos[0].key}?vq=hd1080&autoplay=1&volume=100&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&enablejsapi=1&disablekb=1&playsinline=1&loop=1&iv_load_policy=3&fs=0&color=white`}
                                    className="-translate-y-16 absolute inset-0 max-lg:h-full lg:w-full aspect-video object-cover opacity-0 transition-opacity duration-500"
                                    allow='autoplay; encrypted-media;'
                                    referrerPolicy='strict-origin-when-cross-origin'
                                    onLoad={handleVideoLoad}
                                />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/30"></div>

                            {/* Content */}
                            <div className="relative z-10 container mx-auto px-6 flex items-center h-full">
                                <div className="max-w-2xl text-white space-y-6 lg:absolute lg:left-20">
                                    {/* Show Logo */}
                                    <div className="relative w-64 h-24">
                                        {item.logo ? (
                                            <Image
                                                unoptimized
                                                fill
                                                alt={`${item.title} logo`}
                                                src={`https://image.tmdb.org/t/p/w300/${item.logo}`}
                                                className="object-contain"
                                            /> ) : (
                                                <div className='text-4xl font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent'>{item.title}</div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-lg opacity-80 line-clamp-3">
                                        {item.description}
                                    </p>

                                    {/* Metadata */}
                                    <div className="flex items-center space-x-4 text-sm opacity-80">
                                        <span>{item.year}</span>
                                        <span>•</span>
                                        <span>{item.genres?.join(', ')}</span>
                                        <span>•</span>
                                        <span>⭐ {item.stars}/10</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-4">
                                        <Link prefetch={false} target='_blank' href={`https://www.google.com/search?q=${encodeURIComponent(item.title)}`}>
                                            <Button variant="default" size="lg" className="flex items-center gap-2">
                                                <Play className="w-5 h-5" /> Watch Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>
            {/* Premium Bottom Navigation */}
                <div className="absolute z-20 inset-x-0 bottom-10 max-lg:bottom-20 container mx-auto px-6 flex justify-center">
                    <div className="bg-white/15 backdrop-blur-lg rounded-full p-2 flex items-center space-x-3 px-4">
                        {/* Previous Button */}
                        <button 
                            onClick={prevSlide} 
                            className="p-2 hover:bg-white/20 rounded-full transition-colors group"
                        >
                            <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                        </button>

                        {/* Navigation Dots */}
                        <div className="flex items-center space-x-2">
                            {shows.map((_, dotIndex) => (
                                <button
                                    key={dotIndex}
                                    onClick={() => setCurrentIndex(dotIndex)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        dotIndex === currentIndex
                                            ? 'bg-white scale-125'
                                            : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                />
                            ))}
                        </div>
                        {/* Next Button */}
                        <button
                            onClick={nextSlide}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors group"
                        >
                            <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                        </button>

                        {/* Mute/Unmute Button */}
                        <button
                            onClick={handleUnmute}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors group"
                            aria-label="Toggle Mute"
                        >
                            {isMuted ?
                                <VolumeOff className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" /> :
                                <Volume2 className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                            }
                        </button>
                    </div>
                </div>
        </div>
    );
}

export default memo(Carousel);