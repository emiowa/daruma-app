'use client';

import { Parallax } from 'react-scroll-parallax';
import Image from 'next/image';
import styles from './ParallaxHero.module.css';

export default function ParallaxHero() {
  return (
    <section className={styles.hero}>

      {/* ── STATIC MOBILE FALLBACK ── */}
      <div className={styles.mobileFallback} />

      {/* ── PARALLAX SCENE (desktop only) ── */}
      <div className={styles.scene}>

        {/* Sky */}
        <Parallax speed={-2} className={styles.layer}>
        <Image
            src="/images/scene1/sky.png"
            alt=""
            width={1440}    // your canvas width in pixels
            height={900}    // your canvas height in pixels
            unoptimized
            style={{ 
            width: '100vw',
            height: 'auto',
            imageRendering: 'pixelated',
            }}
            priority
        />
        </Parallax>

        {/* Clouds */}
        <Parallax speed={-2} className={styles.layer}>
        <div className={styles.animateClouds}>
            <Image
            src="/images/scene1/cloud1.png"
            alt=""
            width={1440}    // your canvas width in pixels
            height={900}    // your canvas height in pixels
            unoptimized
            style={{ 
                width: '100%',
                height: 'auto',
                imageRendering: 'pixelated',
                position: 'absolute',
                bottom: 0,        // anchor to bottom of container
            }}
            />
        </div>
        </Parallax>

        {/* Mountain */}
        <Parallax speed={-6} className={styles.layer}>
        <Image
            src="/images/scene1/mount-fuji.png"
            alt=""
            width={1440}    // your canvas width in pixels
            height={900}    // your canvas height in pixels
            unoptimized
            style={{ 
                width: '100%',
                height: 'auto',
                imageRendering: 'pixelated',
                position: 'absolute',
                bottom: 0,        // anchor to bottom of container
            }}
        />
        </Parallax>

        {/* Trees */}
        <Parallax speed={-4} className={styles.layer}>
        <Image
            src="/images/scene1/trees.png"
            alt=""
            width={1440}    // your canvas width in pixels
            height={900}    // your canvas height in pixels
            unoptimized
            style={{ 
                width: '100%',
                height: 'auto',
                imageRendering: 'pixelated',
                position: 'absolute',
                bottom: 0,        // anchor to bottom of container
            }}
        />
        </Parallax>

        {/* Ground */}
        <Parallax speed={-2} className={styles.layer}>
        <Image
            src="/images/scene1/ground-and-grass.png"
            alt=""
            width={1440}    // your canvas width in pixels
            height={900}    // your canvas height in pixels
            unoptimized
            style={{ 
                width: '100%',
                height: 'auto',
                imageRendering: 'pixelated',
                position: 'absolute',
                bottom: 0,        // anchor to bottom of container
            }}
        />
        </Parallax>

        {/* Train */}
        <Parallax speed={-2} className={styles.layer}>
        <div className={styles.animateTrain}>
            <Image
            src="/images/scene1/shinkansen.png"
            alt=""
            width={600}
            height={180}
            unoptimized
            style={{ width: '100vw', height: 'auto', imageRendering: 'pixelated' }}
            />
        </div>
        </Parallax>

        {/* Scene test */}
        <Parallax speed={-2} className={styles.layer}>
        <Image
            src="/images/scene1/scene-test.png"
            alt=""
            width={1440}    // your canvas width in pixels
            height={900}    // your canvas height in pixels
            unoptimized
            style={{ 
                width: '100%',
                height: 'auto',
                imageRendering: 'pixelated',
                position: 'absolute',
                bottom: 0,        // anchor to bottom of container
            }}
        />
        </Parallax>
      </div>
    </section>
  );
}