const themeToggle = document.querySelector(".navbar-theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".navbar-menu-toggle");
const menuIcon = menuToggle.querySelector("i");

// Keep the theme button in sync with the active page theme.
const updateThemeButton = (isDarkMode) => {
	themeIcon.className = isDarkMode ? "bi bi-sun" : "bi bi-moon";
	themeToggle.setAttribute(
		"aria-label",
		isDarkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
	);
};

// Restore the saved theme when any MASAR page loads.
const savedTheme = localStorage.getItem("masarTheme");
const savedDarkMode = savedTheme === "dark";
document.body.classList.toggle("dark-mode", savedDarkMode);
updateThemeButton(savedDarkMode);

// Toggle and save the dark theme on the page body.
themeToggle.addEventListener("click", () => {
	const isDarkMode = document.body.classList.toggle("dark-mode");

	localStorage.setItem("masarTheme", isDarkMode ? "dark" : "light");
	updateThemeButton(isDarkMode);
});

// Toggle the mobile navigation menu and its icon.
menuToggle.addEventListener("click", () => {
	const isMenuOpen = navbar.classList.toggle("menu-open");

	menuIcon.className = isMenuOpen ? "bi bi-x-lg" : "bi bi-list";
	menuToggle.setAttribute("aria-expanded", isMenuOpen);
	menuToggle.setAttribute(
		"aria-label",
		isMenuOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"
	);
});

const quickStartActions = document.querySelector(".navbar-start-actions");
const quickStartButton = document.querySelector(".navbar-cta");
const quickStartMenu = document.querySelector(".quick-start-menu");

if (quickStartActions && quickStartButton && quickStartMenu) {
	const closeQuickStartMenu = () => {
		quickStartMenu.hidden = true;
		quickStartMenu.classList.remove("is-open");
		quickStartButton.setAttribute("aria-expanded", "false");
	};

	// Toggle the quick-start options beside the Navbar CTA.
	quickStartButton.addEventListener("click", (event) => {
		event.preventDefault();
		const isOpen = !quickStartMenu.hidden;

		if (isOpen) {
			closeQuickStartMenu();
			return;
		}

		quickStartMenu.hidden = false;
		quickStartMenu.classList.add("is-open");
		quickStartButton.setAttribute("aria-expanded", "true");
	});

	document.addEventListener("click", (event) => {
		if (!quickStartActions.contains(event.target)) {
			closeQuickStartMenu();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeQuickStartMenu();
		}
	});
}

const faqItems = document.querySelectorAll(".faq-item");

// Open one FAQ answer at a time.
faqItems.forEach((faqItem) => {
	const questionRow = faqItem.querySelector(".faq-question-row");

	questionRow.addEventListener("click", () => {
		faqItems.forEach((item) => {
			if (item !== faqItem) {
				item.classList.remove("active");
			}
		});

		faqItem.classList.toggle("active");
	});
});

const courseFilters = document.querySelectorAll(".course-filter");
const courseSearch = document.querySelector("#course-search");
const courseCards = document.querySelectorAll(".course-card");
const coursesEmptyState = document.querySelector("#courses-empty-state");
const coursesShowMore = document.querySelector("#courses-show-more");
const coursesResultCount = document.querySelector("#courses-result-count");

if (courseFilters.length && courseSearch && coursesEmptyState) {
	let selectedCategory = "all";
	let visibleLimit = 12;
	const requestedCourseCategory = new URLSearchParams(window.location.search).get("category");
	const courseCategoryValues = Array.from(courseFilters).map((button) => button.dataset.category);
	if (courseCategoryValues.includes(requestedCourseCategory)) {
		selectedCategory = requestedCourseCategory;
		courseFilters.forEach((button) => button.classList.toggle("active", button.dataset.category === selectedCategory));
		if (selectedCategory !== "all") {
			visibleLimit = 6;
		}
	}

	// Filter course cards, update the result count, and apply the visible limit.
	const filterCourses = () => {
		const searchText = courseSearch.value.trim().toLowerCase();
		const matchingCourses = [];
		const activeFilter = document.querySelector(".course-filter.active");
		const categoryName = activeFilter ? activeFilter.textContent.trim() : "الدورات";

		courseCards.forEach((courseCard) => {
			const matchesCategory = selectedCategory === "all"
				|| courseCard.dataset.category === selectedCategory;
			const matchesSearch = courseCard.textContent.toLowerCase().includes(searchText);

			if (matchesCategory && matchesSearch) {
				matchingCourses.push(courseCard);
			}
		});

		courseCards.forEach((courseCard) => {
			courseCard.hidden = true;
		});

		matchingCourses.slice(0, visibleLimit).forEach((courseCard) => {
			courseCard.hidden = false;
		});

		coursesEmptyState.hidden = matchingCourses.length > 0;
		if (coursesResultCount) {
			coursesResultCount.textContent = `${matchingCourses.length} دورة ${selectedCategory === "all" ? "متاحة" : `في ${categoryName}`}`;
		}
		if (coursesShowMore) {
			coursesShowMore.hidden = matchingCourses.length <= visibleLimit;
		}
	};

	courseFilters.forEach((filterButton) => {
		filterButton.addEventListener("click", () => {
			selectedCategory = filterButton.dataset.category;
			visibleLimit = selectedCategory === "all" ? 12 : 6;
			courseFilters.forEach((button) => button.classList.remove("active"));
			filterButton.classList.add("active");
			filterCourses();
		});
	});

	courseSearch.addEventListener("input", () => {
		visibleLimit = selectedCategory === "all" ? 12 : 6;
		filterCourses();
	});

	if (coursesShowMore) {
		coursesShowMore.addEventListener("click", () => {
			visibleLimit += selectedCategory === "all" ? 12 : 6;
			filterCourses();
		});
	}

	filterCourses();
	if (requestedCourseCategory && courseCategoryValues.includes(requestedCourseCategory)) {
		document.querySelector("#courses-discovery").scrollIntoView({ behavior: "smooth" });
	}
}

const bootcampFilters = document.querySelectorAll(".bootcamp-filter");
const bootcampSearch = document.querySelector("#bootcamp-search");
const bootcampCards = document.querySelectorAll(".bootcamp-card");
const bootcampsEmptyState = document.querySelector("#bootcamps-empty-state");
const bootcampsResultCount = document.querySelector("#bootcamps-result-count");
const bootcampsHeroButton = document.querySelector(".bootcamps-hero-button");

if (bootcampFilters.length && bootcampSearch && bootcampsEmptyState) {
	let selectedBootcampCategory = "all";
	const requestedBootcampCategory = new URLSearchParams(window.location.search).get("category");
	const bootcampCategoryValues = Array.from(bootcampFilters).map((button) => button.dataset.category);
	if (bootcampCategoryValues.includes(requestedBootcampCategory)) {
		selectedBootcampCategory = requestedBootcampCategory;
		bootcampFilters.forEach((button) => button.classList.toggle("active", button.dataset.category === selectedBootcampCategory));
	}

	// Filter bootcamps by category and provider or title search.
	const filterBootcamps = () => {
		const searchText = bootcampSearch.value.trim().toLowerCase();
		const activeFilter = document.querySelector(".bootcamp-filter.active");
		const categoryName = activeFilter ? activeFilter.textContent.trim() : "المعسكرات";
		let visibleBootcamps = 0;

		bootcampCards.forEach((bootcampCard) => {
			const matchesCategory = selectedBootcampCategory === "all"
				|| bootcampCard.dataset.category === selectedBootcampCategory;
			const matchesSearch = bootcampCard.textContent.toLowerCase().includes(searchText);
			const shouldShow = matchesCategory && matchesSearch;

			bootcampCard.hidden = !shouldShow;
			if (shouldShow) {
				visibleBootcamps += 1;
			}
		});

		bootcampsEmptyState.hidden = visibleBootcamps > 0;
		if (bootcampsResultCount) {
			bootcampsResultCount.textContent = `${visibleBootcamps} معسكرات ${selectedBootcampCategory === "all" ? "متاحة" : `في ${categoryName}`}`;
		}
	};

	bootcampFilters.forEach((filterButton) => {
		filterButton.addEventListener("click", () => {
			selectedBootcampCategory = filterButton.dataset.category;
			bootcampFilters.forEach((button) => button.classList.remove("active"));
			filterButton.classList.add("active");
			filterBootcamps();
		});
	});

	bootcampSearch.addEventListener("input", filterBootcamps);
	filterBootcamps();
	if (requestedBootcampCategory && bootcampCategoryValues.includes(requestedBootcampCategory)) {
		document.querySelector("#bootcamps-discovery").scrollIntoView({ behavior: "smooth" });
	}
}

if (bootcampsHeroButton) {
	bootcampsHeroButton.addEventListener("click", (event) => {
		event.preventDefault();
		document.querySelector("#bootcamps-discovery").scrollIntoView({ behavior: "smooth" });
	});
}

const discoverQuiz = document.querySelector("#discover-quiz");

if (discoverQuiz) {
	const questions = Array.from(document.querySelectorAll(".discover-question"));
	const answers = questions.map(() => null);
	const fields = ["web", "ai", "cyber", "data", "uiux", "mobile"];
	const fieldResults = {
		web: { title: "البرمجة وتطوير الويب", icon: "bi-code-slash", description: "تشير اختياراتك إلى اهتمام ببناء حلول رقمية، التفكير المنطقي، وتحويل الأفكار إلى مواقع تفاعلية تعمل بوضوح." },
		ai: { title: "الذكاء الاصطناعي", icon: "bi-cpu", description: "تشير اختياراتك إلى فضول تجاه التجربة، الأنظمة الذكية، حل المشكلات، والتقنيات التي تتطور بسرعة." },
		cyber: { title: "الأمن السيبراني", icon: "bi-shield-lock", description: "تشير اختياراتك إلى ميل للتحقيق، الانتباه للتفاصيل، اكتشاف نقاط الضعف وحماية الأنظمة والمعلومات." },
		data: { title: "علم البيانات", icon: "bi-bar-chart", description: "تشير اختياراتك إلى اهتمام بالأنماط، التحليل، الأرقام، واستخراج رؤى تساعد على اتخاذ قرارات مبنية على الأدلة." },
		uiux: { title: "تصميم UI/UX", icon: "bi-palette", description: "تشير اختياراتك إلى مساحة للإبداع، التفاصيل البصرية، فهم المستخدمين وبناء تجارب رقمية واضحة وسهلة." },
		mobile: { title: "تطوير تطبيقات الجوال", icon: "bi-phone", description: "تشير اختياراتك إلى حماس لصناعة تجارب عملية وتفاعلية مصممة خصيصًا للشاشات والأجهزة المحمولة." }
	};
	const progressLabel = document.querySelector("#discover-progress-label");
	const progressBar = document.querySelector("#discover-progress-bar");
	const previousButton = document.querySelector("#discover-previous");
	const nextButton = document.querySelector("#discover-next");
	const message = document.querySelector("#discover-message");
	const result = document.querySelector("#discover-result");
	let currentQuestion = 0;

	const renderQuestion = () => {
		questions.forEach((question, index) => question.classList.toggle("active", index === currentQuestion));
		progressLabel.textContent = `السؤال ${currentQuestion + 1} من ${questions.length}`;
		progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
		previousButton.hidden = currentQuestion === 0;
		nextButton.textContent = currentQuestion === questions.length - 1 ? "اكتشف النتيجة" : "التالي";
		message.textContent = "";
	};

	questions.forEach((question, questionIndex) => {
		question.querySelectorAll(".discover-answer").forEach((answer, answerIndex) => {
			answer.addEventListener("click", () => {
				answers[questionIndex] = answerIndex;
				question.querySelectorAll(".discover-answer").forEach((item, index) => item.classList.toggle("selected", index === answerIndex));
				message.textContent = "";
			});
		});
	});

	const showResult = () => {
		const scores = Object.fromEntries(fields.map((field) => [field, 0]));
		answers.forEach((answerIndex, questionIndex) => {
			if (answerIndex === null) return;
			const contribution = JSON.parse(questions[questionIndex].querySelectorAll(".discover-answer")[answerIndex].dataset.scores);
			Object.entries(contribution).forEach(([field, points]) => { scores[field] += points; });
		});

		const highestScore = Math.max(...fields.map((field) => scores[field]));
		const tiedFields = fields.filter((field) => scores[field] === highestScore);
		let winningField = tiedFields[0];
		for (let index = answers.length - 1; index >= 0 && tiedFields.length > 1; index -= 1) {
			if (answers[index] === null) continue;
			const contribution = JSON.parse(questions[index].querySelectorAll(".discover-answer")[answers[index]].dataset.scores);
			const preferred = tiedFields.filter((field) => contribution[field]);
			if (preferred.length) { winningField = preferred[0]; break; }
		}

		const resultData = fieldResults[winningField];
		document.querySelector("#discover-result-icon i").className = `bi ${resultData.icon}`;
		document.querySelector("#discover-result-title").textContent = resultData.title;
		document.querySelector("#discover-result-description").textContent = resultData.description;
		document.querySelector("#discover-courses-link").href = `courses.html?category=${winningField}`;
		document.querySelector("#discover-bootcamps-link").href = `bootcamps.html?category=${winningField}`;
		discoverQuiz.hidden = true;
		result.hidden = false;
	};

	nextButton.addEventListener("click", () => {
		if (answers[currentQuestion] === null) { message.textContent = "اختر الإجابة الأقرب لك أولًا."; return; }
		if (currentQuestion === questions.length - 1) { showResult(); return; }
		currentQuestion += 1;
		renderQuestion();
	});
	previousButton.addEventListener("click", () => { currentQuestion -= 1; renderQuestion(); });
	document.querySelector("#discover-restart").addEventListener("click", () => {
		answers.fill(null);
		questions.forEach((question) => question.querySelectorAll(".discover-answer").forEach((answer) => answer.classList.remove("selected")));
		currentQuestion = 0;
		result.hidden = true;
		discoverQuiz.hidden = false;
		renderQuestion();
	});
	renderQuestion();
}
