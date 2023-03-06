import Gui from "./Gui.js"


export class Label extends Gui {
    constructor() {
        super()
        this.text = ""
        this.color = "black"
    }
    setColor(color) {
        this.color = color
        if (this.isBuilt)
            this.loadValues()
        return this
    }
    setText(text) {
        this.text = text
        if (this.isBuilt)
            this.loadValues()
        return this
    }
    centerText() {
        this.textCentered = true
        if (this.isBuilt) {
            this.container.style.textAlign = "center"
        }
        return this
    }
    createHTMLElement() {
        this.container = document.createElement("div")
        if (this.textCentered)
            this.container.style.textAlign = "center"
    }


    loadValues() {
        this.container.innerHTML = this.text
        this.container.style.color = this.color

    }

    build() {
        // this.setParentSize()
        super.build()
        this.loadValues()


        return this
    }
}
