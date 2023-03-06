import Gui from "./Gui.js";

export class TextField extends Gui {

    createHTMLElement() {
        this.container = document.createElement("textarea")

    }

    addListeners() {
        super.addListeners()
        this.container.addEventListener("wheel", (evt) => { this.onmousewheel(evt) })

    }
    onmousewheel(evt) {
        if (evt.shiftKey) {
            evt.preventDefault();
            const FONT_CHANGE = 0.03
            let sign = evt.deltaY < 0 ? 1 : -1
            let font_size = Math.max(0.25, this.getFontSize() + (sign * FONT_CHANGE))
            this.setFontSize(font_size)
        }
    }
    loadText(text) {
        this.container.value = text
    }
    getText() {
        return this.container.value
    }

}