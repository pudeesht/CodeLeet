import { useEffect, useState, useRef } from 'react';
import acceptedImg from '../../assets/accepted.png';
import rejectedImg from '../../assets/rejected.png';

const playSound = (type: 'VICTORY' | 'DEFEAT') => {
  const victoryUrl = "https://www.myinstants.com/media/sounds/gta-san-andreas-mission-passed-sound.mp3";
  const defeatUrl = "https://www.myinstants.com/media/sounds/gta-v-death-sound-effect-102.mp3";
  const audio = new Audio(type === 'VICTORY' ? victoryUrl : defeatUrl);
  audio.volume = 0.5; 
  audio.play().catch(e => console.error("Audio play failed", e));
};


export default function MemeOverlay() {
  const [mounted, setMounted] = useState(false); // denotes if in DOM or not
  const [visible, setVisible] = useState(false); 
  const [type, setType] = useState<'VICTORY' | 'DEFEAT' | null>(null);

  useEffect(() => {
    
    // @ts-ignore
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const handleSubmission = (e: any) => {
      const { status } = e.detail;
      
      let newType: 'VICTORY' | 'DEFEAT' | null = null;
      if (status === 10) newType = 'VICTORY';
      else if ([11, 14, 15, 20].includes(status)) newType = 'DEFEAT';

      if (newType) {
        setType(newType);
        setMounted(true);

        setTimeout(() => setVisible(true), 50);
        playSound(newType);

        setTimeout(() => {
          setVisible(false); 
          setTimeout(() => setMounted(false), 500); 
        }, 3000);
      }
    };

    targetWindow.addEventListener('leetcode-submission', handleSubmission);
    return () => targetWindow.removeEventListener('leetcode-submission', handleSubmission);
  }, []);

  if (!mounted || !type) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`relative flex flex-col items-center transition-transform duration-500 ${visible ? 'scale-100' : 'scale-90'}`}>
        
        <img 
          src={type === 'VICTORY' ? acceptedImg : rejectedImg} 
          alt={type}
          className="max-w-[600px] w-full rounded-xl shadow-2xl border-4 border-white/10"
        />
        
        {/* <h1 className="mt-4 text-5xl font-extrabold text-white tracking-widest uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] font-serif">
          {type === 'VICTORY' ? 'ACCEPTED' : 'WASTED'}
        </h1> */}
      </div>
    </div>
  );
}