import { useRef, useEffect, useState } from "react";

export default function PegboardPage() {
  const pegboardRef = useRef(null);
  const [itemsOnBoard, setItemsOnBoard] = useState([]);

  useEffect(() => {
    const inventoryItems = document.querySelectorAll(".inventory-item");

    inventoryItems.forEach(item => {
      item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.dataset.type);
      });
    });

    const pegboard = pegboardRef.current;
    if (!pegboard) return;

    pegboard.addEventListener("dragover", (e) => e.preventDefault());

    pegboard.addEventListener("drop", (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("text/plain");
      const rect = pegboard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setItemsOnBoard(prev => [...prev, { id: Date.now(), type, x, y }]);
    });
  }, []);

  return (
    <div className="pegboard-page">
      <h1>Pegboard Customiser Tool</h1>

      <aside className="inventory">
        <h2>Inventory</h2>
        <img
          src="/assets/3peg.png"
          alt="3 peg platform"
          className="inventory-item"
          draggable="true"
          data-type="3peg"
        />
        <img
          src="/assets/clip.png"
          alt="Clip"
          className="inventory-item"
          draggable="true"
          data-type="clip"
        />
      </aside>

      <section className="pegboard-section">
        <div className="pegboard-wrapper">
          <img src="/assets/pegboard-base.png" alt="Pegboard" />
          <div className="pegboard-grid" ref={pegboardRef}>
            {itemsOnBoard.map(item => (
              <img
                key={item.id}
                src={`/assets/${item.type}.png`}
                className="pegboard-item"
                style={{ position: "absolute", left: item.x, top: item.y }}
                alt={item.type}
              />
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>Need help? Email us at <a href="mailto:hello@yourcompany.com">hello@yourcompany.com</a></p>
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
