// components/Pegboard.js

import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';


function InventoryItem({ id, label }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="inventory-item draggable"
      data-name={label}
      draggable
    >
      {label}
    </div>
  );
}

function PlacedItem({ id, left, top }) {
  return (
    <div
      className="placed"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {id}
    </div>
  );
}

function PegboardDropZone({ onDrop }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'pegboard' });

  return (
    <div id="pegboard" ref={setNodeRef} className="pegboard">
      {isOver && <div className="highlight" />}
    </div>
  );
}

export default function Pegboard() {
  const [activeId, setActiveId] = useState(null);
  const [placedItems, setPlacedItems] = useState([]);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { over, delta } = event;
    if (over?.id === 'pegboard') {
      const newItem = {
        id: activeId,
        left: snapToGrid(delta.x + 100), // adjust offset to your layout
        top: snapToGrid(delta.y + 100),
      };
      setPlacedItems((items) => [...items, newItem]);
    }
    setActiveId(null);
  }

  function handleReset() {
    setPlacedItems([]);
  }

  function snapToGrid(value, grid = 20) {
    return Math.round(value / grid) * grid;
  }

  return (
    <div id="customizer">
      <h1>Pegboard Customizer</h1>
      <div id="inventory">
        <InventoryItem id="Platform" label="3-Peg Platform" />
        <InventoryItem id="Tray" label="Flat Tray" />
        <InventoryItem id="Hooks" label="Double Hooks" />
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="pegboard-wrapper">
          <PegboardDropZone />

          {placedItems.map((item, index) => (
            <PlacedItem key={index} {...item} />
          ))}

          <DragOverlay>
            {activeId ? <div className="drag-preview">{activeId}</div> : null}
          </DragOverlay>
        </div>
      </DndContext>

      <div id="controls">
        <button id="reset-button" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
