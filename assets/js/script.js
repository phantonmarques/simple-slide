import { NavigableSlide } from "./modules/slide.js";

const slide = new NavigableSlide(".slide", ".wrapper");
slide.init();
slide.activeArrow();
slide.activePagination();
