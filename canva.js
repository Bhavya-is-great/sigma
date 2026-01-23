// The Dom elements goes here
let canvas = document.getElementById("canvas");
let addRectangleBtn = document.getElementById("addRectangle");
let addTextbox = document.getElementById("addTextbox");
let getImagebtn = document.getElementById("getImage");
let panel = document.getElementById("panel");

// The array show the elememts
let elements = [];

// Slection
let selected = null;
let active = null;
let mode = null;

// Come Event listeners Lie here
addRectangleBtn.addEventListener("click", addRectangle);
addTextbox.addEventListener("click", addTextBox);
getImagebtn.addEventListener("click", () => { });
document.addEventListener("click", selectItem);
document.addEventListener("mousedown", interact);
document.addEventListener("mouseup", interactEnd);
document.addEventListener("mousemove", changeDom);

// DOM Positions
let canvasDistance = canvas.getBoundingClientRect();

// Some values for drag 
let startX, startY, mouseX, mouseY;

// Some values for resize
let restartX, restartY, Retop, ReLeft, reMouseX, reMouseY, reWidth, reHeight, reSetX, reSetY;

// Some values for Rotate
let centerX, centerY;

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
        this.Bgcolor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.borderRadius = "2px";
        this.rotationDeg = "0deg";
        this.id = `${elements.length}`;
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
        this.rotateImg.src = ""
        this.topRightBox.classList.add("topRightBox");
        this.topLeftBox.classList.add("topLeftBox");
        this.bottomLeftBox.classList.add("bottomLeftBox");
        this.bottomRightBox.classList.add("bottomRightBox");
        this.roatateBox.classList.add("rotate");
        this.element.append(this.topLeftBox);
        this.element.append(this.topRightBox);
        this.element.append(this.bottomLeftBox);
        this.element.append(this.bottomRightBox);
        this.element.append(this.rotateBox);
    }
    
    unselect() {
        this.element.style.border = "none";
        this.topLeftBox.remove();
        this.topRightBox.remove();
        this.bottomLeftBox.remove();
        this.bottomRightBox.remove();
        this.rotateBox.remove();
    }

    move(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    endMove(x, y) {
        this.x = x;
        this.y = y;
    }
    
    resize(x, y) {
        this.width = `${x}px`;
        this.height = `${y}px`;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
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
        this.Bgcolor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.borderRadius = "2px";
        this.rotationDeg = "0deg";
        this.id = `${elements.length}`;
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
    }

    addElement() {
        canvas.appendChild(this.element);
    }

    takeInput() {
        this.inputDiv = document.createElement('input');
        this.inputDiv.type = "text";
        this.inputDiv.classList.add("inputBox");
        this.inputDiv.id = `textBox ${elements.length}Input`;
        this.element.appendChild(this.inputDiv);
        this.addEvent();
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

    setText() {
        this.textTag = document.createElement('p');
        this.textTag.innerText = this.value;
        this.element.appendChild(this.textTag)
    }

    Retype() {
        this.element.addEventListener("dblclick", () => {
            this.textTag.remove();
            this.element.appendChild(this.inputDiv);
            this.inputDiv.focus()
        });
    }

    select() {
        this.element.style.border = "3px dashed rgb(9, 7, 139)";
        this.topRightBox = document.createElement('div');
        this.topLeftBox = document.createElement('div');
        this.bottomLeftBox = document.createElement('div');
        this.bottomRightBox = document.createElement('div');
        this.rotateBox = document.createElement('div');
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
    }
    
    unselect() {
        this.element.style.border = "none";
        this.topLeftBox.remove();
        this.topRightBox.remove();
        this.bottomLeftBox.remove();
        this.bottomRightBox.remove();
        this.rotateBox.remove();
    }
    
    move(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
    
    endMove(x, y) {
        this.x = x;
        this.y = y;
    }
    
    resize(x, y) {
        this.width = `${x}px`;
        this.height = `${y}px`;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
    }
}

// Functions lie Below
function makePanelElement(ele) {
    // created the main layer
    const newEle = document.createElement('div');
    newEle.classList.add('layer');
    newEle.id = ele.id;

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

    //add a image to it 
    const upImg = document.createElement('img');
    upImg.src = "./svgs/arrowup.svg";
    upImg.classList.add('upImg');

    // made a down button
    const downButton = document.createElement('button');
    downButton.classList.add('downBtn');

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

    return newEle;
}

function addRectangle() {
    const newRectangle = new rectangle();
    newRectangle.addElement();
    elements.push(newRectangle);
    updateElements();
}

function addTextBox() {
    const newTextBox = new textBox();
    newTextBox.takeInput();
    newTextBox.addElement();
    elements.push(newTextBox);
    updateElements();
    newTextBox.focusELe();
}

function updateElements() {
    panel.innerHTML = "";
    elements.forEach(ele => {
        panel.appendChild(makePanelElement(ele))
    });
}

function selectItem(e) {
    if (e.target.closest(".select")) {
        if (!(e.target.classList.contains("topLeftBox")) && !(e.target.classList.contains("topRightBox")) && !(e.target.classList.contains("bottomLeftBox")) && !(e.target.classList.contains("bottomRightBox"))) {
            if (selected != null) {
                if (selected.element.id == e.target.id) {
                    // selected.unselect();
                    // selected = null;
                } else {
                    selected = elements[parseInt(e.target.id)];
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
        selected = elements[parseInt(e.target.id)];
        selected.select();
    } else {
        if (e.target.id == selected.element.id) {
            // selected.unselect();
            // selected = null;
        } else {
            selected.unselect();
            selected = elements[parseInt(e.target.id)];
            selected.select();
        }
    }
}

function interact(e) {
    if (e.target.classList.contains("select")) {
        mode = "drag";
        if (selected != null) {
            selected.unselect();
        }
        selected = elements[e.target.id];
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
    } else if (e.target.classList.contains('rotate')) {
    }
}

function interactEnd(e) {

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
    if (selected != null) {
        if (mode == "drag") {
            let CurrentMouseX = e.clientX - canvasDistance.left;
            let CurrentMouseY = e.clientY - canvasDistance.top;

            selected.move(startX + (CurrentMouseX - mouseX), startY + (CurrentMouseY - mouseY));
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

        if(mode == "rotate") {
        }
    }
}