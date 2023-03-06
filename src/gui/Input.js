import Gui from "./Gui.js";
import { mergeObject } from "./utility.js";



export default class Input extends Gui {

    constructor() {
        super()
        this.type = "text"

    }
    createHTMLElement() {
        this.container = document.createElement("input")
        this.container.type = this.type
        this.container.innerHTML = ""
    }

    setType(type) {
        this.type = type
        if (this.isBuilt) {
            this.container.type = this.type
        }
        return this
    }
    onchange(evt) {
        this.dispatchEvent("change", evt)
    }
    addListeners() {
        super.addListeners()
        this.container.addEventListener("change", (evt) => { this.onchange(evt) })

    }

    getFile() {
        if (this.isBuilt)
            if (this.type == "file") {
                return this.container.files[0]
            }
        return false
    }



}