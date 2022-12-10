const NEXTPAGESHOWUPDELAY = 300;
let nextPageDelay;
const testimonyAnimationDuration = 400;

const nextPageButton = document.getElementById("nextPageButton");
nextPageButton.style.opacity = 1;
nextPageButton.onclick = () => {
	window.scrollTo({
		left: 0,
		top: (Math.floor(window.scrollY / window.innerHeight) + 1) * window.innerHeight,
		behavior: "smooth",
	});
};

const featureTexts = document.querySelectorAll(".featureText");
featureTexts.forEach((element) => {
	element.addEventListener("visibilitychange", (e) => {
		console.log(e);
	});
});
const feature = document.getElementById("feature");
document.onscroll = () => {
	featureTexts.forEach((element) => {
		const elementRect = element.getBoundingClientRect();
		const percentage = clamp(
			(1 - (elementRect.top + elementRect.height / 2) / window.innerHeight) * 100,
			0,
			100
		);
		element.children[0].animate([{ objectPosition: "0% " + percentage + "%" }], {
			duration: 1200,
			fill: "forwards",
		});
	});

	if (nextPageButton.style.opacity) {
		nextPageButton.style.opacity = 0;
		nextPageButton.style.pointerEvents = "none";
	}
	if (
		window.scrollY >
		document.body.children.lastPage.offsetTop - document.body.children.lastPage.offsetHeight
	) {
		return;
	}
	if (nextPageDelay) {
		clearTimeout(nextPageDelay);
	}
	nextPageDelay = setTimeout(() => {
		nextPageButton.style.opacity = 1;
		nextPageButton.style.pointerEvents = "all";
	}, NEXTPAGESHOWUPDELAY);
};

const productsWrapper = document.querySelector(".productsWrapper");
const productsContainer = document.querySelector(".productsContainer");

function clamp(val, min, max) {
	return Math.max(Math.min(val, max), min);
}

function scrollProductWrapper(x, duration = 1200) {
	const maxScroll = -productsWrapper.clientWidth + productsContainer.clientWidth;
	productsWrapper.animate([{ transform: `translateX(${x}px)` }], {
		duration,
		fill: "forwards",
	});
	const imgObjectPos = ((maxScroll / 5 + x) / (maxScroll * 5)) * 100;
	for (let i = 0; i < productsWrapper.children.length; i++) {
		productsWrapper.children[i]
			.querySelector("img")
			.animate([{ objectPosition: `${imgObjectPos}%` }], { duration, fill: "forwards" });
	}
}

let productWrapperMouseStart = 0;
let productWrapperScrollState = 0;
let productWrapperCurrentScroll = 0;

productsContainer.onmousedown = ({ clientX }) => {
	productWrapperMouseStart = clientX;
	setTimeout(() => {
		for (let i = 0; i < productsWrapper.children.length; i++) {
			productsWrapper.children[i].classList.remove("productContainerCanHover");
		}
	}, 100);
};

const pointer = document.getElementById("pointer");

const pointerradius = pointer.offsetHeight / 2;
document.addEventListener("mousemove", ({ clientX, clientY }) => {
	pointer.animate(
		[
			{
				transform: `scale(${
					1 -
					Math.sqrt((clientX - pointer.offsetLeft) ** 2 + (clientY - pointer.offsetTop) ** 2) /
						(Math.max(window.innerWidth, window.innerHeight) / 2)
				})`,
			},
		],
		{ fill: "forwards", duration: 100 }
	);
	pointer.animate(
		[
			{
				left: clientX - pointerradius + "px",
				top: clientY - pointerradius + "px",
			},
		],
		{ duration: 1200, fill: "forwards" }
	);
	if (!productWrapperMouseStart) {
		return;
	}
	const totalScroll = clamp(
		(clientX - productWrapperMouseStart) * 1.5 + productWrapperScrollState,
		-productsWrapper.clientWidth + productsContainer.clientWidth,
		0
	);

	productWrapperCurrentScroll = totalScroll;

	scrollProductWrapper(totalScroll);
});

productsContainer.onmouseup = () => {
	productWrapperMouseStart = 0;
	productWrapperScrollState = productWrapperCurrentScroll;
	setTimeout(() => {
		for (let i = 0; i < productsWrapper.children.length; i++) {
			productsWrapper.children[i].classList.add("productContainerCanHover");
		}
	}, 100);
};

document.getElementById("productNavigatorRight").onclick = () => {
	productWrapperScrollState = clamp(
		productWrapperScrollState - productsWrapper.children[0].clientWidth * 2,
		-productsWrapper.clientWidth + productsContainer.clientWidth,
		0
	);
	scrollProductWrapper(productWrapperScrollState, 300);
};

document.getElementById("productNavigatorLeft").onclick = () => {
	productWrapperScrollState = clamp(
		productWrapperScrollState + productsWrapper.children[0].clientWidth * 2,
		-productsWrapper.clientWidth + productsContainer.clientWidth,
		0
	);
	scrollProductWrapper(productWrapperScrollState, 300);
};
document.querySelectorAll(".rippleishButton").forEach((element) => {
	element.addEventListener("mouseenter", ({ clientX, clientY, target }) => {
		const bounding = target.getBoundingClientRect();
		const xPos = clientX - bounding.left;
		const yPos = clientY - bounding.top;

		document.documentElement.style.setProperty("--xrippleposition", xPos + "px");
		document.documentElement.style.setProperty("--yrippleposition", yPos + "px");
	});
});

const maxDegree = 45;
document.querySelectorAll(".testimonyContainer").forEach((element, index) => {
	element.classList.add("testimonyContainerRight");
	element.style.zIndex = index;
	updateTestimonyAnimation();
});
const testimony = document.getElementById("testimony");
testimony.addEventListener("click", (e) => {
	e.stopPropagation();
	try {
		document.querySelector(".testimonyCenter").classList.remove("testimonyCenter");
	} catch {}
	const testimonyRight = document.querySelectorAll(".testimonyContainerRight");
	const testimonyLeft = document.querySelectorAll(".testimonyContainerLeft");
	if (testimonyLeft.length && e.clientX > testimony.offsetWidth / 2) {
		const lastLeft = testimonyLeft[0];
		lastLeft.classList.remove("testimonyContainerLeft");
		lastLeft.classList.add("testimonyContainerRight");
	} else if (testimonyRight.length) {
		const lastRight = testimonyRight[testimonyRight.length - 1];
		lastRight.classList.remove("testimonyContainerRight");
		lastRight.classList.add("testimonyContainerLeft");
	}

	const testimonyRightThen = document.querySelectorAll(".testimonyContainerRight");
	testimonyRightThen.item(testimonyRightThen.length - 1).classList.add("testimonyCenter");

	updateTestimonyAnimation();
});

window.addEventListener("resize", () => {
	updateTestimonyAnimation();
});

function updateTestimonyAnimation() {
	const testimonyRight = document.querySelectorAll(".testimonyContainerRight");
	const rightDegStep = maxDegree / testimonyRight.length;
	testimonyRight.forEach((element, index) => {
		if (index >= testimonyRight.length - 1) {
			return;
		}
		const degree = (index + 1) * rightDegStep;
		element.animate(
			[
				{
					left: window.innerWidth - element.offsetWidth / 2 + "px",
					transform: `scale(0.8) translateY(-50%) rotate(-${degree}deg)`,
				},
			],
			{ duration: testimonyAnimationDuration, easing: "ease-out", fill: "forwards" }
		);
	});
	const lastRight = testimonyRight[testimonyRight.length - 1];
	lastRight.animate(
		[
			{
				left: window.innerWidth / 2 - lastRight.offsetWidth / 2 + "px",
				transform: ` translateY(-50%) scale(1) rotate(0deg)`,
			},
		],
		{ duration: testimonyAnimationDuration, easing: "ease-out", fill: "forwards" }
	);

	const testimonyLeft = document.querySelectorAll(".testimonyContainerLeft");

	const leftDegStep = maxDegree / testimonyLeft.length;
	testimonyLeft.forEach((element, index) => {
		const degree = (index + 1) * leftDegStep;
		element.animate(
			[
				{
					left: -lastRight.offsetWidth / 2 + "px",
					transform: `scale(0.8) translateY(-50%) rotate(${degree}deg)`,
				},
			],
			{ duration: testimonyAnimationDuration, easing: "ease-out", fill: "forwards" }
		);
	});
}
