"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MemoryProps {
  data: any; // { pares: [{ id, imagen, palabra }] }
  onFinish: () => void;
}

export function MemoryGame({ data, onFinish }: MemoryProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Duplicamos y mezclamos las cartas (una con imagen, otra con texto)
    const cardSet = [
      ...data.pares.map((p: any) => ({ ...p, type: 'image', uniqueId: p.id + '_img' })),
      ...data.pares.map((p: any) => ({ ...p, type: 'text', uniqueId: p.id + '_txt' }))
    ].sort(() => Math.random() - 0.5);
    setCards(cardSet);
  }, [data]);

  const handleCardClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(cards[index].id)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      
      if (cards[first].id === cards[second].id) {
        setSolved([...solved, cards[first].id]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (solved.length === data.pares.length && data.pares.length > 0) {
      setTimeout(onFinish, 1000);
    }
  }, [solved]);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto p-4">
      {cards.map((card, index) => {
        const isFlipped = flipped.includes(index) || solved.includes(card.id);
        return (
          <div 
            key={card.uniqueId} 
            className="relative h-32 md:h-40 cursor-pointer"
            onClick={() => handleCardClick(index)}
          >
            <motion.div
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Parte de atrás (Cerrada) */}
              <div className="absolute inset-0 bg-[#8B4513] rounded-2xl flex items-center justify-center text-white text-4xl shadow-md" style={{ backfaceVisibility: "hidden" }}>
                ?
              </div>
              {/* Parte de adelante (Abierta) */}
              <div 
                className="absolute inset-0 bg-white border-2 border-orange-200 rounded-2xl flex items-center justify-center p-2 shadow-sm" 
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {card.type === 'image' ? (
                  <img src={card.imagen} alt="Objeto" className="w-full h-full object-contain" />
                ) : (
                  <span className="font-bold text-[#D4641C] text-lg text-center leading-tight">{card.palabra}</span>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}