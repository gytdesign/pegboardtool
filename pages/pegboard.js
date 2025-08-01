// pages/pegboard.js
'use client';

import { useEffect } from 'react';
import Head from 'next/head';

export default function Pegboard() {
  useEffect(() => {
    // DOM elements
    const pegboard = document.querySelector('#pegboard-grid');
    const undoBtn = document.querySelector('#undo-btn');
    const resetBtn = document.querySelector('#reset-btn');

    let placedItems = [];
    let lastAction = null;
    let draggedItem = null;

    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('inventory-item')) {
        draggedItem = e.target.cloneNode(true);
        draggedItem.classList.add('placed');
        e.dataTransfer.setData('text/plain', '');
      }
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!draggedItem) return;

      const pegRect = pegboard.getBoundingClientRect();
      const dropX = e.clientX - pegRect.left;
      const dropY = e.clientY - pegRect.top;

      draggedItem.style.position = 'absolute';
      draggedItem.style.left = `${snapToGrid(dropX)}px`;
      draggedItem.style.top = `${snapToGrid(dropY)}px`;
      draggedItem.setAttribute('draggable', true);

      pegboard.appendChild(draggedItem);
      placedItems.push(draggedItem);
      lastAction = { type: 'add', item: draggedItem };
      draggedItem = null;
    });

    function snapToGrid(pos, gridSize = 20) {
      return Math.round(pos / gridSize) * gridSize;
    }

    undoBtn?.addEventListener('click', () => {
      if (lastAction?.type === 'add') {
        lastAction.item.remove();
        placedItems = placedItems.filter((el) => el !== lastAction.item);
        lastAction = null;
      }
    });

    resetBtn?.addEventListener('click', () => {
      placedItems.forEach((el) => el.remove());
      placedItems = [];
      lastAction = null;
    });

    document.querySelectorAll('.inventory-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const label = document.createElement('div');
        label.className = 'tooltip';
        label.innerText = item.dataset.name;
        item.appendChild(label);
      });
      item.addEventListener('mouseleave', () => {
        const label = item.querySelector('.tooltip');
        if (label) label.remove();
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Pegboard Customiser</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Calistoga&family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className="header">
        <div>
          <img className="logo" src="/assets/TSP-purple-logo.png" alt="Logo" />
        </div>
        <div className="main-header">
          <h1>Pegboard Customiser Tool</h1>
        </div>
        <div>
          <p style={{ fontSize: '18px', lineHeight: '2' }}>
            Drag and drop items to design your pegboard display.
            <br />
            Submit your desired layout to get started with your installation!
          </p>
        </div>
      </header>

      <main className="builder-container">
        <section className="pegboard-title">
          <h2>STEP 1. Customise your pegboard</h2>
          <p>
            Select a <b>Pegboard piece</b> and drag it onto the <b>Pegboard</b>.
            <br />
            To remove any object from the pegboard, drag it outside of the pegboard area.
          </p>
        </section>

        <section className="pegboard-builder-area">
          <div className="pegboard-panel">
            <div className="pegboard-toolbar">
              <h3>Pegboard</h3>
              <div className="action-buttons">
                <button id="undo-btn">
                  <img className="button-icon" src="/assets/UndoIcon.png" alt="Undo" />
                  <div className="button-label">Undo</div>
                </button>
                <button id="reset-btn">
                  <img className="button-icon" src="/assets/ResetIcon.png" alt="Reset" />
                  <div className="button-label">Reset Board</div>
                </button>
              </div>
            </div>

            <div className="pegboard-wrapper">
              <img src="/assets/pegboard-base.png" alt="Pegboard Grid" id="pegboard-base" />
              <div className="pegboard-grid" id="pegboard-grid"></div>
            </div>
          </div>

          <div className="inventory-panel">
            <section className="pegboard-pieces">
              <h3>Pegboard Pieces</h3>
              <div className="inventory-group">
                <img
                  src="/assets/pieces/3-Peg.png"
                  alt="3-Peg"
                  className="inventory-item"
                  draggable
                  data-name="3-Peg Platform"
                />
                {/* Add more items as needed */}
              </div>
            </section>

            <section className="products">
              <h3>Products</h3>
              <div className="inventory-group">
                <img
                  src="/assets/products/Can.png"
                  alt="Can"
                  className="inventory-item"
                  draggable
                  data-name="Can Product"
                />
                {/* Add more items as needed */}
              </div>
            </section>
          </div>
        </section>
      </main>

      <section className="form-section">
        <h2>Submit Your Design</h2>
        <form id="submission-form">
          <label>
            Your name
            <input type="text" name="name" required />
          </label>
          <label>
            Brand
            <input type="text" name="brand" />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Mobile no. (WhatsApp)
            <input type="tel" name="mobile" required />
          </label>
          <label>
            Additional notes
            <textarea name="notes" rows="4"></textarea>
          </label>
          <button type="submit" id="submit-btn" className="button-label">
            Submit Pegboard Design
          </button>
        </form>
      </section>

      <footer className="site-footer">
        <p>
          Need help? Email us at <a href="mailto:hello@yourcompany.com">hello@yourcompany.com</a>
        </p>
        <p>© 2025 Third Space Pilates Malaysia. All rights reserved.</p>
      </footer>
    </>
  );
}
