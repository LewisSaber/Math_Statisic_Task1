import App from "./App.js"
import { loadUtility } from "./gui/Utility.js"

window.addEventListener("load", function () {
    loadUtility()
    window.app = new App()


})

