import { Vector } from "./math.js"
import { BackGround } from "./Background.js"
import Gui from "./Gui.js"
import { Label } from "./Label.js"


export class Button extends Gui {
    constructor() {
        super()

        this.text = ""
    }

    setText(text, fontSize = this.fontSize, color = "black", x = 0, y = 0) {
        if (!this.textLabel) {
            this.textLabel = new Label().setParentSize()
            this.addComponent(this.textLabel)

        }
        this.textLabel.setText(text).setColor(color).setFontSize(fontSize)
        if (this.textLabel.position.x != x || this.textLabel.position.y != y)
            this.textLabel.setPosition(x, y)
        return this
    }

    createHTMLElement() {
        this.container = document.createElement("button")
    }
    /**
        asymethric - defines if icon W == H, false for ==
     */
    setIcon(icon, x = 0.15, y = 0.15, width = -1, height = -1, asymethric = false) {

        {
            if (width == -1) {

                width = this.size.x - 2 * x

            }
            if (height == -1) {
                height = this.size.y - 2 * y
            }
            if (asymethric == false)
                if (height < width) {
                    width = height
                }
                else
                    height = width
        }
        let icon_component = new BackGround().setSize(width, height).setPosition(x, y).setName("icon").setBackGround(icon)
        this.addComponent(icon_component)
        return this

    }



}