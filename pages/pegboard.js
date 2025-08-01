// PEGBOARD CUSTOMIZER LOGIC

// ---- SETUP ----
const pegboard = document.querySelector('#pegboard'); // <- your pegboard base
const inventory = document.querySelector('#inventory'); // <- your inventory section
const undoBtn = document.querySelector('#undo-button'); // <- undo button
const resetBtn = document.querySelector('#reset-button'); // <- reset button

let placedItems = [];
let lastAction = null;

// ---- DRAG & DROP ----
let draggedItem = null;

document.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('draggable')) {
    draggedItem = e.target.cloneNode(true);
    draggedItem.classList.add('dragging');
    e.dataTransfer.setData('text/plain', '');
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (!draggedItem) return;

  const isDroppingOnBoard = pegboard.contains(e.target) || e.target === pegboard;

  if (isDroppingOnBoard) {
    const pegRect = pegboard.getBoundingClientRect();
    const dropX = e.clientX - pegRect.left;
    const dropY = e.clientY - pegRect.top;

    // Snap logic here
    draggedItem.style.left = `${snapToGrid(dropX)}px`;
    draggedItem.style.top = `${snapToGrid(dropY)}px`;
    draggedItem.classList.remove('dragging');
    draggedItem.classList.add('placed');
    draggedItem.setAttribute('draggable', true);

    pegboard.appendChild(draggedItem);
    placedItems.push(draggedItem);
    lastAction = { type: 'add', item: draggedItem };
  }

  draggedItem = null;
});

// ---- SNAP TO GRID FUNCTION ----
function snapToGrid(position, gridSize = 20) {
  return Math.round(position / gridSize) * gridSize;
}

// ---- UNDO BUTTON ----
undoBtn.addEventListener('click', () => {
  if (lastAction && lastAction.type === 'add') {
    lastAction.item.remove();
    placedItems = placedItems.filter((el) => el !== lastAction.item);
    lastAction = null;
  }
});

// ---- RESET BUTTON ----
resetBtn.addEventListener('click', () => {
  placedItems.forEach((el) => el.remove());
  placedItems = [];
  lastAction = null;
});

// ---- INVENTORY HOVER TOOLTIP ----
document.querySelectorAll('.inventory-item').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    const label = document.createElement('div');
    label.className = 'tooltip';
    label.innerText = item.dataset.name; // <-- use data-name="3-Peg Platform" etc
    item.appendChild(label);
  });

  item.addEventListener('mouseleave', () => {
    const label = item.querySelector('.tooltip');
    if (label) label.remove();
  });
});
