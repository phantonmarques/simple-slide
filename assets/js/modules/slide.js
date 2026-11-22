export default class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide);
		this.wrapper = document.querySelector(wrapper);
		this.location = { finalPosition: 0, startX: 0, movement: 0, position: 0 };
	}

	start(event) {
		let type;

		switch (event.type) {
			case "mousedown":
				event.preventDefault();
				this.location.startX = event.clientX;
				type = "mousemove";
				break;
			case "touchstart":
				this.location.startX = event.changedTouches[0].clientX;
				type = "touchmove";
				break;
			default:
		}

		this.wrapper.addEventListener(type, this.move);
	}

	move(event) {
		const position =
			event.type === "mousemove"
				? event.clientX
				: event.changedTouches[0].clientX;

		const finalPosition = this.moveUpdate(position);
		this.moveSlide(finalPosition);
	}

	moveUpdate(locationX) {
		this.location.movement = (this.location.startX - locationX) * 1.6;
		return this.location.finalPosition - this.location.movement;
	}

	moveSlide(locationX) {
		this.location.position = locationX;
		this.slide.style.transform = `translate3d(${locationX}px, 0, 0)`;
	}

	moveEnd(event) {
		const type = event.type === "mouseup" ? "mousemove" : "touchmove";
		this.wrapper.removeEventListener(type, this.move);
		this.location.finalPosition = this.location.position;
	}

	addEvents() {
		this.wrapper.addEventListener("mousedown", this.start);
		this.wrapper.addEventListener("touchstart", this.start);
		this.wrapper.addEventListener("mouseup", this.moveEnd);
		this.wrapper.addEventListener("touchend", this.moveEnd);
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
