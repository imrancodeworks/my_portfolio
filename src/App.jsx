import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuestTracker from './components/QuestTracker';

export default function App() {
  useEffect(() => {
    let requestAnimationFrameId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smooth animation loop for updating CSS variables on document.body
    const updateLoop = () => {
      currentX += (targetX - currentX) * 0.15; // smooth interpolation
      currentY += (targetY - currentY) * 0.15;
      document.body.style.setProperty('--mx', currentX.toFixed(3));
      document.body.style.setProperty('--my', currentY.toFixed(3));
      requestAnimationFrameId = requestAnimationFrame(updateLoop);
    };

    if (window.matchMedia('(pointer: coarse)').matches) {
      // MOBILE: Track physical device tilt (Gyroscope)
      const handleOrientation = (e) => {
        const { beta, gamma } = e;
        if (beta === null || gamma === null) return;
        
        // gamma: left-to-right tilt (-90 to 90). Normalize around +/- 25 degrees.
        const normX = Math.max(-1.2, Math.min(1.2, gamma / 22));
        // beta: front-to-back tilt (-180 to 180). Normalize around standard 60-degree reading posture (+/- 20 degrees).
        const normY = Math.max(-1.2, Math.min(1.2, (beta - 60) / 18));
        
        targetX = normX;
        targetY = normY;
      };

      let iosRequestPermission;
      const cleanUpIosListeners = () => {
        if (iosRequestPermission) {
          window.removeEventListener('click', iosRequestPermission);
          window.removeEventListener('touchstart', iosRequestPermission);
        }
      };

      const initSensor = () => {
        if (
          typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
          // iOS 13+ requires user gesture to prompt permission dialog
          iosRequestPermission = async () => {
            try {
              const state = await DeviceOrientationEvent.requestPermission();
              if (state === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                cleanUpIosListeners();
              }
            } catch (err) {
              console.warn('Orientation request denied:', err);
            }
          };
          window.addEventListener('click', iosRequestPermission);
          window.addEventListener('touchstart', iosRequestPermission);
        } else {
          // Android and other non-permission platforms
          window.addEventListener('deviceorientation', handleOrientation);
        }
      };

      initSensor();
      requestAnimationFrameId = requestAnimationFrame(updateLoop);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
        cleanUpIosListeners();
        cancelAnimationFrame(requestAnimationFrameId);
      };
    } else {
      // DESKTOP: Track mouse cursor movement
      const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        targetX = x;
        targetY = y;
      };

      window.addEventListener('mousemove', handleMouseMove);
      requestAnimationFrameId = requestAnimationFrame(updateLoop);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(requestAnimationFrameId);
      };
    }
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <QuestTracker />
    </>
  );
}
