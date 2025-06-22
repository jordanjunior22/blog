import React from 'react';
import Button from '../Button'; // Adjust the import path as needed

export default function Hero() {
    return (
        <section
            className="relative w-full h-screen bg-cover bg-center flex items-center justify-center text-white"
            style={{
                backgroundImage: "url('/background.jpg')", // Replace with your image path
            }}
        >
            <div className="absolute inset-0 bg-black/70" /> {/* Dark overlay */}

            <div className="relative z-10 text-center max-w-4xl text-center">
                <h1 className="text-4xl md:text-7xl  mb-6">
                    Exploring Life’s through <span className='text-(--cta-color) font-bold'>Depths</span> through <span className='text-(--cta-color) font-bold'>Words</span> 
                </h1>
                <p className="text-lg md:text-xl px-2 mb-8">
                    A collection of philosophical  poetry and timeless maxims that illuminate the human experience
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        text="Explore latest writing"
                        href="/blog"
                    />
                    <Button
                        text="Subscribe"
                        className="cursor-pointer text-sm bg-transparent border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
                        href="#subcribe"
                    />
                </div>
            </div>
        </section>
    );
}
