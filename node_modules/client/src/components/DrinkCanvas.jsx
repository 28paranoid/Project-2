import React, { useRef, useEffect, useState } from 'react';
import { drawDrink, IW, IH, GL } from '../utils/drinkPixelArt';

const DrinkCanvas = ({ drink, prog, animating = false, width = 140 }) => {
  const canvasRef = useRef(null);
  const [animTime, setAnimTime] = useState(0);
  const dripsRef = useRef([]);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loop = (t) => {
      if (animating) {
        setAnimTime((prev) => prev + 1);
        
        // Drip logic
        if (Math.random() < 0.045 * prog && dripsRef.current.length < 8) {
          dripsRef.current.push({
            lx: GL.iX1 + Math.floor(Math.random() * IW),
            ly: GL.iY1 + Math.ceil(IH * (1 - prog)) - 1,
            speed: 0.07 + Math.random() * 0.13
          });
        }
        const liqTop = GL.iY1 + Math.ceil(IH * (1 - prog));
        dripsRef.current = dripsRef.current.filter(d => {
          d.ly += d.speed;
          return d.ly < liqTop + 4;
        });
      }
      
      drawDrink(canvas, drink, prog, animTime, dripsRef.current);
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [drink, prog, animating, animTime]);

  const height = (width / 160) * 228;

  return (
    <div className="pixel-canvas-wrapper flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={160}
        height={228}
        style={{ width: `${width}px`, height: 'auto', imageRendering: 'pixelated' }}
        aria-label={`Illustration of ${drink?.name}`}
        role="img"
      />
    </div>
  );
};

export default DrinkCanvas;