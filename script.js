/* =====================================================
   VERITAS
   INTERACTION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       BASIC DOM
    ================================================= */

    const header =
        document.getElementById("siteHeader");

    const mobileToggle =
        document.getElementById("mobileToggle");

    const mobileNav =
        document.getElementById("mobileNav");


    /* =================================================
       YEAR
    ================================================= */

    const year =
        document.getElementById("year");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    /* =================================================
       HEADER SCROLL
    ================================================= */

    function handleHeader() {

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener(
        "scroll",
        handleHeader,
        { passive: true }
    );

    handleHeader();


    /* =================================================
       MOBILE NAV
    ================================================= */

    mobileToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileToggle.classList.toggle(
                    "active"
                );

            mobileNav.classList.toggle(
                "active",
                isOpen
            );

            mobileToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileToggle.classList.remove(
                        "active"
                    );

                    mobileNav.classList.remove(
                        "active"
                    );

                    mobileToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


    /* =================================================
       NAVIGATION ACTIVE STATE
    ================================================= */

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId =
                        entry.target.id;

                    navLinks.forEach(link => {

                        const linkTarget =
                            link.getAttribute(
                                "href"
                            );

                        link.classList.toggle(
                            "active",
                            linkTarget ===
                            `#${currentId}`
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* =================================================
       SCROLL REVEAL
    ================================================= */

    const revealSelectors = `
    .knowledge-card,
    .featured-resource,
    .resource-card,

    .sift-studio-intro,
    .sift-step-map,
    .sift-case-panel,
    .sift-studio-active,
    .sift-example-section,
    .sift-learning-grid,
    .sift-do-dont-grid,
    .sift-question-banner,
    .sift-why-strip,
    .sift-quick-check,
    .sift-verification-trail,

    .tool-card,
    .quiz-card,
    .final-card
`;

    const revealItems =
        document.querySelectorAll(
            revealSelectors
        );

    revealItems.forEach(item => {
        item.classList.add(
            "reveal-item"
        );
    });


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: .06
            }
        );


    revealItems.forEach(item => {
        revealObserver.observe(item);
    });


          /* =================================================
       LIBRARY FILTER + LOAD MORE
    ================================================= */

    const libraryTabs =
        document.querySelectorAll(".library-tab");

    const resourceCards =
        Array.from(
            document.querySelectorAll(".resource-card")
        );

    const librarySearch =
        document.getElementById("librarySearch");

    const emptyResults =
        document.getElementById("emptyResults");

    const libraryMore =
        document.getElementById("libraryMore");

    const libraryMoreWrap =
        document.getElementById("libraryMoreWrap");


    const LIBRARY_LIMIT = 6;

    let activeLibraryCategory = "all";

    let libraryExpanded = false;


    /* =================================================
       RENDER LIBRARY
    ================================================= */

    function renderLibrary() {

        const keyword =
            librarySearch
                ? librarySearch.value
                    .trim()
                    .toLowerCase()
                : "";


        /* ---------------------------------------------
           LỌC CARD
        --------------------------------------------- */

        const matchedCards =
            resourceCards.filter(card => {

                const category =
                    (
                        card.dataset.category ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                const searchText =
                    (
                        card.dataset.search ||
                        card.textContent ||
                        ""
                    )
                    .toLowerCase();


                const categoryMatch =
                    activeLibraryCategory === "all" ||
                    category === activeLibraryCategory;


                const searchMatch =
                    keyword === "" ||
                    searchText.includes(keyword);


                return (
                    categoryMatch &&
                    searchMatch
                );

            });


        /* ---------------------------------------------
           XÁC ĐỊNH CARD HIỂN THỊ
        --------------------------------------------- */

        let visibleCards;


        if (
            activeLibraryCategory === "all" &&
            keyword === "" &&
            libraryExpanded === false
        ) {

            visibleCards =
                matchedCards.slice(
                    0,
                    LIBRARY_LIMIT
                );

        } else {

            visibleCards =
                matchedCards;

        }


        /* ---------------------------------------------
           ẨN TOÀN BỘ CARD
        --------------------------------------------- */

        resourceCards.forEach(card => {

            card.style.display = "none";

        });


        /* ---------------------------------------------
           HIỆN CARD ĐƯỢC CHỌN
        --------------------------------------------- */

        visibleCards.forEach(card => {

            card.style.display = "";

        });


        /* ---------------------------------------------
           EMPTY RESULT
        --------------------------------------------- */

        if (emptyResults) {

            emptyResults.classList.toggle(
                "show",
                matchedCards.length === 0
            );

        }


        /* ---------------------------------------------
           LOAD MORE
        --------------------------------------------- */

        const shouldShowMore =
    activeLibraryCategory === "all" &&
    keyword === "" &&
    matchedCards.length > LIBRARY_LIMIT;


if (libraryMore && libraryMoreWrap) {

    if (!shouldShowMore) {
        libraryMoreWrap.style.display = "none";
        return;
    }

    libraryMoreWrap.style.display = "flex";

    const text =
        libraryMore.querySelector(".library-more-text");

    const arrow =
        libraryMore.querySelector(".library-more-arrow");

    if (text && arrow) {

        if (libraryExpanded) {
            text.textContent = "Thu gọn";
            arrow.textContent = "↑";
        } else {
            text.textContent = "Xem thêm";
            arrow.textContent = "↓";
        }

    }

}
    }

    


    /* =================================================
       TAB
    ================================================= */

    libraryTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                libraryTabs.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                tab.classList.add(
                    "active"
                );


                activeLibraryCategory =
                    (
                        tab.dataset.category ||
                        "all"
                    )
                    .trim()
                    .toLowerCase();


                libraryExpanded = false;


                if (librarySearch) {

                    librarySearch.value = "";

                }


                renderLibrary();

            }
        );

    });


    /* =================================================
       SEARCH
    ================================================= */

    if (librarySearch) {

        librarySearch.addEventListener(
            "input",
            () => {

                libraryExpanded = true;

                renderLibrary();

            }
        );

    }


    /* =================================================
       XEM THÊM
    ================================================= */

    if (libraryMore) {

        libraryMore.addEventListener(
            "click",
            () => {

                if (
                    activeLibraryCategory !== "all"
                ) {
                    return;
                }


                libraryExpanded =
                    !libraryExpanded;


                renderLibrary();

            }
        );

    }


    /* =================================================
       KHỞI TẠO
    ================================================= */

    renderLibrary();
 

/* =========================================================
   VERITAS — SIFT VERIFICATION STUDIO
========================================================= */

const siftNavItems =
    document.querySelectorAll(
        ".sift-nav-item"
    );

const siftPipelineSteps =
    document.querySelectorAll(
        ".sift-pipeline-step"
    );


/* =========================================================
   ELEMENTS
========================================================= */

const siftClaimText =
    document.getElementById(
        "siftClaimText"
    );

const siftCaseImage =
    document.getElementById(
        "siftCaseImage"
    );

const siftCurrentState =
    document.getElementById(
        "siftCurrentState"
    );

const siftActiveLetter =
    document.getElementById(
        "siftActiveLetter"
    );

const siftActiveCode =
    document.getElementById(
        "siftActiveCode"
    );

const siftActiveSub =
    document.getElementById(
        "siftActiveSub"
    );

const siftStepCurrent =
    document.getElementById(
        "siftStepCurrent"
    );

const siftVisualPercent =
    document.getElementById(
        "siftVisualPercent"
    );

const siftVisualStatus =
    document.getElementById(
        "siftVisualStatus"
    );

const siftExplanationKicker =
    document.getElementById(
        "siftExplanationKicker"
    );

const siftExplanationLetter =
    document.getElementById(
        "siftExplanationLetter"
    );

const siftExplanationTitle =
    document.getElementById(
        "siftExplanationTitle"
    );

const siftLongExplanation =
    document.getElementById(
        "siftLongExplanation"
    );

const siftExplanationText =
    document.getElementById(
        "siftExplanationText"
    );

const siftQuestion =
    document.getElementById(
        "siftQuestion"
    );

const siftWhy =
    document.getElementById(
        "siftWhy"
    );

const siftActionList =
    document.getElementById(
        "siftActionList"
    );

const siftDoList =
    document.getElementById(
        "siftDoList"
    );

const siftDontList =
    document.getElementById(
        "siftDontList"
    );

const siftGalleryMain =
    document.getElementById(
        "siftGalleryMain"
    );

const siftGallerySmallOne =
    document.getElementById(
        "siftGallerySmallOne"
    );

const siftGallerySmallTwo =
    document.getElementById(
        "siftGallerySmallTwo"
    );

const siftGalleryTag =
    document.getElementById(
        "siftGalleryTag"
    );

const siftGalleryTitle =
    document.getElementById(
        "siftGalleryTitle"
    );

const siftGalleryLook =
    document.getElementById(
        "siftGalleryLook"
    );

const siftGalleryAvoid =
    document.getElementById(
        "siftGalleryAvoid"
    );

const siftStudioStage =
    document.querySelector(
        ".sift-studio-stage"
    );

const siftExampleGallery =
    document.querySelector(
        ".sift-example-gallery"
    );

const siftProgressLine =
    document.querySelector(
        ".sift-step-map-line span"
    );

const siftAutoPlay =
    document.getElementById(
        "siftAutoPlay"
    );


/* =========================================================
   SIFT CONTENT
========================================================= */

const siftSteps = [

    {
        letter: "S",
        code: "STOP",
        sub: "PAUSE BEFORE TRUSTING",

        status:
            "PAUSING BEFORE TRUSTING",

        percent: 25,

        claim:
            "Có nên tin thông tin này?",

        state:
            "Chưa được xác minh",

        image:
    "https://images.unsplash.com/photo-1676565415274-15550cb4b75e?auto=format&fit=crop&w=1600&q=85",

galleryMain:
    "https://images.unsplash.com/photo-1555663173-830f65a7329a?auto=format&fit=crop&w=1600&q=85",

galleryOne:
    "https://images.unsplash.com/photo-1777559542722-5301247fa3b8?auto=format&fit=crop&w=1600&q=85",

galleryTwo:
    "https://images.unsplash.com/photo-1603145733146-ae562a55031e?auto=format&fit=crop&w=1600&q=85",

        galleryTitle:
            "Dừng lại trước khi phản ứng",

        galleryLook:
            "Cảm xúc và tốc độ phản ứng",

        galleryAvoid:
            "Chia sẻ khi chưa kiểm chứng",

        title:
            "Dừng lại trước khi tin.",

        short:
            "Tạo một khoảng dừng trước khi phản ứng.",

        explanation:
            "STOP là bước đầu tiên của SIFT. " +
            "Bạn chưa cần chứng minh thông tin đúng hoặc sai. " +
            "Điều quan trọng là dừng lại, nhận biết phản ứng cảm xúc, " +
            "xác định tuyên bố đang được đưa ra và quyết định " +
            "rằng tuyên bố này cần được kiểm chứng.",

        question:
            "Tôi đang phản ứng với sự thật hay với cảm xúc?",

        why:
            "Nội dung gây sốc hoặc kích thích cảm xúc " +
            "có thể khiến chúng ta phản ứng quá nhanh. " +
            "STOP tạo ra khoảng dừng để chuyển từ phản ứng " +
            "sang suy nghĩ có chủ đích.",

        actions: [
            "Nhận diện cảm xúc mà thông tin đang tạo ra.",
            "Xác định chính xác tuyên bố cần kiểm chứng.",
            "Tạm dừng trước khi bình luận hoặc chia sẻ."
        ],

        doList: [
            "Chậm lại trước thông tin gây sốc.",
            "Xác định điều bạn thực sự cần kiểm chứng.",
            "Tách cảm xúc khỏi quyết định."
        ],

        dontList: [
            "Chia sẻ chỉ vì nội dung đang viral.",
            "Kết luận chỉ dựa vào cảm giác.",
            "Tin ngay vì tiêu đề nghe thuyết phục."
        ]
    },


    {
        letter: "I",
        code: "INVESTIGATE",
        sub: "CHECK THE SOURCE",

        status:
            "INVESTIGATING THE SOURCE",

        percent: 50,

        claim:
            "Nguồn này đến từ đâu?",

        state:
            "Đang điều tra nguồn",

        image:
    "https://images.unsplash.com/photo-1753005329490-ab77d21066c7?auto=format&fit=crop&w=1600&q=85",

galleryMain:
    "https://images.unsplash.com/photo-1665686306265-c52ee9054479?auto=format&fit=crop&w=1600&q=85",

galleryOne:
    "https://images.unsplash.com/photo-1661961111184-11317b40adb2?auto=format&fit=crop&w=1600&q=85",

galleryTwo:
    "https://images.unsplash.com/photo-1680602239323-da8299c5a7ba?auto=format&fit=crop&w=1600&q=85",

        galleryTitle:
            "Nhìn vào người đứng phía sau thông tin",

        galleryLook:
            "Tác giả, tổ chức, chuyên môn",

        galleryAvoid:
            "Đánh giá nguồn chỉ qua thiết kế",

        title:
            "Điều tra nguồn.",

        short:
            "Biết ai đang nói trước khi tin điều họ nói.",

        explanation:
            "INVESTIGATE chuyển sự chú ý từ bản thân tuyên bố " +
            "sang người hoặc tổ chức đứng phía sau nó. " +
            "Hãy tìm tác giả, tổ chức xuất bản, chuyên môn, " +
            "uy tín, lịch sử hoạt động và mục đích của nguồn.",

        question:
            "Ai đang nói và họ có đáng tin không?",

        why:
            "Một nguồn có thể trình bày thông tin rất tự tin " +
            "nhưng điều đó không tự động biến nó thành nguồn đáng tin. " +
            "Hiểu nguồn giúp bạn đánh giá thông tin trước " +
            "khi bị cuốn vào nội dung.",

        actions: [
            "Xác định tác giả hoặc tổ chức đứng phía sau.",
            "Kiểm tra chuyên môn và uy tín của nguồn.",
            "Tìm hiểu mục đích hoặc lợi ích của nguồn."
        ],

        doList: [
            "Tìm trang giới thiệu hoặc hồ sơ tác giả.",
            "Kiểm tra chuyên môn và lĩnh vực hoạt động.",
            "Xem nguồn có lịch sử đáng tin hay không."
        ],

        dontList: [
            "Tin chỉ vì website trông chuyên nghiệp.",
            "Mặc định tài khoản có nhiều người theo dõi là đáng tin.",
            "Nhầm nổi tiếng với chuyên môn."
        ]
    },


    {
        letter: "F",
        code: "FIND",
        sub: "FIND BETTER COVERAGE",

        status:
            "FINDING BETTER COVERAGE",

        percent: 75,

        claim:
            "Có nguồn tốt hơn để kiểm tra không?",

        state:
            "Đang tìm nguồn độc lập",

      image:
    "https://images.unsplash.com/photo-1647510283846-ed174cc84a78?auto=format&fit=crop&w=1600&q=85",

galleryMain:
    "https://images.unsplash.com/photo-1664575196079-9ac04582854b?auto=format&fit=crop&w=1600&q=85",

galleryOne:
    "https://images.unsplash.com/photo-1726066012678-211c2e2d4fa7?auto=format&fit=crop&w=1600&q=85",

galleryTwo:
    "https://images.unsplash.com/photo-1661961111184-11317b40adb2?auto=format&fit=crop&w=1600&q=85",

        galleryTitle:
            "Tìm nguồn tốt hơn",

        galleryLook:
            "Nguồn độc lập và chuyên môn",

        galleryAvoid:
            "Chỉ đọc một bài duy nhất",

        title:
            "Tìm nguồn tốt hơn.",

        short:
            "Đừng phụ thuộc vào một nguồn duy nhất.",

        explanation:
            "FIND yêu cầu bạn rời khỏi nguồn ban đầu " +
            "và tìm những nguồn độc lập, có chuyên môn " +
            "hoặc có bằng chứng tốt hơn. " +
            "Mục tiêu không phải tìm một nguồn nói điều bạn muốn nghe, " +
            "mà là xem những nguồn chất lượng khác mô tả cùng vấn đề ra sao.",

        question:
            "Có nguồn độc lập nào kiểm tra tuyên bố này không?",

        why:
            "Một nguồn duy nhất có thể thiếu bối cảnh " +
            "hoặc mắc sai sót. So sánh nhiều nguồn " +
            "giúp giảm nguy cơ phụ thuộc vào một câu chuyện duy nhất.",

        actions: [
            "Tìm nguồn độc lập về cùng tuyên bố.",
            "Ưu tiên nguồn có chuyên môn hoặc dữ liệu.",
            "So sánh cách nhiều nguồn trình bày cùng vấn đề."
        ],

        doList: [
            "Tìm ít nhất một nguồn độc lập.",
            "Ưu tiên tài liệu chính thức hoặc chuyên ngành.",
            "So sánh thông tin thay vì chỉ đọc một phía."
        ],

        dontList: [
            "Tìm nguồn thứ hai chỉ để xác nhận niềm tin sẵn có.",
            "Cho rằng nhiều bài sao chép nhau là nhiều nguồn.",
            "Đánh đồng số lượng bài đăng với độ tin cậy."
        ]
    },


    {
        letter: "T",
        code: "TRACE",
        sub: "RETURN TO ORIGINAL CONTEXT",

        status:
            "TRACING ORIGINAL CONTEXT",

        percent: 100,

        claim:
            "Bằng chứng gốc thực sự nói gì?",

        state:
            "Truy xuất về bằng chứng gốc",

       image:
    "https://images.unsplash.com/photo-1695388474402-ed805a890d8d?auto=format&fit=crop&w=1600&q=85",

galleryMain:
    "https://images.unsplash.com/photo-1665686306265-c52ee9054479?auto=format&fit=crop&w=1600&q=85",

galleryOne:
    "https://images.unsplash.com/photo-1647510283846-ed174cc84a78?auto=format&fit=crop&w=1600&q=85",

galleryTwo:
    "https://images.unsplash.com/photo-1680602239323-da8299c5a7ba?auto=format&fit=crop&w=1600&q=85",

        galleryTitle:
            "Truy xuất về nguồn gốc",

        galleryLook:
            "Tài liệu, số liệu, nghiên cứu gốc",

        galleryAvoid:
            "Tin vào đoạn trích mất bối cảnh",

        title:
            "Truy xuất về nguồn gốc.",

        short:
            "Quay về bằng chứng ban đầu.",

        explanation:
            "TRACE là lúc bạn quay trở lại tài liệu, dữ liệu, " +
            "hình ảnh, nghiên cứu hoặc phát biểu gốc mà thông tin " +
            "đang đề cập. Hãy kiểm tra xem bằng chứng gốc có thực sự " +
            "nói điều mà bài đăng, video hoặc tiêu đề đang tuyên bố hay không.",

        question:
            "Bằng chứng gốc thực sự nói gì?",

        why:
            "Một hình ảnh, con số hoặc câu trích dẫn có thể bị cắt khỏi " +
            "bối cảnh ban đầu. TRACE giúp bạn quay lại nguồn gốc " +
            "để biết chính xác điều gì đã được nói và trong hoàn cảnh nào.",

        actions: [
            "Mở bài viết, nghiên cứu hoặc tài liệu gốc.",
            "Đọc bối cảnh đầy đủ thay vì chỉ xem đoạn trích.",
            "Đối chiếu hình ảnh, số liệu, trích dẫn và thời điểm."
        ],

        doList: [
            "Tìm tài liệu hoặc phát biểu gốc.",
            "Kiểm tra toàn bộ bối cảnh.",
            "Đối chiếu số liệu và trích dẫn."
        ],

        dontList: [
            "Tin một screenshot thay cho tài liệu gốc.",
            "Dùng đoạn trích ngắn làm toàn bộ bằng chứng.",
            "Bỏ qua thời điểm và hoàn cảnh của dữ liệu."
        ]
    }

];


/* =========================================================
   STATE
========================================================= */

let activeSiftStep = 0;

let siftAutoTimer = null;


/* =========================================================
   RENDER LIST
========================================================= */

function renderSiftList(
    element,
    items
) {

    if (!element) {
        return;
    }

    element.innerHTML =
        items
            .map(
                (
                    item,
                    index
                ) => {

                    return `
                        <div>
                            <span>
                                ${String(index + 1).padStart(2,"0")}
                            </span>

                            <p>
                                ${item}
                            </p>
                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   ACTIVATE STEP
========================================================= */

function activateSiftStep(
    index
) {

    const step =
        siftSteps[index];

    if (!step) {
        return;
    }

    activeSiftStep =
        index;


    /* -----------------------------------------------------
       ACTIVE NAV
    ----------------------------------------------------- */

    siftNavItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                Number(
                    item.dataset.siftStep
                ) === index
            );

        }
    );


    /* -----------------------------------------------------
       PIPELINE
    ----------------------------------------------------- */

    siftPipelineSteps.forEach(
        item => {

            item.classList.toggle(
                "active",
                Number(
                    item.dataset.siftStep
                ) === index
            );

        }
    );


    /* -----------------------------------------------------
       CLAIM
    ----------------------------------------------------- */

    if (siftClaimText) {

        siftClaimText.textContent =
            step.claim;

    }


    if (siftCurrentState) {

        siftCurrentState.textContent =
            step.state;

    }


    /* -----------------------------------------------------
       IMAGES
    ----------------------------------------------------- */

    if (siftCaseImage) {

        siftCaseImage.src =
            step.image;

    }

    if (siftGalleryMain) {

        siftGalleryMain.src =
            step.galleryMain;

    }

    if (siftGallerySmallOne) {

        siftGallerySmallOne.src =
            step.galleryOne;

    }

    if (siftGallerySmallTwo) {

        siftGallerySmallTwo.src =
            step.galleryTwo;

    }


    /* -----------------------------------------------------
       ACTIVE STEP
    ----------------------------------------------------- */

    if (siftActiveLetter) {

        siftActiveLetter.textContent =
            step.letter;

    }

    if (siftActiveCode) {

        siftActiveCode.textContent =
            step.code;

    }

    if (siftActiveSub) {

        siftActiveSub.textContent =
            step.sub;

    }


    /* -----------------------------------------------------
       COUNTER
    ----------------------------------------------------- */

    if (siftStepCurrent) {

        siftStepCurrent.textContent =
            String(index + 1)
                .padStart(
                    2,
                    "0"
                );

    }


    /* -----------------------------------------------------
       STATUS
    ----------------------------------------------------- */

    if (siftVisualPercent) {

        siftVisualPercent.textContent =
            step.percent;

    }

    if (siftVisualStatus) {

        siftVisualStatus.textContent =
            step.status;

    }


    /* -----------------------------------------------------
       DETAIL
    ----------------------------------------------------- */

    if (siftExplanationKicker) {

        siftExplanationKicker.textContent =
            step.code;

    }

    if (siftExplanationLetter) {

        siftExplanationLetter.textContent =
            step.letter;

    }

    if (siftExplanationTitle) {

        siftExplanationTitle.textContent =
            step.title;

    }

    if (siftLongExplanation) {

        siftLongExplanation.textContent =
            step.explanation;

    }

    if (siftExplanationText) {

        siftExplanationText.textContent =
            step.short;

    }


    /* -----------------------------------------------------
       QUESTION
    ----------------------------------------------------- */

    if (siftQuestion) {

        siftQuestion.textContent =
            step.question;

    }


    /* -----------------------------------------------------
       WHY
    ----------------------------------------------------- */

    if (siftWhy) {

        siftWhy.textContent =
            step.why;

    }


    /* -----------------------------------------------------
       ACTIONS
    ----------------------------------------------------- */

    if (siftActionList) {

        siftActionList.innerHTML =
            step.actions
                .map(
                    (
                        action,
                        actionIndex
                    ) => {

                        return `
                            <div class="sift-action-item">

                                <span>
                                    ${String(
                                        actionIndex + 1
                                    ).padStart(2,"0")}
                                </span>

                                <strong>
                                    ${action}
                                </strong>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    /* -----------------------------------------------------
       DO / DON'T
    ----------------------------------------------------- */

    renderSiftList(
        siftDoList,
        step.doList
    );

    renderSiftList(
        siftDontList,
        step.dontList
    );


    /* -----------------------------------------------------
       GALLERY
    ----------------------------------------------------- */

    if (siftGalleryTag) {

        siftGalleryTag.textContent =
            step.code;

    }

    if (siftGalleryTitle) {

        siftGalleryTitle.textContent =
            step.galleryTitle;

    }

    if (siftGalleryLook) {

        siftGalleryLook.textContent =
            step.galleryLook;

    }

    if (siftGalleryAvoid) {

        siftGalleryAvoid.textContent =
            step.galleryAvoid;

    }


    /* -----------------------------------------------------
       PROGRESS BAR
    ----------------------------------------------------- */

    const progress =
        ((index + 1) /
            siftSteps.length) *
        100;


    document
        .querySelectorAll(
            ".sift-active-progress span"
        )
        .forEach(
            bar => {

                bar.style
                    .setProperty(
                        "--sift-progress",
                        `${progress}%`
                    );

            }
        );


    if (siftProgressLine) {

        siftProgressLine.style.width =
            `${progress}%`;

    }


    /* -----------------------------------------------------
       ANIMATION
    ----------------------------------------------------- */

    if (siftStudioStage) {

        siftStudioStage.classList.remove(
            "is-changing"
        );

        void siftStudioStage.offsetWidth;

        siftStudioStage.classList.add(
            "is-changing"
        );

    }


    if (siftExampleGallery) {

        siftExampleGallery.classList.remove(
            "is-changing"
        );

        void siftExampleGallery.offsetWidth;

        siftExampleGallery.classList.add(
            "is-changing"
        );

    }

}


/* =========================================================
   NAV CLICK
========================================================= */

siftNavItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                activateSiftStep(
                    Number(
                        item.dataset.siftStep
                    )
                );

            }
        );

    }
);


/* =========================================================
   PIPELINE CLICK
========================================================= */

siftPipelineSteps.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                activateSiftStep(
                    Number(
                        item.dataset.siftStep
                    )
                );

            }
        );

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

siftNavItems.forEach(
    item => {

        item.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    activateSiftStep(
                        Number(
                            item.dataset.siftStep
                        )
                    );

                }

            }
        );

    }
);


/* =========================================================
   AUTO PLAY
========================================================= */

if (siftAutoPlay) {

    siftAutoPlay.addEventListener(
        "click",
        () => {

            if (siftAutoTimer) {

                clearInterval(
                    siftAutoTimer
                );

                siftAutoTimer =
                    null;

                siftAutoPlay.classList.remove(
                    "active"
                );

                siftAutoPlay.textContent =
                    "▶ TỰ ĐỘNG";

                return;
            }


            siftAutoPlay.classList.add(
                "active"
            );

            siftAutoPlay.textContent =
                "Ⅱ ĐANG CHẠY";


            siftAutoTimer =
                setInterval(
                    () => {

                        const nextStep =
                            (
                                activeSiftStep + 1
                            ) %
                            siftSteps.length;

                        activateSiftStep(
                            nextStep
                        );

                    },
                    4500
                );

        }
    );

}


/* =========================================================
   INITIAL
========================================================= */

activateSiftStep(0);
/* =========================================================
   SIFT — INTERACTIVE PARALLAX
========================================================= */

const siftCaseImageWrap =
    document.querySelector(
        ".sift-case-image-wrap"
    );

const siftCaseImageElement =
    document.getElementById(
        "siftCaseImage"
    );

const siftGalleryCards =
    document.querySelectorAll(
        ".sift-gallery-card"
    );

const siftGalleryMainElement =
    document.getElementById(
        "siftGalleryMain"
    );


/* ---------------------------------------------------------
   CASE IMAGE PARALLAX
--------------------------------------------------------- */

if (
    siftCaseImageWrap &&
    siftCaseImageElement
) {

    siftCaseImageWrap.addEventListener(
        "mousemove",
        event => {

            if (
                window.matchMedia(
                    "(max-width: 760px)"
                ).matches
            ) {
                return;
            }

            const rect =
                siftCaseImageWrap.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - .5) * 7;

            const rotateX =
                ((y / rect.height) - .5) * -6;


            siftCaseImageWrap.style.transform =
                `
                rotate(0deg)
                translateY(-5px)
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                `;

        }
    );


    siftCaseImageWrap.addEventListener(
        "mouseleave",
        () => {

            siftCaseImageWrap.style.transform =
                "";

        }
    );

}


/* ---------------------------------------------------------
   MAIN GALLERY PARALLAX
--------------------------------------------------------- */

if (siftGalleryMainElement) {

    siftGalleryMainElement.addEventListener(
        "mousemove",
        event => {

            if (
                window.matchMedia(
                    "(max-width: 760px)"
                ).matches
            ) {
                return;
            }

            const rect =
                siftGalleryMainElement.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const moveX =
                ((x / rect.width) - .5) * 12;

            const moveY =
                ((y / rect.height) - .5) * 8;


            siftGalleryMainElement.style.setProperty(
                "--sift-mouse-x",
                `${moveX}px`
            );

            siftGalleryMainElement.style.setProperty(
                "--sift-mouse-y",
                `${moveY}px`
            );

        }
    );


    siftGalleryMainElement.addEventListener(
        "mouseleave",
        () => {

            siftGalleryMainElement.style.setProperty(
                "--sift-mouse-x",
                "0px"
            );

            siftGalleryMainElement.style.setProperty(
                "--sift-mouse-y",
                "0px"
            );

        }
    );

}


/* ---------------------------------------------------------
   SMALL GALLERY TILT
--------------------------------------------------------- */

siftGalleryCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (
                window.matchMedia(
                    "(max-width: 760px)"
                ).matches
            ) {
                return;
            }

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - .5) * -4;

            const rotateY =
                ((x / rect.width) - .5) * 5;


            card.style.transform =
                `
                translateY(-4px)
                perspective(700px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                `;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});
    /* =================================================
       QUIZ DATA
       -----------------------------------------------
       Để chèn ảnh:
       type: "image"
       src: "assets/quiz/question-01.jpg"

       Để chèn video local:
       type: "video"
       src: "assets/quiz/deepfake-01.mp4"

       Để chèn YouTube:
       type: "youtube"
       src: "https://www.youtube.com/embed/VIDEO_ID"

       Để trở về placeholder:
       type: "placeholder"
    ================================================= */

    const quizData = [

    /* =================================================
       CÂU 1
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh1.jpg",
            label: "Robot hình người tại cuộc thi ở Bắc Kinh"
        },

        question:
            "Robot hình người Trung Quốc chạy 100 m trong 8,64 giây tại một cuộc thi robot ở Bắc Kinh, nhanh hơn thành tích 9,58 giây của Usain Bolt. Nguồn: Reuters — 26/08/2026. Bạn đánh giá tuyên bố này là thật hay giả?",

        context:
            "Bạn bắt gặp tuyên bố này trên mạng xã hội. Hãy đánh giá dựa trên độ chính xác của con số, sự kiện được mô tả và khả năng truy xuất về nguồn gốc.",

        answer: true,

        explanation:
            "Tuyên bố được xác định là THẬT. Thông tin về robot chạy 100 m trong 8,64 giây tại một cuộc thi ở Bắc Kinh đã được Reuters đưa tin ngày 26/08/2026.",

        signal:
            "Con số thành tích có thể được đối chiếu với nguồn báo chí",

        evidence:
            "Reuters, ngày 26/08/2026",

        next:
            "Mở nguồn gốc bài viết và đối chiếu chính xác thành tích 8,64 giây"
    },


    /* =================================================
       CÂU 2
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh2.jpg",
            label: "Kỳ thi tốt nghiệp THPT năm 2026"
        },

        question:
            "Kỳ thi tốt nghiệp THPT năm 2026 có hơn 1,2 triệu thí sinh đăng ký dự thi. Nguồn: Bộ Giáo dục và Đào tạo.  Bạn đánh giá tuyên bố này là thật hay giả?",

        context:
            "Đây là một tuyên bố về số liệu thống kê giáo dục. Hãy xem xét liệu con số được đưa ra có phù hợp với dữ liệu chính thức hay không.",

        answer: true,

        explanation:
            "Tuyên bố được xác định là THẬT. Số lượng thí sinh đăng ký dự thi Kỳ thi tốt nghiệp THPT năm 2026 là 1.223.776, vượt mốc 1,2 triệu.",

        signal:
            "Con số cụ thể có thể đối chiếu với dữ liệu chính thức",

        evidence:
            "Cục Quản lý chất lượng, Bộ Giáo dục và Đào tạo: 1.223.776 thí sinh đăng ký dự thi năm 2026",

        next:
            "Đối chiếu số liệu với công bố chính thức của Bộ GD&ĐT"
    },


    /* =================================================
       CÂU 3
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh3.jpg",
            label: "Hình thức thi tốt nghiệp THPT"
        },

        question:
            "Từ năm 2027, tất cả học sinh THPT trên cả nước sẽ bắt buộc thi tốt nghiệp THPT bằng máy tính. Tuyên bố này là thật hay giả?",

        context:
            "Đây là một tuyên bố về thay đổi chính sách giáo dục trên phạm vi toàn quốc. Hãy đánh giá mức độ đáng tin cậy của tuyên bố trước khi chia sẻ.",

        answer: false,

        explanation:
            "Tuyên bố này được đánh giá là GIẢ trong bài kiểm tra. Chưa có căn cứ chính thức được cung cấp để xác nhận rằng từ năm 2027 toàn bộ học sinh THPT trên cả nước bắt buộc thi tốt nghiệp THPT bằng máy tính.",

        signal:
            "Một thay đổi chính sách lớn cần có văn bản chính thức",

        evidence:
            "Tuyên bố không đi kèm quyết định, thông tư hoặc văn bản chính thức xác nhận nội dung trên",

        next:
            "Tìm thông tin trực tiếp từ Bộ GD&ĐT và các văn bản pháp lý liên quan"
    },


    /* =================================================
       CÂU 4
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh4.jpg",
            label: "Nghiên cứu về việc sử dụng điện thoại"
        },

        question:
            "Một nghiên cứu cho thấy học sinh sử dụng điện thoại trước khi ngủ có nguy cơ mất tập trung trong ngày hôm sau cao hơn 30%. Nguồn: Trung tâm Nghiên cứu Giáo dục — Theo một nghiên cứu mới. Tuyên bố này là thật hay giả?",

        context:
            "Con số 30% nghe có vẻ thuyết phục, nhưng một tuyên bố khoa học cần có nghiên cứu cụ thể để kiểm chứng.",

        answer: false,

        explanation:
            "Tuyên bố được đánh giá là GIẢ trong bài kiểm tra. Con số 30% không thể được xác minh vì không có thông tin cụ thể về nghiên cứu, tác giả, nơi công bố hoặc phương pháp tính toán.",

        signal:
            "Số liệu cụ thể nhưng không thể truy xuất nghiên cứu gốc",

        evidence:
            "Không xác định được nghiên cứu nào tạo ra con số 30%, tác giả và phương pháp tính",

        next:
            "Tìm nghiên cứu gốc và kiểm tra phương pháp thu thập dữ liệu"
    },


    /* =================================================
       CÂU 5
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh5.jpg",
            label: "Dân số Việt Nam"
        },

        question:
            "Việt Nam đã vượt mốc 100 triệu dân và hiện là quốc gia đông dân thứ ba Đông Nam Á. Nguồn: Tổng cục Thống kê — Số liệu dân số. Tuyên bố này là thật hay giả?",

        context:
            "Tuyên bố chứa hai dữ kiện khác nhau: quy mô dân số và thứ hạng trong khu vực. Cả hai đều cần được kiểm tra.",

        answer: true,

        explanation:
            "Tuyên bố được xác định là THẬT theo dữ liệu dùng trong bài kiểm tra.",

        signal:
            "Hai dữ kiện đều có thể đối chiếu bằng số liệu dân số",

        evidence:
            "Dữ liệu dân số của Tổng cục Thống kê được dùng để xác nhận tuyên bố",

        next:
            "Đối chiếu số liệu dân số và thứ hạng các quốc gia Đông Nam Á"
    },


    /* =================================================
       CÂU 6
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh6.jpg",
            label: "Phương thức xét tuyển đại học 2026"
        },

        question:
            "Một số trường đại học Việt Nam tiếp tục sử dụng kết quả SAT như một phương thức xét tuyển trong mùa tuyển sinh 2026. Nguồn: Báo Thanh Niên — Phóng viên Giáo dục. Tuyên bố này là thật hay giả?",

        context:
            "Thông tin liên quan đến phương thức tuyển sinh có thể khác nhau giữa các trường. Không nên suy luận từ một trường sang toàn bộ hệ thống.",

        answer: true,

        explanation:
            "Tuyên bố được xác định là THẬT theo dữ liệu được dùng trong bài kiểm tra. Một số trường đại học Việt Nam tiếp tục sử dụng kết quả SAT trong tuyển sinh 2026.",

        signal:
            "Có thể kiểm tra trực tiếp trong đề án tuyển sinh của từng trường",

        evidence:
            "Thông tin tuyển sinh 2026 được báo Thanh Niên đưa tin về việc sử dụng SAT",

        next:
            "Kiểm tra đề án tuyển sinh chính thức của từng trường"
    },


    /* =================================================
       CÂU 7
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh7.jpg",
            label: "Nhắn tin qua vệ tinh trên iPhone"
        },

        question:
            "Apple vừa ra mắt tính năng nhắn tin qua vệ tinh cho iPhone tại Việt Nam vào tháng 8/2026. Tuyên bố này là thật hay giả?",

        context:
            "Đây là thông tin công nghệ phụ thuộc vào cả thời điểm và quốc gia được hỗ trợ. Một tính năng có thật không đồng nghĩa với việc nó đã có mặt ở mọi thị trường.",

        answer: false,

        explanation:
            "Tuyên bố được đánh giá là GIẢ trong bài kiểm tra. Nội dung dựa trên một công nghệ có thật nhưng thông tin về thời điểm và phạm vi triển khai tại Việt Nam là không chính xác.",

        signal:
            "Phải kiểm tra đồng thời tính năng, thời điểm và quốc gia được hỗ trợ",

        evidence:
            "Thông tin trong tuyên bố không khớp với phạm vi triển khai được xác thực",

        next:
            "Kiểm tra tài liệu hỗ trợ chính thức của Apple cho thị trường Việt Nam"
    },


    /* =================================================
       CÂU 8
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh8.jpg",
            label: "Chương trình Ngữ văn THPT"
        },

        question:
            "Bộ GD&ĐT sẽ bổ sung kỹ năng nhận diện tin giả và kiểm chứng thông tin thành một nội dung bắt buộc trong môn Ngữ văn THPT từ năm học 2026–2027.19/08/2026 — Giáo dục 4.0 — Phạm Linh Tuyên bố này là thật hay giả?",

        context:
            "Nội dung nghe hợp lý vì năng lực kiểm chứng thông tin ngày càng được quan tâm. Tuy nhiên, tính hợp lý không thay thế cho văn bản chính thức.",

        answer: false,

        explanation:
            "Tuyên bố được đánh giá là GIẢ trong bài kiểm tra. Chưa có văn bản chính thức được cung cấp để xác nhận đây là nội dung bắt buộc trong môn Ngữ văn THPT từ năm học 2026–2027.",

        signal:
            "Nội dung chính sách giáo dục cần được xác nhận bằng văn bản chính thức",

        evidence:
            "Bài viết không dẫn tới quyết định, thông tư hoặc tài liệu chính thức của Bộ GD&ĐT xác nhận nội dung này",

             next:
            "Tìm văn bản chính thức của Bộ GD&ĐT và đối chiếu chương trình Ngữ văn"
    },


        /* =================================================
       CÂU 9
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh9.jpg",
            label: "Uống nước chanh vào buổi sáng"
        },

        question:
            "Uống nước chanh vào buổi sáng có thể làm tăng tốc độ trao đổi chất và giúp cơ thể đốt cháy mỡ nhanh hơn. Nguồn: Sống khỏe mỗi ngày — Minh Anh. Tuyên bố này là thật hay giả?",

        context:
            "Tuyên bố đưa ra một tác động sinh lý cụ thể và sử dụng cách diễn đạt mang tính khoa học. Hãy kiểm tra nguồn và bằng chứng nghiên cứu trước khi kết luận.",

        answer: false,

        explanation:
            "Tuyên bố được xác định là SAI. Nguồn “Sống khỏe mỗi ngày — Minh Anh” chưa cho thấy đây là nguồn y khoa đáng tin cậy. Đồng thời, chưa có nghiên cứu nào chứng minh tính hiệu quả của việc này.",

        signal:
            "Nguồn thông tin chưa đủ độ tin cậy",

        evidence:
            "Nguồn “Sống khỏe mỗi ngày — Minh Anh” chưa cho thấy đây là nguồn y khoa đáng tin cậy và chưa có nghiên cứu được dẫn để chứng minh tuyên bố.",

        next:
            "Tìm nghiên cứu y khoa hoặc nguồn học thuật đáng tin cậy trước khi kết luận"
    },

    /* =================================================
       CÂU 10
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh10.jpg",
            label: "Quy định về điện thoại của học sinh"
        },

        question:
            "Bộ GD&ĐT sẽ cấm hoàn toàn học sinh THPT mang điện thoại đến trường từ năm học 2026–2027 để hạn chế sự phụ thuộc vào công nghệ. Nguồn: Thời sự Học đường — Ban Biên tập. Tuyên bố này là thật hay giả?",

        context:
            "Đây là một tuyên bố về chính sách giáo dục trên phạm vi toàn quốc. Hãy kiểm tra cơ quan ban hành, nguồn gốc thông tin và phạm vi áp dụng của quy định trước khi kết luận.",

        answer: false,

        explanation:
            "Tuyên bố được xác định là GIẢ. “Thời sự Học đường” nghe giống một trang tin, nhưng không phải nguồn chính thức của Bộ GD&ĐT. Nội dung cũng mở rộng một quy định có thật thành lệnh cấm hoàn toàn.",

        signal:
            "Nguồn không phải cơ quan chính thức và nội dung bị diễn giải mở rộng",

        evidence:
            "“Thời sự Học đường” không phải nguồn chính thức của Bộ GD&ĐT. Nội dung tuyên bố cũng mở rộng một quy định có thật thành lệnh cấm hoàn toàn.",

        next:
            "Tìm văn bản chính thức của Bộ GD&ĐT và kiểm tra chính xác phạm vi của quy định"
    }

];
    /* =================================================
       QUIZ DOM
    ================================================= */

    const quizCurrent =
        document.getElementById(
            "quizCurrent"
        );

    const quizTotal =
        document.getElementById(
            "quizTotal"
        );

    const quizProgress =
        document.getElementById(
            "quizProgress"
        );

    const quizProgressLabel =
        document.getElementById(
            "quizProgressLabel"
        );

    const quizMedia =
        document.getElementById(
            "quizMedia"
        );

    const quizMediaType =
        document.getElementById(
            "quizMediaType"
        );

    const quizMediaLabel =
        document.getElementById(
            "quizMediaLabel"
        );

    const quizQuestion =
        document.getElementById(
            "quizQuestion"
        );

    const quizContext =
        document.getElementById(
            "quizContext"
        );

    const answerButtons =
        document.querySelectorAll(
            ".answer-button"
        );

    const quizFeedback =
        document.getElementById(
            "quizFeedback"
        );

    const feedbackIcon =
        document.getElementById(
            "feedbackIcon"
        );

    const feedbackTitle =
        document.getElementById(
            "feedbackTitle"
        );

    const feedbackText =
        document.getElementById(
            "feedbackText"
        );

    const feedbackSignal =
        document.getElementById(
            "feedbackSignal"
        );

    const feedbackEvidence =
        document.getElementById(
            "feedbackEvidence"
        );

    const feedbackNext =
        document.getElementById(
            "feedbackNext"
        );

    const nextQuestion =
        document.getElementById(
            "nextQuestion"
        );

    const quizCard =
        document.querySelector(
            ".quiz-card"
        );

    const quizResult =
        document.getElementById(
            "quizResult"
        );

    const scoreRing =
        document.getElementById(
            "scoreRing"
        );

    const scorePercent =
        document.getElementById(
            "scorePercent"
        );

    const resultBadge =
        document.getElementById(
            "resultBadge"
        );

    const resultDescription =
        document.getElementById(
            "resultDescription"
        );

    const resultCorrect =
        document.getElementById(
            "resultCorrect"
        );

    const resultAccuracy =
        document.getElementById(
            "resultAccuracy"
        );

    const resultLevel =
        document.getElementById(
            "resultLevel"
        );

    const restartQuiz =
        document.getElementById(
            "restartQuiz"
        );


    /* =================================================
       QUIZ STATE
    ================================================= */

    quizTotal.textContent =
        quizData.length;


    let questionIndex = 0;

    let score = 0;

    let answered = false;


    /* =================================================
       MEDIA RENDER
    ================================================= */

    function renderQuizMedia(
        media
    ) {

        quizMedia.innerHTML = "";

        quizMediaLabel.textContent =
            media.label ||
            "Nội dung cần phân tích";


        const type =
            media.type;


        switch (type) {

            case "image": {

                quizMediaType.textContent =
                    "HÌNH ẢNH";


                if (!media.src) {
                    renderPlaceholder();
                    break;
                }


                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    media.src;

                image.alt =
                    media.label ||
                    "Hình ảnh câu hỏi";

                image.onerror =
                    renderPlaceholder;


                quizMedia.appendChild(
                    image
                );

                break;
            }


            case "video": {

                quizMediaType.textContent =
                    "VIDEO / DEEPFAKE";


                if (!media.src) {
                    renderPlaceholder();
                    break;
                }


                const video =
                    document.createElement(
                        "video"
                    );

                video.src =
                    media.src;

                video.controls = true;

                video.playsInline = true;

                video.preload = "metadata";


                video.addEventListener(
                    "error",
                    renderPlaceholder
                );


                quizMedia.appendChild(
                    video
                );

                break;
            }


            case "youtube": {

                quizMediaType.textContent =
                    "YOUTUBE VIDEO";


                if (!media.src) {
                    renderPlaceholder(
                        "Chưa có link YouTube"
                    );
                    break;
                }


                const iframe =
                    document.createElement(
                        "iframe"
                    );

                iframe.src =
                    media.src;

                iframe.title =
                    media.label ||
                    "YouTube video";

                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

                iframe.allowFullscreen =
                    true;


                quizMedia.appendChild(
                    iframe
                );

                break;
            }


            default:

                quizMediaType.textContent =
                    "MEDIA";

                renderPlaceholder();

        }

    }


    function renderPlaceholder(
        customText = ""
    ) {

        quizMedia.innerHTML = `
            <div class="media-placeholder">

                <div class="placeholder-icon">
                    ▶
                </div>

                <strong>
                    ${customText || "KHU VỰC MEDIA"}
                </strong>

                <p>
                    Chèn ảnh, video,
                    YouTube hoặc deepfake
                    bằng cách chỉnh
                    dữ liệu trong script.js.
                </p>

            </div>
        `;

    }


    /* =================================================
       LOAD QUESTION
    ================================================= */

    function loadQuestion() {

        const data =
            quizData[questionIndex];


        answered = false;


        quizCurrent.textContent =
            questionIndex + 1;


        const progress =
            Math.round(
                (
                    (questionIndex + 1) /
                    quizData.length
                ) * 100
            );


        quizProgress.style.width =
            `${progress}%`;

        quizProgressLabel.textContent =
            `${progress}%`;


        quizQuestion.textContent =
            data.question;

        quizContext.textContent =
            data.context;


        renderQuizMedia(
            data.media
        );


        quizFeedback.classList.remove(
            "correct",
            "incorrect"
        );


        feedbackIcon.textContent =
            "i";

        feedbackTitle.textContent =
            "Cách suy nghĩ";

        feedbackText.textContent =
            "Hãy tìm dấu hiệu, bằng chứng và nguồn gốc trước khi kết luận.";

        feedbackSignal.textContent =
            "—";

        feedbackEvidence.textContent =
            "—";

        feedbackNext.textContent =
            "—";


        answerButtons.forEach(
            button => {

                button.classList.remove(
                    "selected"
                );

                button.disabled =
                    false;

            }
        );


        nextQuestion.classList.remove(
            "ready"
        );

    }


    /* =================================================
       ANSWER
    ================================================= */

    answerButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (answered) {
                    return;
                }


                answered = true;


                const selectedAnswer =
                    button.dataset.answer ===
                    "true";


                const current =
                    quizData[questionIndex];


                const correct =
                    selectedAnswer ===
                    current.answer;


                if (correct) {
                    score++;
                }


                answerButtons.forEach(
                    item => {

                        item.disabled =
                            true;

                    }
                );


                button.classList.add(
                    "selected"
                );


                feedbackTitle.textContent =
                    correct
                        ? "Chính xác"
                        : "Chưa chính xác";


                feedbackText.textContent =
                    current.explanation;


                feedbackSignal.textContent =
                    current.signal;


                feedbackEvidence.textContent =
                    current.evidence;


                feedbackNext.textContent =
                    current.next;


                feedbackIcon.textContent =
                    correct
                        ? "✓"
                        : "!";


                quizFeedback.classList.remove(
                    "correct",
                    "incorrect"
                );


                quizFeedback.classList.add(
                    correct
                        ? "correct"
                        : "incorrect"
                );


                nextQuestion.classList.add(
                    "ready"
                );


            }
        );

    });


    /* =================================================
       NEXT QUESTION
    ================================================= */

    nextQuestion.addEventListener(
        "click",
        () => {

            if (!answered) {
                return;
            }


            questionIndex++;


            if (
                questionIndex >=
                quizData.length
            ) {

                showQuizResult();

                return;

            }


            loadQuestion();

        }
    );


    /* =================================================
       RESULT
    ================================================= */

    function showQuizResult() {

        const total =
            quizData.length;


        const percentage =
            Math.round(
                (score / total) * 100
            );


        let badge =
            "Tân binh Veritas";

        let description =
            "Bạn nên luyện tập thêm cách kiểm tra nguồn, bằng chứng và bối cảnh.";

        let level =
            "Cần luyện tập";


        if (percentage >= 90) {

            badge =
                "Bậc thầy kiểm chứng";

            description =
                "Bạn có khả năng rất tốt trong việc nhận diện tín hiệu đáng ngờ và truy tìm bằng chứng.";

            level =
                "Xuất sắc";

        } else if (percentage >= 75) {

            badge =
                "Thợ săn tin giả";

            description =
                "Bạn đã hình thành thói quen kiểm tra khá tốt. Hãy tiếp tục rèn luyện khả năng truy xuất nguồn gốc.";

            level =
                "Khá tốt";

        } else if (percentage >= 50) {

            badge =
                "Thám tử thông tin";

            description =
                "Bạn đã có nền tảng nhưng cần cẩn thận hơn với tiêu đề, cảm xúc và nội dung viral.";

            level =
                "Trung bình";

        }


        scoreRing.style.setProperty(
            "--score",
            percentage
        );


        scorePercent.textContent =
            `${percentage}%`;


        resultBadge.textContent =
            badge;


        resultDescription.textContent =
            description;


        resultCorrect.textContent =
            `${score}/${total}`;


        resultAccuracy.textContent =
            `${percentage}%`;


        resultLevel.textContent =
            level;


        quizCard.style.display =
            "none";


        quizResult.classList.add(
            "show"
        );


        setTimeout(
            () => {

                quizResult.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            150
        );

    }


    /* =================================================
       RESTART
    ================================================= */

    restartQuiz.addEventListener(
        "click",
        () => {

            questionIndex = 0;

            score = 0;

            answered = false;


            quizResult.classList.remove(
                "show"
            );


            quizCard.style.display =
                "";


            loadQuestion();


            quizCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );


    loadQuestion();


    /* =================================================
       SIMPLE CARD TILT
    ================================================= */

    const tiltCards =
        document.querySelectorAll(
            ".knowledge-card, .tool-card"
        );


    tiltCards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.matchMedia(
                        "(max-width: 950px)"
                    ).matches
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const rotateX =
                    ((y / rect.height) - .5) *
                    -1.8;


                const rotateY =
                    ((x / rect.width) - .5) *
                    1.8;


                card.style.transform = `
                    translateY(-7px)
                    perspective(800px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });


    /* =================================================
   RESOURCE VIEWER
================================================= */

/* =========================================================
   RESOURCE VIEWER / READER
   ========================================================= */

const resourceModal = document.getElementById("resourceModal");
const resourceModalBody = document.getElementById("resourceModalBody");
const resourceModalTitle = document.getElementById("resourceModalTitle");
const resourceModalClose = document.getElementById("resourceModalClose");
const resourceModalBackdrop = document.querySelector(".resource-modal-backdrop");


/* =========================================================
   READER NỘI BỘ
   ========================================================= */

const internalReaders = {

    brands: {
        label: "PHÂN TÍCH TRUYỀN THÔNG SỐ",
        title: "Vì sao short-form video là dạng nội dung tiềm năng?",
        meta: "Brands Vietnam · Novaon Digital",

        content: `
            <div class="resource-reader-section">

                <h2>Short-form video là gì?</h2>

                <p>
                    Short-form video là dạng video ngắn được thiết kế
                    để truyền tải thông tin nhanh, trực quan và dễ tiếp cận
                    trên các nền tảng số.
                </p>

                <p>
                    Sự phát triển của mạng xã hội đã khiến video ngắn trở thành
                    một trong những hình thức nội dung phổ biến. Người dùng có
                    thể tiếp nhận rất nhiều nội dung chỉ trong một khoảng thời
                    gian ngắn.
                </p>

            </div>

            <div class="resource-reader-highlight">

                <p>
                    Nội dung ngắn và hấp dẫn có thể thu hút sự chú ý rất nhanh,
                    nhưng mức độ viral không đồng nghĩa với độ chính xác.
                </p>

            </div>

            <div class="resource-reader-section">

                <h2>Vì sao video ngắn có sức hút?</h2>

                <ul>
                    <li>Thông tin được trình bày cô đọng.</li>
                    <li>Hình ảnh và âm thanh giúp tăng khả năng thu hút.</li>
                    <li>Người dùng dễ chuyển liên tục giữa các video.</li>
                    <li>Nội dung phù hợp với thói quen sử dụng mạng xã hội.</li>
                </ul>

            </div>

            <div class="resource-reader-section">

                <h2>Bài học kiểm chứng</h2>

                <p>
                    Khi gặp một video ngắn đang viral, không nên sử dụng
                    số lượt xem hoặc lượt thích như bằng chứng cho tính đúng
                    sai của thông tin.
                </p>

                <p>
                    Hãy kiểm tra nguồn, ngày xuất bản, bằng chứng được đưa ra
                    và tìm thêm các nguồn độc lập.
                </p>

            </div>

            <div class="resource-reader-source">

                Đây là bản tóm lược giáo dục của Veritas dựa trên
                bài viết nguồn của Brands Vietnam.

            </div>
        `
    },


    gitnux: {
        label: "MEDIA LITERACY",
        title: "Media Literacy Statistics",
        meta: "Gitnux · Media Literacy Statistics",

        content: `
            <div class="resource-reader-section">

                <h2>Media literacy là gì?</h2>

                <p>
                    Media literacy, hay năng lực truyền thông, là khả năng
                    tiếp cận, phân tích, đánh giá và sử dụng thông tin truyền
                    thông một cách có trách nhiệm.
                </p>

                <p>
                    Trong môi trường số, người dùng phải tiếp nhận thông tin
                    từ mạng xã hội, video, báo chí, quảng cáo, công cụ tìm kiếm
                    và nhiều nguồn khác nhau.
                </p>

            </div>

            <div class="resource-reader-highlight">

                <p>
                    Việc tiếp cận Internet không đồng nghĩa với việc
                    một người có khả năng đánh giá thông tin chính xác.
                </p>

            </div>

            <div class="resource-reader-section">

                <h2>Những vấn đề cần quan tâm</h2>

                <ul>
                    <li>Thông tin có thể lan truyền với tốc độ rất cao.</li>
                    <li>Nội dung hấp dẫn dễ thu hút sự chú ý.</li>
                    <li>Số liệu có thể bị trình bày ngoài ngữ cảnh.</li>
                    <li>Nguồn thông tin cần được kiểm tra trước khi sử dụng.</li>
                </ul>

            </div>

            <div class="resource-reader-section">

                <h2>Liên hệ với việc kiểm chứng</h2>

                <p>
                    Khi nhìn thấy một con số hoặc một thống kê trên Internet,
                    hãy hỏi: dữ liệu đến từ đâu, được thu thập như thế nào,
                    thời điểm nào và có nguồn độc lập nào xác nhận không?
                </p>

            </div>

            <div class="resource-reader-source">

                Nội dung được Veritas trình bày dưới dạng tài liệu học tập
                tóm lược dựa trên chủ đề Media Literacy Statistics.

            </div>
        `
    },


    medialiteracynow: {
        label: "KIẾN THỨC NỀN TẢNG",
        title: "What Is Media Literacy?",
        meta: "Media Literacy Now",

        content: `
            <div class="resource-reader-section">

                <h2>Media literacy là gì?</h2>

                <p>
                    Media literacy là khả năng tiếp cận, phân tích,
                    đánh giá và tạo ra các thông điệp truyền thông
                    trong nhiều hình thức khác nhau.
                </p>

            </div>

            <div class="resource-reader-section">

                <h2>Những câu hỏi quan trọng</h2>

                <ul>
                    <li>Ai tạo ra thông tin này?</li>
                    <li>Mục đích của thông tin là gì?</li>
                    <li>Thông tin muốn tôi tin hoặc làm điều gì?</li>
                    <li>Bằng chứng được đưa ra là gì?</li>
                    <li>Có thông tin nào đang bị bỏ sót không?</li>
                    <li>Có nguồn độc lập nào xác nhận không?</li>
                </ul>

            </div>

            <div class="resource-reader-highlight">

                <p>
                    Media literacy không chỉ là biết sử dụng Internet.
                    Đó là khả năng suy nghĩ có phê phán trước thông tin.
                </p>

            </div>

            <div class="resource-reader-section">

                <h2>Tại sao học sinh cần kỹ năng này?</h2>

                <p>
                    Học sinh hiện nay tiếp nhận thông tin từ video ngắn,
                    mạng xã hội, công cụ tìm kiếm, quảng cáo, người sáng tạo
                    nội dung và các hệ thống AI.
                </p>

                <p>
                    Vì vậy, khả năng đặt câu hỏi và kiểm tra nguồn là một phần
                    quan trọng của năng lực số.
                </p>

            </div>

            <div class="resource-reader-source">

                Bản trình bày học tập của Veritas dựa trên chủ đề
                Media Literacy của Media Literacy Now.

            </div>
        `
    },


    thanhnien: {
        label: "GÓC NHÌN XÃ HỘI",
        title: "Tuyên chiến với các video ngắn độc hại trên mạng xã hội",
        meta: "Báo Thanh Niên · 25/08/2026",

        content: `
            <div class="resource-reader-section">

                <h2>Video ngắn và môi trường thông tin</h2>

                <p>
                    Video ngắn đã trở thành một phần quen thuộc trong đời sống
                    trực tuyến, đặc biệt với người trẻ.
                </p>

                <p>
                    Bên cạnh những nội dung hữu ích, môi trường này cũng có thể
                    xuất hiện nội dung giật gân, phản cảm, sai lệch hoặc gây
                    ảnh hưởng tiêu cực.
                </p>

            </div>

            <div class="resource-reader-highlight">

                <p>
                    Mục tiêu không phải là phủ nhận video ngắn,
                    mà là giúp người dùng chủ động hơn trước dòng thông tin.
                </p>

            </div>

            <div class="resource-reader-section">

                <h2>Sức đề kháng số</h2>

                <ul>
                    <li>Không đánh giá thông tin chỉ bằng lượt xem.</li>
                    <li>Không mặc định nội dung viral là nội dung đúng.</li>
                    <li>Kiểm tra nguồn và ngày xuất bản.</li>
                    <li>Tìm thêm nguồn độc lập.</li>
                    <li>Dừng lại trước khi chia sẻ thông tin đáng ngờ.</li>
                </ul>

            </div>

            <div class="resource-reader-section">

                <h2>Bài học cho người dùng trẻ</h2>

                <p>
                    Thay vì chỉ hỏi "Có nhiều người xem không?",
                    hãy hỏi "Ai tạo ra?", "Nguồn ở đâu?",
                    "Bằng chứng là gì?" và "Nguồn nào độc lập có thể xác nhận?"
                </p>

            </div>

            <div class="resource-reader-source">

                Bản tóm lược học tập của Veritas dựa trên bài viết
                của Báo Thanh Niên.

            </div>
        `
    }

};


/* =========================================================
   MỞ RESOURCE MODAL
   ========================================================= */

function openResourceModal(type, url, title, readerId) {

    if (!resourceModal || !resourceModalBody) {
        console.error(
            "Veritas: Không tìm thấy resourceModal."
        );
        return;
    }

    resourceModalBody.innerHTML = "";

    if (resourceModalTitle) {
        resourceModalTitle.textContent =
            title || "Nội dung";
    }


    /* =====================================================
       YOUTUBE
    ===================================================== */

    if (type === "youtube") {

        let videoId = "";

        try {

            const parsedUrl =
                new URL(url);

            if (
                parsedUrl.hostname.includes(
                    "youtu.be"
                )
            ) {

                videoId =
                    parsedUrl.pathname
                        .replace(/^\/+/, "")
                        .split("/")[0];

            } else if (
                parsedUrl.pathname.includes(
                    "/embed/"
                )
            ) {

                videoId =
                    parsedUrl.pathname
                        .split("/embed/")[1]
                        .split("/")[0];

            } else {

                videoId =
                    parsedUrl.searchParams.get("v") ||
                    "";

            }

        } catch (error) {

            console.error(
                "Không đọc được YouTube URL:",
                url
            );

        }


        /* -------------------------------------------------
           KHÔNG CÓ VIDEO ID
        ------------------------------------------------- */

        if (!videoId) {

            resourceModalBody.innerHTML = `
                <div class="resource-reader">

                    <h1>
                        Không thể tải video
                    </h1>

                    <div class="resource-reader-section">

                        <p>
                            Không xác định được mã video YouTube.
                        </p>

                    </div>

                </div>
            `;

        } else {

            /* ---------------------------------------------
               WRAPPER VIDEO
            --------------------------------------------- */

            const videoFrame =
                document.createElement("div");

            videoFrame.className =
                "youtube-resource-frame";


            /* ---------------------------------------------
               IFRAME
            --------------------------------------------- */

            const iframe =
                document.createElement("iframe");

            iframe.className =
                "youtube-resource-iframe";


            /* ---------------------------------------------
               YOUTUBE URL
            --------------------------------------------- */

           iframe.src =
    `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&iv_load_policy=3`;

            iframe.title =
                title || "YouTube video";


            /* ---------------------------------------------
               QUYỀN YOUTUBE
            --------------------------------------------- */

            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";

            iframe.allowFullscreen = true;

            iframe.setAttribute(
                "frameborder",
                "0"
            );

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );


            /* ---------------------------------------------
               ĐƯA IFRAME VÀO WRAPPER
            --------------------------------------------- */

            videoFrame.appendChild(
                iframe
            );

            resourceModalBody.appendChild(
                videoFrame
            );

        }

    }


    /* =====================================================
       NGHIÊN CỨU FULL-TEXT
    ===================================================== */

    else if (type === "research") {

        const loading =
            document.createElement("div");

        loading.className =
            "resource-modal-loading";

        loading.textContent =
            "Đang tải nghiên cứu...";

        resourceModalBody.appendChild(
            loading
        );


        const iframe =
            document.createElement("iframe");

        iframe.src =
            url;

        iframe.title =
            title || "Nghiên cứu";

        iframe.loading =
            "eager";

        iframe.referrerPolicy =
            "strict-origin-when-cross-origin";


        iframe.addEventListener(
            "load",
            () => {

                loading.remove();

            }
        );


        resourceModalBody.appendChild(
            iframe
        );

    }


    /* =====================================================
       READER NỘI BỘ VERITAS
    ===================================================== */

    else if (type === "reader") {

        const reader =
            internalReaders[readerId];


        if (!reader) {

            resourceModalBody.innerHTML = `

                <article class="resource-reader">

                    <div class="resource-reader-label">
                        VERITAS
                    </div>

                    <h1>
                        Không tìm thấy tài liệu
                    </h1>

                    <div class="resource-reader-section">

                        <p>
                            Không tìm thấy Reader
                            có mã:
                            <strong>
                                ${readerId}
                            </strong>
                        </p>

                    </div>

                </article>

            `;

        } else {

            resourceModalBody.innerHTML = `

                <article class="resource-reader">

                    <div class="resource-reader-label">
                        ${reader.label}
                    </div>

                    <h1>
                        ${reader.title}
                    </h1>

                    <div class="resource-reader-meta">

                        <span>
                            ${reader.meta}
                        </span>

                    </div>

                    ${reader.content}

                </article>

            `;

        }

    }


    /* =====================================================
       HIỂN THỊ MODAL
    ===================================================== */

    resourceModal.classList.add(
        "active"
    );

    resourceModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}
/* =========================================================
   ĐÓNG RESOURCE MODAL
   ========================================================= */

function closeResourceModal() {

    if (!resourceModal) {
        return;
    }

    resourceModal.classList.remove(
        "active"
    );

    resourceModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    if (resourceModalBody) {
        resourceModalBody.innerHTML = "";
    }
}


/* =========================================================
   RESOURCE LINK CLICK
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const trigger =
            event.target.closest(
                ".resource-link, .cover-play"
            );

        if (!trigger) {
            return;
        }

        const card =
            trigger.closest(
                ".resource-card"
            );

        if (!card) {
            return;
        }

        let sourceButton = trigger;

        if (
            trigger.classList.contains(
                "cover-play"
            )
        ) {

            sourceButton =
                card.querySelector(
                    ".resource-link"
                );

            if (!sourceButton) {
                return;
            }
        }

        const type =
            sourceButton.dataset.resourceType ||
            "reader";

        const url =
            sourceButton.dataset.resourceUrl ||
            "";

        const readerId =
            sourceButton.dataset.readerId ||
            "";

        const title =
            card
                .querySelector(
                    ".resource-body h3"
                )
                ?.textContent
                .trim() ||
            "Nội dung";

        openResourceModal(
            type,
            url,
            title,
            readerId
        );
    }
);


/* =========================================================
   NÚT ĐÓNG
   ========================================================= */

if (resourceModalClose) {

    resourceModalClose.addEventListener(
        "click",
        closeResourceModal
    );

}


if (resourceModalBackdrop) {

    resourceModalBackdrop.addEventListener(
        "click",
        closeResourceModal
    );

}


/* =========================================================
   PHÍM ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            resourceModal &&
            resourceModal.classList.contains(
                "active"
            )
        ) {

            closeResourceModal();

        }

    }
);


/* =================================================
   REDUCE MOTION
================================================= */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reduceMotion.matches) {

        document
            .querySelectorAll("*")
            .forEach(element => {

                element.style.animationDuration =
                    "0.01ms";

                element.style.transitionDuration =
                    "0.01ms";

            });

    }
/* =====================================================
   SIFT FEATURED VIDEO SERIES
===================================================== */

const siftFeaturedVideo =
    document.getElementById("siftFeaturedVideo");

const siftVideoItems =
    document.querySelectorAll(".sift-video-item");

if (
    siftFeaturedVideo &&
    siftVideoItems.length
) {

    siftVideoItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const videoId =
                    item.dataset.siftVideo;

                const videoTitle =
                    item.dataset.siftTitle ||
                    "SIFT Online Verification Skills";

                if (!videoId) {
                    return;
                }


                /* -----------------------------------------
                   ĐỔI VIDEO
                ----------------------------------------- */

                siftFeaturedVideo.src =
                    `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`;


                /* -----------------------------------------
                   ĐỔI TITLE
                ----------------------------------------- */

                siftFeaturedVideo.title =
                    videoTitle;


                /* -----------------------------------------
                   ACTIVE STATE
                ----------------------------------------- */

                siftVideoItems.forEach(
                    videoItem => {
                        videoItem.classList.remove(
                            "active"
                        );
                    }
                );

                item.classList.add(
                    "active"
                );

            }
        );

    });

}
/* =========================================================
   VERITAS — FOUNDATION KNOWLEDGE HUB
========================================================= */


/* =========================================================
   SCROLL REVEAL
========================================================= */

const foundationRevealItems =
    document.querySelectorAll(
        ".foundation-hub-section .reveal-up"
    );


if (
    foundationRevealItems.length &&
    "IntersectionObserver" in window
) {

    const foundationRevealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "is-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );


    foundationRevealItems.forEach(item => {

        foundationRevealObserver.observe(
            item
        );

    });

}


/* =========================================================
   COUNTER ANIMATION
========================================================= */

const foundationCounters =
    document.querySelectorAll(
        ".foundation-stat strong[data-count]"
    );


function animateFoundationCounter(element) {

    const target =
        Number(
            element.dataset.count || 0
        );

    let current = 0;

    const duration = 900;

    const startTime =
        performance.now();


    function updateCounter(now) {

        const progress =
            Math.min(
                (now - startTime) / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        current =
            Math.floor(
                target * eased
            );


        element.textContent =
            String(current).padStart(2, "0");


        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        } else {

            element.textContent =
                String(target).padStart(2, "0");

        }

    }


    requestAnimationFrame(
        updateCounter
    );

}


if (
    foundationCounters.length &&
    "IntersectionObserver" in window
) {

    let countersAnimated = false;


    const foundationCounterObserver =
        new IntersectionObserver(
            entries => {

                if (
                    countersAnimated ||
                    !entries.some(
                        entry =>
                            entry.isIntersecting
                    )
                ) {

                    return;

                }


                countersAnimated = true;


                foundationCounters.forEach(
                    (counter, index) => {

                        setTimeout(
                            () => {

                                animateFoundationCounter(
                                    counter
                                );

                            },
                            index * 130
                        );

                    }
                );


                foundationCounterObserver.disconnect();

            },
            {
                threshold: .4
            }
        );


    foundationCounterObserver.observe(
        foundationCounters[0]
    );

}


/* =========================================================
   ACCORDION
========================================================= */

const foundationExpandButtons =
    document.querySelectorAll(
        ".foundation-hub-section .foundation-expand-btn"
    );


foundationExpandButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const isExpanded =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";


            foundationExpandButtons.forEach(
                otherButton => {

                    if (
                        otherButton !== button
                    ) {

                        otherButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );


            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

        }
    );

});


/* =========================================================
   FOUNDATION FILTER
========================================================= */

const foundationFilterButtons =
    document.querySelectorAll(
        ".foundation-filter-btn"
    );


const foundationItems =
    document.querySelectorAll(
        ".foundation-item"
    );


foundationFilterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const filter =
                (
                    button.dataset
                        .foundationFilter ||
                    "all"
                ).trim();


            foundationFilterButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            foundationItems.forEach(
                item => {

                    const category =
                        item.dataset
                            .foundationCategory ||
                        "";


                    const shouldShow =
                        filter === "all" ||
                        category === filter;


                    if (shouldShow) {

                        item.classList.remove(
                            "is-hidden"
                        );

                        item.classList.remove(
                            "filter-enter"
                        );

                        void item.offsetWidth;

                        item.classList.add(
                            "filter-enter"
                        );

                    } else {

                        item.classList.add(
                            "is-hidden"
                        );

                    }

                }
            );

        }
    );

});


/* =========================================================
   INFORMATION DISORDER TABS
========================================================= */

const disorderTabs =
    document.querySelectorAll(
        ".foundation-disorder-tab"
    );


const disorderPanels =
    document.querySelectorAll(
        ".foundation-disorder-panel"
    );


disorderTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            const target =
                tab.dataset.disorder;


            disorderTabs.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            disorderPanels.forEach(panel => {

                panel.classList.remove(
                    "active"
                );

            });


            tab.classList.add(
                "active"
            );


            const targetPanel =
                document.querySelector(
                    `[data-disorder-panel="${target}"]`
                );


            if (targetPanel) {

                targetPanel.classList.add(
                    "active"
                );

            }

        }
    );

});


/* =========================================================
   FEATURED IMAGE PARALLAX
========================================================= */

const foundationVisual =
    document.querySelector(
        ".foundation-featured-visual"
    );


const foundationImage =
    document.querySelector(
        ".foundation-image-shell img"
    );


if (
    foundationVisual &&
    foundationImage &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    foundationVisual.addEventListener(
        "mousemove",
        event => {

            const rect =
                foundationVisual.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width -
                .5;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height -
                .5;


            foundationImage.style.transform =
                `
                scale(1.08)
                translate(
                    ${x * 8}px,
                    ${y * 8}px
                )
                `;

        }
    );


    foundationVisual.addEventListener(
        "mouseleave",
        () => {

            foundationImage.style.transform =
                "scale(1.04)";

        }
    );

}


/* =========================================================
   FOUNDATION 3D TILT
========================================================= */

const foundationTiltCards =
    document.querySelectorAll(
        ".foundation-knowledge-card"
    );


foundationTiltCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (
                !window.matchMedia(
                    "(pointer:fine)"
                ).matches
            ) {

                return;

            }


            const rect =
                card.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width -
                .5;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height -
                .5;


            card.style.transform =
                `
                perspective(1000px)
                rotateX(${y * -3}deg)
                rotateY(${x * 3}deg)
                translateY(-9px)
                `;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});


/* =========================================================
   ACTIVE DISORDER AUTO HINT
========================================================= */

const disorderCard =
    document.querySelector(
        ".foundation-information-card"
    );


if (disorderCard) {

    let disorderIndex = 0;

    const disorderNames = [
        "misinformation",
        "disinformation",
        "malinformation"
    ];


    setInterval(
        () => {

            if (
                document.visibilityState !==
                "visible"
            ) {

                return;

            }


            disorderIndex =
                (
                    disorderIndex + 1
                ) %
                disorderNames.length;


            const target =
                disorderNames[
                    disorderIndex
                ];


            const targetTab =
                disorderCard.querySelector(
                    `[data-disorder="${target}"]`
                );


            if (targetTab) {

                targetTab.click();

            }

        },
        6000
    );

}


/* =========================================================
   ACTIVE SECTION GLOW
========================================================= */

const foundationSection =
    document.querySelector(
        ".foundation-hub-section"
    );


if (
    foundationSection &&
    "IntersectionObserver" in window
) {

    const foundationSectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    foundationSection.classList.toggle(
                        "is-active-view",
                        entry.isIntersecting
                    );

                });

            },
            {
                threshold: .12
            }
        );


    foundationSectionObserver.observe(
        foundationSection
    );

}
});
