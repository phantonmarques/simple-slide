import debounce from "./debounce.js";

export class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide);
		this.wrapper = document.querySelector(wrapper);
		this.location = { finalPosition: 0, startX: 0, movement: 0, position: 0 };
		this.activeClass = "active";
		this.changeEvent = new Event("changeEvent");
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
		this.transition(false);
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

	changeOnEnd() {
		console.log("index", this.location.movement);
		if (this.location.movement > 120 && this.index.next !== undefined) {
			this.next();
		} else if (this.location.movement < -120 && this.index.prev !== undefined) {
			this.prev();
		} else {
			this.changePosition(this.index.active);
		}
	}

	position(element) {
		const margin = (this.wrapper.offsetWidth - element.offsetWidth) / 2;

		return -(element.offsetLeft - margin);
	}

	prev() {
		if (this.index.prev === undefined) return;

		this.changePosition(this.index.prev);
	}

	next() {
		if (this.index.next === undefined) return;

		this.changePosition(this.index.next);
	}

	updatePosition(index) {
		const last = this.slideList.length - 1;

		this.index = {
			prev: index > 0 ? index - 1 : undefined,
			active: index,
			next: index === last ? undefined : index + 1,
		};
	}

	changePosition(index) {
		const active = this.slideList[index];
		this.moveSlide(active.position);
		this.updatePosition(index);
		this.location.finalPosition = active.position;
		this.changeActiveClass();
		this.wrapper.dispatchEvent(this.changeEvent);
	}

	changeActiveClass() {
		this.slideList.forEach((item) =>
			item.element.classList.remove(this.activeClass),
		);

		this.slideList[this.index.active].element.classList.add(this.activeClass);
	}

	transition(active = true) {
		this.slide.style.transition = active ? "transform .3s" : "";
	}

	end(event) {
		const type = event.type === "mouseup" ? "mousemove" : "touchmove";
		this.wrapper.removeEventListener(type, this.move);
		this.location.finalPosition = this.location.position;
		this.transition();
		this.changeOnEnd();
	}

	resize() {
		setTimeout(() => {
			this.config();
			this.changePosition(this.index.active);
		}, 300);
	}

	addEvents() {
		this.wrapper.addEventListener("mousedown", this.start);
		this.wrapper.addEventListener("touchstart", this.start);
		this.wrapper.addEventListener("mouseup", this.end);
		this.wrapper.addEventListener("touchend", this.end);

		window.addEventListener("resize", this.resize);
	}

	config() {
		this.slideList = [...this.slide.children].map((element) => {
			return {
				position: this.position(element),
				element,
			};
		});
	}

	bindMethods() {
		this.start = this.start.bind(this);
		this.move = this.move.bind(this);
		this.end = this.end.bind(this);

		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);

		this.resize = debounce(this.resize.bind(this), 200);
	}

	init() {
		this.bindMethods();
		this.transition();
		this.addEvents();
		this.config();

		this.changePosition(this.slideList.length > 1 ? 1 : 0);

		return this;
	}
}

export class NavigableSlide extends Slide {
	createArrow() {
		const navigationControl = document.createElement("div");
		navigationControl.classList.add("slide-navigation");

		this.prevElement = document.createElement("button");
		this.prevElement.classList.add("prev");

		this.nextElement = document.createElement("button");
		this.nextElement.classList.add("next");

		navigationControl.append(this.prevElement);
		navigationControl.append(this.nextElement);

		this.wrapper.after(navigationControl);

		return navigationControl;
	}

	createPagination() {
		const pagination = document.createElement("ul");
		pagination.dataset.control = "slide";

		this.slideList.forEach((item, index) => {
			pagination.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
		});

		this.wrapper.appendChild(pagination);

		return pagination;
	}

	addControlEvent() {
		this.prevElement.addEventListener("click", this.prev);
		this.nextElement.addEventListener("click", this.next);
	}

	addPaginationEvent(item, index) {
		item.addEventListener("click", (event) => {
			event.preventDefault();

			this.changePosition(index);
			this.activePaginationItem();
		});

		this.wrapper.addEventListener("changeEvent", this.activePaginationItem);
	}

	activePaginationItem() {
		this.paginationList.forEach((item) =>
			item.classList.remove(this.activeClass),
		);

		this.paginationList[this.index.active].classList.add(this.activeClass);
	}

	activeArrow() {
		this.createArrow();
		this.addControlEvent();
	}

	activePagination(custom) {
		const control =
			custom !== undefined
				? document.querySelector(custom)
				: this.createPagination();

		if (control) {
			this.paginationList = [...control.children];
			this.activePaginationItem();
			this.paginationList.forEach(this.addPaginationEvent);
		}
	}

	bindMethods() {
		super.bindMethods();

		this.activePaginationItem = this.activePaginationItem.bind(this);
		this.addPaginationEvent = this.addPaginationEvent.bind(this);
	}
}
