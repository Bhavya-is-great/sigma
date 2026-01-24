// The Dom elements goes here
let canvas = document.getElementById("canvas");
let addRectangleBtn = document.getElementById("addRectangle");
let addTextbox = document.getElementById("addTextbox");
let getHtmlbtn = document.getElementById("getHtml");
let getJSONbtn = document.getElementById("getJSON");
let panel = document.getElementById("panel");
let editPanel = document.getElementById("edit");

// The array show the elememts
let elements = [];

// Slection
let selected = null;
let idCounter = 0;
let mode = null;
let isPointerActive = false;

// POinter to detect long press in mobile
const isMobile = window.matchMedia("(pointer: coarse)").matches;

// Come Event listeners Lie here
addRectangleBtn.addEventListener("click", addRectangle);
addTextbox.addEventListener("click", addTextBox);
getHtmlbtn.addEventListener("click", exportHtml);
getJSONbtn.addEventListener("click", exportJSON);
document.addEventListener("click", selectItem);
document.addEventListener("pointerdown", (e) => {
    isPointerActive = true;
    interact(e);
});
document.addEventListener("pointerup", (e) => {
    isPointerActive = false;
    interactEnd(e);
});
document.addEventListener("pointermove", changeDom);
window.addEventListener("keydown", alterDom)

// DOM Positions
let canvasDistance = canvas.getBoundingClientRect();

// Some values for drag 
let startX, startY, mouseX, mouseY;

// Some values for resize
let restartX, restartY, Retop, ReLeft, reMouseX, reMouseY, reWidth, reHeight, reSetX, reSetY;

// Some values for Rotate
let centerX, centerY, elementBoundaries, mouseAngle;

// Counstructors lie Below 
class rectangle {
    constructor() {

        // Creating a div
        this.name = `rectangle ${elements.length}`
        this.type = "rectangle";
        this.x = 0;
        this.y = 0;
        this.width = "200px";
        this.height = "60px";
        this.classes = ["rectangle", "select"];
        this.Bgcolor = rgbaToHex(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
        this.borderRadius = "2px";
        this.rotationDeg = "0deg";
        this.id = `${idCounter++}`;
        this.element = document.createElement('div');
        this.element.classList.add(...this.classes);
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.rotationDeg}rad)`;
        this.element.id = this.id;
        this.element.style.background = this.Bgcolor;
        this.element.style.zIndex = elements.length;
        this.borderRadius = 0;
        this.element.style.borderRadius = `${this.borderRadius}%`
        this.createEditButtons();
        // used debounce learnt in Adv js - (harsh bhaiya)
        this.debouncedUpdateWidth = debounce(this.updateWidth.bind(this), 500);
        this.debouncedUpdateHeight = debounce(this.updateHeight.bind(this), 500);
        this.debouncedUpdateRadius = debounce(this.updateRadius.bind(this), 500);
    }

    addElement() {
        canvas.appendChild(this.element);
    }

    select() {
        this.element.style.border = "3px dashed rgb(9, 7, 139)";
        this.topRightBox = document.createElement('div');
        this.topLeftBox = document.createElement('div');
        this.bottomLeftBox = document.createElement('div');
        this.bottomRightBox = document.createElement('div');
        this.rotateBox = document.createElement('div');
        this.rotateImg = document.createElement('img');
        this.rotateImg.src = "./svgs/rotate.svg";
        this.rotateImg.classList.add("rotateImg");
        // this.rotateBox.appendChild(this.rotateImg);
        this.rotateBox.innerHTML = `
        <?xml version="1.0" encoding="utf-8"?>
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
        this.topRightBox.classList.add("topRightBox");
        this.topLeftBox.classList.add("topLeftBox");
        this.bottomLeftBox.classList.add("bottomLeftBox");
        this.bottomRightBox.classList.add("bottomRightBox");
        this.rotateBox.classList.add("rotate");
        this.element.append(this.topLeftBox);
        this.element.append(this.topRightBox);
        this.element.append(this.bottomLeftBox);
        this.element.append(this.bottomRightBox);
        this.element.append(this.rotateBox);
        this.addEditButtons();
        highlightLayer(this.id);
    }

    createEditButtons() {
        this.editDiv = document.createElement('div');
        this.editDiv.classList.add("editChild");

        this.bgChnageElement = document.createElement('input');
        this.bgChnageElement.type = "color";
        this.bgChnageElement.value = this.Bgcolor;

        this.widthElement = document.createElement('input');
        this.widthElement.type = "number"
        this.widthElement.placeholder = "Width";
        this.widthElement.value = parseInt(this.width);

        this.heightElement = document.createElement('input');
        this.heightElement.type = "number"
        this.heightElement.placeholder = "Height";
        this.heightElement.value = parseInt(this.height);

        this.radiusElement = document.createElement('input');
        this.radiusElement.type = "number";
        this.radiusElement.placeholder = "Radius (%)";
        this.radiusElement.value = parseInt(this.borderRadius);

        this.editDiv.appendChild(this.radiusElement);
        this.editDiv.appendChild(this.bgChnageElement);
        this.editDiv.appendChild(this.widthElement);
        this.editDiv.appendChild(this.heightElement);
        this.addEvents();
    }

    updateInputs() {
        this.bgChnageElement.value = this.Bgcolor;
        this.radiusElement.value = parseInt(this.borderRadius);
        this.widthElement.value = parseInt(this.width);
        this.heightElement.value = parseInt(this.height);
    }

    addEditButtons() {
        editPanel.appendChild(this.editDiv);
    }

    unselect() {
        this.element.style.border = "none";
        this.topLeftBox.remove();
        this.topRightBox.remove();
        this.bottomLeftBox.remove();
        this.bottomRightBox.remove();
        this.rotateBox.remove();
        this.removeEditButtons();
        unhighlight(this.id);
    }

    removeEditButtons() {
        this.editDiv.remove();
    }

    addEvents() {
        // Event listners - class ref - event handlers (sarthak Bhaiya)
        this.bgChnageElement.addEventListener("input", (e) => {
            this.Bgcolor = e.target.value;
            this.element.style.background = e.target.value;
            save();
        });

        this.widthElement.addEventListener("input", (e) => {
            this.debouncedUpdateWidth(e)
        })

        this.heightElement.addEventListener("input", (e) => {
            this.debouncedUpdateHeight(e)
        })

        this.radiusElement.addEventListener("input", (e) => {
            this.debouncedUpdateRadius(e);
        });

    }

    updateRadius(e) {
        let value = Number(e.target.value);
        const MIN_RADIUS = 0;
        const MAX_RADIUS = 50;
        value = Math.max(MIN_RADIUS, Math.min(value, MAX_RADIUS));
        e.target.value = value;
        this.borderRadius = value;
        this.element.style.borderRadius = `${value}%`;
        save();
    }

    // Debounce system with overflow prevention - classes ref Advance js(Harsh Bhaiya) - Dom manipulation (sarthak Bhaiya) - Math modeule (DSA by ali Bhaiya)
    updateWidth(e) {
        let value = Number(e.target.value);
        const MIN_WIDTH = 40;
        const maxWidth =
            canvas.clientWidth - this.element.offsetLeft;
        value = Math.max(MIN_WIDTH, Math.min(value, maxWidth));
        e.target.value = value;
        this.width = `${value}px`;
        this.element.style.width = this.width;
        save()
    }

    // Debounce system with overflow prevention - classes ref Advance js(Harsh Bhaiya) - Dom manipulation (sarthak Bhaiya) - Math modeule (DSA by ali Bhaiya)
    updateHeight(e) {
        let value = Number(e.target.value);
        const MIN_HEIGHT = 40;
        const maxHeight =
            canvas.clientHeight - this.element.offsetTop;
        value = Math.max(MIN_HEIGHT, Math.min(value, maxHeight));
        e.target.value = value;
        this.height = `${value}px`;
        this.element.style.height = this.height;
        save()
    }

    move(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    endMove(x, y) {
        this.x = x;
        this.y = y;
        save();
    }

    resize(x, y) {
        this.widthElement.value = x;
        this.heightElement.value = y;
        this.width = `${x}px`;
        this.height = `${y}px`;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        save();
    }

    rotate(radDeg) {
        this.rotationDeg = radDeg;
        this.element.style.transform = `rotate(${this.rotationDeg}rad)`;
        save();
    }

    // Direct Class saving not worked so did this Jugad to store - reference - Stack overflow
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            classes: this.classes,
            Bgcolor: this.Bgcolor,
            borderRadius: this.borderRadius,
            rotationDeg: this.rotationDeg,
            zIndex: this.element.style.zIndex
        };
    }



}

class textBox {
    constructor() {

        // Creating a div
        this.name = `textBox ${elements.length}`
        this.type = "textBox";
        this.x = 0;
        this.y = 0;
        this.width = "200px";
        this.height = "60px";
        this.classes = ["textBox", "select"];
        this.Bgcolor = rgbaToHex(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
        this.borderRadius = "2px";
        this.rotationDeg = "0deg";
        this.id = `${idCounter++}`;
        this.element = document.createElement('div');
        this.element.classList.add(...this.classes);
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.left = `${this.x}`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.rotationDeg}rad)`;
        this.element.id = this.id;
        this.element.style.background = this.Bgcolor;
        this.element.style.zIndex = elements.length;
        this.value = "";
        this.Retype();
        this.focus = 0;
        this.borderRadius = 0;
        this.element.style.borderRadius = `${this.borderRadius}%`
        this.makeInput();
        this.createEditButtons();
        // used debouncing learn in Adv js - (hasrsh bhaiya)
        this.debouncedUpdateWidth = debounce(this.updateWidth.bind(this), 500);
        this.debouncedUpdateHeight = debounce(this.updateHeight.bind(this), 500);
        this.debouncedUpdateRadius = debounce(this.updateRadius.bind(this), 500);
    }

    addElement() {
        canvas.appendChild(this.element);
    }

    // Debounce system with overflow prevention - classes ref Advance js(Harsh Bhaiya) - Dom manipulation (sarthak Bhaiya) - Math modeule (DSA by ali Bhaiya)
    updateWidth(e) {
        let value = Number(e.target.value);
        const MIN_WIDTH = 40;
        const maxWidth =
            canvas.clientWidth - this.element.offsetLeft;
        value = Math.max(MIN_WIDTH, Math.min(value, maxWidth));
        e.target.value = value;
        this.width = `${value}px`;
        this.element.style.width = this.width;
        save();
    }

    // Debounce system with overflow prevention - classes ref Advance js(Harsh Bhaiya) - Dom manipulation (sarthak Bhaiya) - Math modeule (DSA by ali Bhaiya)
    updateHeight(e) {
        let value = Number(e.target.value);
        const MIN_HEIGHT = 40;
        const maxHeight =
            canvas.clientHeight - this.element.offsetTop;
        value = Math.max(MIN_HEIGHT, Math.min(value, maxHeight));
        e.target.value = value;
        this.height = `${value}px`;
        this.element.style.height = this.height;
        save();
    }

    makeInput() {
        this.inputDiv = document.createElement('input');
        this.inputDiv.type = "text";
        this.inputDiv.classList.add("inputBox");
        this.inputDiv.id = `textBox${elements.length}Input`;
        this.inputDiv.value = this.value;
        this.addEvent();
    }

    takeInput() {
        this.element.appendChild(this.inputDiv);
    }

    focusELe() {
        this.inputDiv.focus();
    }

    addEvent() {
        this.inputDiv.addEventListener("keypress", (e) => {
            if (e.key == "Enter") {
                this.value = this.inputDiv.value.trim();
                this.inputDiv.remove();
                this.setText();
            }
        });
        document.addEventListener('click', () => {
            if (document.activeElement.id == this.inputDiv.id) {
                this.focus = 1;
            } else {
                if (this.inputDiv.isConnected) {
                    this.value = this.inputDiv.value.trim();
                    this.inputDiv.remove();
                    this.setText()
                    this.focus = 0;
                }
            }
        });
    }

    updateRadius(e) {
        let value = Number(e.target.value);
        const MIN_RADIUS = 0;
        const MAX_RADIUS = 50;
        value = Math.max(MIN_RADIUS, Math.min(value, MAX_RADIUS));
        e.target.value = value;
        this.borderRadius = value;
        this.element.style.borderRadius = `${this.borderRadius}%`;
        save();
    }

    updateInputs() {
        this.bgChnageElement.value = this.Bgcolor;
        this.radiusElement.value = this.borderRadius;
        this.widthElement.value = parseInt(this.width);
        this.heightElement.value = parseInt(this.height);
    }

    addEditButtons() {
        editPanel.appendChild(this.editDiv);
    }

    setText() {
        this.textTag = document.createElement('p');
        this.textTag.innerText = this.value;
        this.element.appendChild(this.textTag);
        save();
    }

    LoadsetText(val) {
        this.textTag = document.createElement('p');
        this.value = val;
        this.textTag.innerText = val;
        this.element.appendChild(this.textTag);
    }

    createEditButtons() {
        this.editDiv = document.createElement('div');
        this.editDiv.classList.add("editChild");

        this.bgChnageElement = document.createElement('input');
        this.bgChnageElement.type = "color";
        this.bgChnageElement.value = this.Bgcolor;

        this.widthElement = document.createElement('input');
        this.widthElement.type = "number"
        this.widthElement.placeholder = "Width";
        this.widthElement.value = parseInt(this.width);

        this.heightElement = document.createElement('input');
        this.heightElement.type = "number"
        this.heightElement.placeholder = "Height";
        this.heightElement.value = parseInt(this.height);

        this.message = document.createElement('p');
        this.message.innerText = "Double Click the textbox to Chnage text!";

        this.radiusElement = document.createElement('input');
        this.radiusElement.type = "number";
        this.radiusElement.placeholder = "Radius (%)";
        this.radiusElement.value = parseInt(this.borderRadius);

        this.editDiv.appendChild(this.radiusElement);
        this.editDiv.appendChild(this.bgChnageElement);
        this.editDiv.appendChild(this.widthElement);
        this.editDiv.appendChild(this.heightElement);
        this.editDiv.appendChild(this.message);
        this.addEvents();
    }

    Retype() {

        //As dblClick not worked on mobile so 2 logics are added one for mobile and another for the desktop where the Desktop have dblclick and mobile Long press

        this.element.addEventListener("dblclick", () => {
            if (isMobile) return;
            this.textTag.remove();
            this.inputDiv.value = this.value;
            this.element.appendChild(this.inputDiv);
            this.inputDiv.focus();
        });

        // Long Press code
        let pressTimer = null;

        this.element.addEventListener("pointerdown", (e) => {
            if (!isMobile) return;

            this.isDragging = false;
            this.startPressX = e.clientX;
            this.startPressY = e.clientY;

            this.pressTimer = setTimeout(() => {
                if (!this.isDragging) {
                    this.textTag.remove();
                    this.inputDiv.value = this.value;
                    this.element.appendChild(this.inputDiv);
                    this.inputDiv.focus();
                }
            }, 1000);
        });

        this.element.addEventListener("pointerup", () => {
            clearTimeout(pressTimer);
        });

        this.element.addEventListener("pointerleave", () => {
            clearTimeout(pressTimer);
        });

        // The long press logic is something related to debounce i had made it like press and hold if the timeout complete you will be allowed to edit 
    }

    select() {
        this.element.style.border = "3px dashed rgb(9, 7, 139)";
        this.topRightBox = document.createElement('div');
        this.topLeftBox = document.createElement('div');
        this.bottomLeftBox = document.createElement('div');
        this.bottomRightBox = document.createElement('div');
        this.rotateBox = document.createElement('div');
        this.rotateImg = document.createElement('img');
        this.rotateImg.src = "./svgs/rotate.svg";
        this.rotateImg.classList.add("rotateImg");
        // this.rotateBox.appendChild(this.rotateImg);
        this.rotateBox.innerHTML = `
        <?xml version="1.0" encoding="utf-8"?>
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
        this.topRightBox.classList.add("topRightBox");
        this.topLeftBox.classList.add("topLeftBox");
        this.bottomLeftBox.classList.add("bottomLeftBox");
        this.bottomRightBox.classList.add("bottomRightBox");
        this.rotateBox.classList.add("rotate");
        this.element.append(this.topLeftBox);
        this.element.append(this.topRightBox);
        this.element.append(this.bottomLeftBox);
        this.element.append(this.bottomRightBox);
        this.element.append(this.rotateBox);
        this.addEditButtons();
        highlightLayer(this.id);
    }

    unselect() {
        this.element.style.border = "none";
        this.topLeftBox.remove();
        this.topRightBox.remove();
        this.bottomLeftBox.remove();
        this.bottomRightBox.remove();
        this.rotateBox.remove();
        this.removeEditButtons();
        unhighlight(this.id);
    }

    removeEditButtons() {
        this.editDiv.remove();
    }

    addEvents() {
        // Event listners - class ref - event handlers (sarthak Bhaiya)
        this.bgChnageElement.addEventListener("input", (e) => {
            this.Bgcolor = e.target.value;
            this.element.style.background = e.target.value;
            save();
        });

        this.widthElement.addEventListener("input", (e) => {
            this.debouncedUpdateWidth(e)
        });

        this.heightElement.addEventListener("input", (e) => {
            this.debouncedUpdateHeight(e)
        });

        this.radiusElement.addEventListener("input", (e) => {
            this.debouncedUpdateRadius(e);
        });

    }

    move(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    endMove(x, y) {
        this.x = x;
        this.y = y;
        save();
    }

    resize(x, y) {
        this.widthElement.value = x;
        this.heightElement.value = y;
        this.width = `${x}px`;
        this.height = `${y}px`;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        save();
    }

    rotate(radDeg) {
        this.rotationDeg = radDeg;
        this.element.style.transform = `rotate(${this.rotationDeg}rad)`;
        save();
    }

    // Direct Class saving not worked so did this Jugad to store - ref (stack Overfloe)
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            classes: this.classes,
            Bgcolor: this.Bgcolor,
            borderRadius: this.borderRadius,
            rotationDeg: this.rotationDeg,
            value: this.value,
            zIndex: this.element.style.zIndex
        };
    }

}

// loading everything if exits
load();

// Functions lie Below
function makePanelElement(ele) {
    // created the main layer
    const newEle = document.createElement('div');
    newEle.classList.add('layer');
    newEle.id = `${ele.id}layer`;

    // Applied the name of the layer
    const name = document.createElement('span');
    name.innerText = ele.name;
    name.classList.add("name");

    // made a div to contain buttons
    const arrowButtons = document.createElement('div');
    arrowButtons.classList.add("arrowBtn");

    // made a up button
    const upButton = document.createElement('button');
    upButton.classList.add('upBtn');
    upButton.disabled = true;

    //add a image to it 
    const upImg = document.createElement('img');
    upImg.src = "./svgs/arrowup.svg";
    upImg.classList.add('upImg');

    // made a down button
    const downButton = document.createElement('button');
    downButton.classList.add('downBtn');
    downButton.disabled = true;

    //added and styled the image to it
    const downImg = document.createElement('img');
    downImg.src = "./svgs/arrowup.svg";
    downImg.classList.add('downImg');
    downImg.style.transform = "rotate(180deg)";


    //combinig and appending
    newEle.appendChild(name);
    upButton.appendChild(upImg);
    arrowButtons.appendChild(upButton)
    downButton.appendChild(downImg);
    arrowButtons.appendChild(downButton);
    newEle.appendChild(arrowButtons);

    //adding eventListeners 
    newEle.addEventListener('click', panelSelection);

    upButton.addEventListener('click', () => {
        moveLayerUp(newEle.id);
    });
    downButton.addEventListener('click', () => {
        moveLayerDown(newEle.id)
    });

    return newEle;
}

function moveLayerUp(id) {
    const index = elements.findIndex(el => el.id === id.replace("layer", ""));
    if (index <= 0) return;

    const selectedId = selected ? selected.id : null;

    [elements[index], elements[index - 1]] =
        [elements[index - 1], elements[index]];

    reindexElements();
    updateElements();

    restoreSelectionById(selectedId);
}


function moveLayerDown(id) {
    const index = elements.findIndex(el => el.id === id.replace("layer", ""));
    if (index >= elements.length - 1) return;

    const selectedId = selected ? selected.id : null;

    [elements[index], elements[index + 1]] =
        [elements[index + 1], elements[index]];

    reindexElements();
    updateElements();

    restoreSelectionById(selectedId);
}


function addRectangle() {
    const newRectangle = new rectangle();
    newRectangle.addElement();
    elements.unshift(newRectangle);
    updateElements();
}

function addTextBox() {
    const newTextBox = new textBox();
    newTextBox.takeInput();
    newTextBox.addElement();
    elements.unshift(newTextBox);
    updateElements();
    newTextBox.focusELe();
}

function updateElements() {
    save();
    panel.innerHTML = "";
    elements.forEach(ele => {
        panel.appendChild(makePanelElement(ele))
    });
}

function selectItem(e) {

    if ((e.target.closest("#edit")) || (e.target.classList.contains("upBtn")) || (e.target.classList.contains("downBtn")) || (e.target.classList.contains("upImg")) || (e.target.classList.contains("downImg"))) {
        return;
    }

    if (e.target.closest(".select")) {
        if (!(e.target.classList.contains("topLeftBox")) && !(e.target.classList.contains("topRightBox")) && !(e.target.classList.contains("bottomLeftBox")) && !(e.target.classList.contains("bottomRightBox")) && !(e.target.closest(".rotate")) && !(e.target.classList.contains("rotateImg"))) {
            if (selected != null) {
                if (selected.element.id == e.target.id) {
                } else {
                    selected = selected = elements.find(el => el.id === e.target.id);
                    selected.select();
                }
            } else {
                selected = elements[parseInt(e.target.id)];
                selected.select();
            }
        }
    } else if (e.target.classList.contains("topLeftBox")) {
    } else {
        if (selected != null) {
            selected.unselect();
        }
        selected = null;
    }
}

function panelSelection(e) {
    e.stopPropagation();
    if (selected == null) {
        const id = e.target.closest(".layer").id.replace("layer", "");
        selected = elements.find(el => el.id === id);

        selected.select();
    } else {
        if (e.target.id == selected.element.id) {
            // selected.unselect();
            // selected = null;
        } else {
            selected.unselect();
            const id = e.target.closest(".layer").id.replace("layer", "");
            selected = elements.find(el => el.id === id);
            selected.select();
        }
    }
}

function highlightLayer(id) {
    let ele = document.getElementById(`${id}layer`);
    ele.classList.add("selected");
    ele.children[1].children[0].disabled = false;
    ele.children[1].children[1].disabled = false;
}

function unhighlight(id) {
    let ele = document.getElementById(`${id}layer`);
    ele.classList.remove("selected")
    ele.children[1].children[0].disabled = true;
    ele.children[1].children[1].disabled = true;
}

function interact(e) {

    // The God Stack overflow Even AI is noob and was not able me to help with this project
    if (e.target.releasePointerCapture) {
        e.target.setPointerCapture(e.pointerId);
    }

    if (e.target.classList.contains("select")) {
        mode = "drag";
        if (selected != null) {
            selected.unselect();
        }
        selected = elements.find(el => el.id === e.target.id);
        selected.select();
        startX = selected.x;
        startY = selected.y;
        mouseX = e.clientX - canvasDistance.left;
        mouseY = e.clientY - canvasDistance.top;
        selected.element.style.cursor = "grabbing";
    } else if (e.target.classList.contains("topLeftBox")) {
        mode = "resize";
        Retop = true;
        ReLeft = true;
        restartX = selected.x;
        restartY = selected.y;
        reMouseX = e.clientX - canvasDistance.left;
        reMouseY = e.clientY - canvasDistance.top;
        reWidth = parseInt(selected.element.style.width);
        reHeight = parseInt(selected.element.style.height);
    } else if (e.target.classList.contains("topRightBox")) {
        mode = "resize";
        Retop = true;
        ReLeft = false;
        restartX = selected.x;
        restartY = selected.y;
        reMouseX = e.clientX - canvasDistance.left;
        reMouseY = e.clientY - canvasDistance.top;
        reWidth = parseInt(selected.element.style.width);
        reHeight = parseInt(selected.element.style.height);
    } else if (e.target.classList.contains("bottomLeftBox")) {
        mode = "resize";
        Retop = false;
        ReLeft = true;
        restartX = selected.x;
        restartY = selected.y;
        reMouseX = e.clientX - canvasDistance.left;
        reMouseY = e.clientY - canvasDistance.top;
        reWidth = parseInt(selected.element.style.width);
        reHeight = parseInt(selected.element.style.height);
    } else if (e.target.classList.contains("bottomRightBox")) {
        mode = "resize";
        Retop = false;
        ReLeft = false;
        restartX = selected.x;
        restartY = selected.y;
        reMouseX = e.clientX - canvasDistance.left;
        reMouseY = e.clientY - canvasDistance.top;
        reWidth = parseInt(selected.element.style.width);
        reHeight = parseInt(selected.element.style.height);
    } else if (e.target.closest('.rotate')) {
        mode = "rotate";
        elementBoundaries = selected.element.getBoundingClientRect();
        centerX = elementBoundaries.left + elementBoundaries.width / 2;
        centerY = elementBoundaries.top + elementBoundaries.height / 2;
        mouseAngle = Math.atan2(e.clientX - centerX, e.clientY - centerY);
        e.target.style.cursor = "grabbing";
    }
}

function interactEnd(e) {

    if (e.target.releasePointerCapture) {
        e.target.releasePointerCapture(e.pointerId);
    }

    e.stopPropagation();

    if (mode == "drag") {
        startX = parseInt(selected.element.style.left);
        startY = parseInt(selected.element.style.top);
        selected.endMove(startX, startY);
        selected.element.style.cursor = "grab";

        // As the mousedown and mouseup count as a click so on drag end the element was in select state only so 200 ms to unset it 
        // setTimeout(() => {
        //     selected.unselect();
        //     selected = null;
        // }, 200);
    } else if (mode == "resize") {
        if (ReLeft && Retop) {
            restartX = parseInt(selected.element.style.left);
            restartY = parseInt(selected.element.style.top);
            selected.endMove(restartX, restartY);
        } else if (Retop && !ReLeft) {
            restartX = parseInt(selected.element.style.left);
            restartY = parseInt(selected.element.style.top);
            selected.endMove(restartX, restartY);
        } else if (!Retop && ReLeft) {
            restartX = parseInt(selected.element.style.left);
            restartY = parseInt(selected.element.style.top);
            selected.endMove(restartX, restartY);
        }
    }

    mode = null;
}

function changeDom(e) {
    console.log(e)
    if (selected != null) {
        if (mode == "drag") {
            let CurrentMouseX = e.clientX - canvasDistance.left;
            let CurrentMouseY = e.clientY - canvasDistance.top;

            selected.move(startX + (CurrentMouseX - mouseX), startY + (CurrentMouseY - mouseY));

            let r = selected.element.getBoundingClientRect();
            let x = startX + (CurrentMouseX - mouseX);
            let y = startY + (CurrentMouseY - mouseY);

            const w = selected.element.offsetWidth;
            const h = selected.element.offsetHeight;
            const cx = x + w / 2;
            const cy = y + h / 2;
            const clampedCx = Math.max(w / 2, Math.min(cx, canvas.clientWidth - w / 2));
            const clampedCy = Math.max(h / 2, Math.min(cy, canvas.clientHeight - h / 2));
            x = clampedCx - w / 2;
            y = clampedCy - h / 2;

            selected.move(x, y);

        }

        if (mode == "resize") {
            if (Retop && ReLeft) {
                let CurrentMouseX = e.clientX - canvasDistance.left;
                let CurrentMouseY = e.clientY - canvasDistance.top;

                if (reWidth + (reMouseX - CurrentMouseX) == 40) {
                    reSetX = restartX + (CurrentMouseX - reMouseX);
                }

                if ((reHeight + (reMouseY - CurrentMouseY)) == 40) {
                    reSetY = restartY + (CurrentMouseY - reMouseY)
                }

                selected.resize(Math.max(40, reWidth + (reMouseX - CurrentMouseX)), Math.max(40, reHeight + (reMouseY - CurrentMouseY)));

                if ((reWidth + (reMouseX - CurrentMouseX)) < 40 && (reHeight + (reMouseY - CurrentMouseY)) < 40) {
                    selected.move(reSetX, reSetY);
                } else if ((reWidth + (reMouseX - CurrentMouseX)) < 40) {
                    selected.move(reSetX, restartY + (CurrentMouseY - reMouseY));
                } else if ((reHeight + (reMouseY - CurrentMouseY)) < 40) {
                    selected.move(restartX + (CurrentMouseX - reMouseX), reSetY);
                } else {
                    selected.move(restartX + (CurrentMouseX - reMouseX), restartY + (CurrentMouseY - reMouseY));
                }
            } else if (Retop && !ReLeft) {
                let CurrentMouseX = e.clientX - canvasDistance.left;
                let CurrentMouseY = e.clientY - canvasDistance.top;

                selected.resize(Math.max(40, reWidth + (CurrentMouseX - reMouseX)), Math.max(40, reHeight + (reMouseY - CurrentMouseY)));
                if ((reHeight + (reMouseY - CurrentMouseY)) > 40) {
                    selected.move(restartX, restartY + (CurrentMouseY - reMouseY));
                }
            } else if (!Retop && ReLeft) {
                let CurrentMouseX = e.clientX - canvasDistance.left;
                let CurrentMouseY = e.clientY - canvasDistance.top;

                selected.resize(Math.max(40, reWidth + (reMouseX - CurrentMouseX)), Math.max(40, reHeight + (CurrentMouseY - reMouseY)));
                if ((reWidth + (reMouseX - CurrentMouseX)) > 40) {
                    selected.move(restartX + (CurrentMouseX - reMouseX), restartY);
                }
            } else if (!Retop && !ReLeft) {
                let CurrentMouseX = e.clientX - canvasDistance.left;
                let CurrentMouseY = e.clientY - canvasDistance.top;

                selected.resize(Math.max(40, reWidth + (CurrentMouseX - reMouseX)), Math.max(40, reHeight + (CurrentMouseY - reMouseY)));
            }
        }

        if (mode == "rotate") {
            let radDeg = Math.atan2(e.clientX - centerX, e.clientY - centerY);
            selected.rotate(mouseAngle - radDeg)
        }
    }
}

function alterDom(e) {
    if (!selected) return;

    // ignore typing inside inputs
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key == "Delete") {
        selected.unselect();
        selected.element.remove();

        const index = elements.indexOf(selected);
        if (index > -1) elements.splice(index, 1);

        selected = null;
        reindexElements();
        updateElements();
        return;
    }

    const STEP = e.shiftKey ? 20 : 5;

    let dx = 0;
    let dy = 0;

    // USed switch because it uses hashing - website phele see slow h socha thodi fast hoo jayegi
    switch (e.key) {
        case "ArrowLeft":
            dx = -STEP;
            break;
        case "ArrowRight":
            dx = STEP;
            break;
        case "ArrowUp":
            dy = -STEP;
            break;
        case "ArrowDown":
            dy = STEP;
            break;
        default:
            return;
    }

    e.preventDefault();

    let x = selected.x + dx;
    let y = selected.y + dy;

    const w = selected.element.offsetWidth;
    const h = selected.element.offsetHeight;

    const cx = x + w / 2;
    const cy = y + h / 2;

    const clampedCx = Math.max(w / 2, Math.min(cx, canvas.clientWidth - w / 2));
    const clampedCy = Math.max(h / 2, Math.min(cy, canvas.clientHeight - h / 2));

    const finalX = clampedCx - w / 2;
    const finalY = clampedCy - h / 2;

    selected.move(finalX, finalY);
    selected.endMove(finalX, finalY);
}



function reindexElements() {
    const maxZ = elements.length - 1;

    elements.forEach((el, index) => {
        el.element.style.zIndex = maxZ - index;
    });
}


function restoreSelectionById(oldId) {
    if (oldId === null) return;

    // clear old visual selection
    if (selected) {
        selected.unselect();
        selected = null;
    }

    const newSelected = elements.find(el => el.id === oldId);
    if (!newSelected) return;

    selected = newSelected;
    selected.select();
}

//taken from stack overflow
function rgbaToHex(rgba) {
    let nums = rgba.match(/\d+/g).map(Number);
    return "#" + nums.slice(0, 3).map(x => x.toString(16).padStart(2, "0")).join("");
}

function debounce(fn, delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// onetime time creation use again and again
function save() {
    localStorage.setItem("canvasData", JSON.stringify(elements));
}

function load() {
    const saved = localStorage.getItem("canvasData");
    if (!saved) return;

    const data = JSON.parse(saved);

    elements = [];
    canvas.innerHTML = "";
    panel.innerHTML = "";
    selected = null;

    data.forEach(item => {
        let obj;

        if (item.type === "rectangle") {
            obj = new rectangle();
        }
        else if (item.type === "textBox") {
            obj = new textBox();
        }
        else {
            return;
        }
        obj.name = item.name;
        obj.id = item.id;
        obj.x = item.x;
        obj.y = item.y;
        obj.width = item.width;
        obj.height = item.height;
        obj.classes = item.classes;
        obj.Bgcolor = item.Bgcolor;
        obj.borderRadius = item.borderRadius;
        obj.rotationDeg = item.rotationDeg;
        obj.element.id = obj.id;
        obj.element.className = "";
        obj.element.classList.add(...obj.classes);
        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
        obj.element.style.width = obj.width;
        obj.element.style.height = obj.height;
        obj.element.style.background = obj.Bgcolor;
        obj.element.style.borderRadius = `${obj.borderRadius}%`;
        obj.element.style.transform = `rotate(${obj.rotationDeg}rad)`;
        obj.element.style.zIndex = item.zIndex;
        obj.updateInputs();
        if (obj.type === "textBox") {
            obj.textTag = document.createElement('p');
            obj.value = item.value || "";
            obj.LoadsetText(item.value);
        }

        obj.addElement();
        elements.push(obj);
    });
    panel.innerHTML = "";
    elements.forEach(ele => {
        const layer = makePanelElement(ele);
        panel.appendChild(layer);
    });
}


// Export logics totally refered from Stack overflow as they were totally new
function exportJSON() {
    const data = JSON.stringify(elements, null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-data.json";
    a.click();

    URL.revokeObjectURL(url);
}

function exportHtml() {
    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Exported Canvas</title>
<style>
    body {
        margin: 0;
        padding: 0;
    }
    .canvas {
        position: relative;
        width: ${canvas.clientWidth}px;
        height: ${canvas.clientHeight}px;
        background: #eee;
        overflow: hidden;
    }
    .canvas div {
        position: absolute;
        box-sizing: border-box;
    }
</style>
</head>
<body>
<div class="canvas">
`;

    elements.forEach(el => {
        const style = `
left:${el.x}px;
top:${el.y}px;
width:${el.width};
height:${el.height};
background:${el.Bgcolor};
border-radius:${el.borderRadius}%;
transform:rotate(${el.rotationDeg}rad);
z-index:${el.element.style.zIndex};
`;

        if (el.type === "rectangle") {
            html += `<div style="${style}"></div>\n`;
        }

        if (el.type === "textBox") {
            html += `
<div style="${style}">
    <p>${el.value || ""}</p>
</div>\n`;
        }
    });

    html += `
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.html";
    a.click();

    URL.revokeObjectURL(url);
}
