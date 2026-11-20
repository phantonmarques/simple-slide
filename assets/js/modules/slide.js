export default class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide);
		this.wrapper = document.querySelector(wrapper);
	}

	start(event) {
		event.preventDefault();

		this.wrapper.addEventListener("mousemove", this.move);
	}

	move(event) {}

	moveEnd(event) {
		this.wrapper.removeEventListener("mousemove", this.move);
	}

	addEvents() {
		this.wrapper.addEventListener("mousedown", this.start);
		this.wrapper.addEventListener("mouseup", this.moveEnd);
	}

	bindMethods() {
		this.start = this.start.bind(this);
		this.move = this.move.bind(this);
		this.moveEnd = this.moveEnd.bind(this);
	}

	init() {
		this.bindMethods();
		this.addEvents();

		return this;
	}
}
