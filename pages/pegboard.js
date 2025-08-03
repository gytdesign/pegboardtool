// pages/pegboard.js

import { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import Image from 'next/image';
import Head from 'next/head';

function DraggableItem({ id, src, label }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="inventory-item draggable"
      data-name={label}
    >
      <Image src={src} alt={label} width={60} height={60} draggable={false} />
    </div>
  );
}

function PegboardDropZone({ items }) {
  const { setNodeRef } = useDroppable({ id: 'pegboard' });

  return (
    <div
      id="pegboard"
      ref={setNodeRef}
      className="relative w-[700px] h-[500px] border-2 border-black bg-white mx-auto mt-4"
    >
      <Image
        src="/assets/pegboard-base.png"
        alt="Pegboard Base"
        layout="fill"
        objectFit="contain"
        priority
      />
      {items.map((item, index) => (
        <div
          key={index}
          className="absolute placed"
          style={{ top: item.top, left: item.left }}
        >
          <Image src={item.src} alt={item.label} width={60} height={60} />
        </div>
      ))}
    </div>
  );
}

export default function PegboardPage() {
  const [items, setItems] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || over.id !== 'pegboard') return;

    const pegboard = document.getElementById('pegboard');
    const rect = pegboard.getBoundingClientRect();

    const dropX = event.activatorEvent.clientX - rect.left;
    const dropY = event.activatorEvent.clientY - rect.top;

    const snappedX = snapToGrid(dropX);
    const snappedY = snapToGrid(dropY);

    const draggedEl = document.querySelector(`[data-name][data-id='${active.id}']`) || document.querySelector(`[data-name]`);
    const src = draggedEl?.querySelector('img')?.src || '';
    const label = draggedEl?.dataset.name || active.id;

    const newItem = { id: active.id, left: snappedX, top: snappedY, src, label };
    setItems((prev) => [...prev, newItem]);
    setLastAction({ type: 'add', item: newItem });
  }

  function snapToGrid(pos, grid = 20) {
    return Math.round(pos / grid) * grid;
  }

  function handleUndo() {
    if (lastAction && lastAction.type === 'add') {
      setItems((prev) => prev.filter((item) => item !== lastAction.item));
      setLastAction(null);
    }
  }

  function handleReset() {
    setItems([]);
    setLastAction(null);
  }

  return (
    <>
      <Head>
        <title>Pegboard Tool</title>
      </Head>
      <main className="p-4">
        <h1 className="text-2xl font-bold text-center">Pegboard Customizer</h1>
        <div id="inventory" className="flex gap-4 flex-wrap justify-center mt-4">
          <DraggableItem id="item-1" src="/assets/pieces/3-Peg.png" label="3-Peg" />
          <DraggableItem id="item-2" src="/assets/pieces/4-Peg.png" label="4-Peg" />
          <DraggableItem id="item-3" src="/assets/products/Can.png" label="Can" />
          <DraggableItem id="item-4" src="/assets/products/PumpBottle.png" label="Pump Bottle" />
          {/* Add more items as needed */}
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <PegboardDropZone items={items} />
        </DndContext>

        <div className="flex justify-center gap-4 mt-6">
          <button id="undo-button" className="btn" onClick={handleUndo}>
            Undo
          </button>
          <button id="reset-button" className="btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </main>
    </>
  );
}
