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
        .method-layout,
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
       LIBRARY FILTER
    ================================================= */

    const libraryTabs =
        document.querySelectorAll(
            ".library-tab"
        );

    const resourceCards =
        document.querySelectorAll(
            ".resource-card"
        );

    const librarySearch =
        document.getElementById(
            "librarySearch"
        );

    const emptyResults =
        document.getElementById(
            "emptyResults"
        );


    let activeLibraryCategory =
        "all";


    function filterLibrary() {

        const keyword =
            librarySearch
                .value
                .trim()
                .toLowerCase();

        let visibleCount = 0;


        resourceCards.forEach(card => {

            const category =
                card.dataset.category || "";

            const searchable =
                card.dataset.search || "";

            const categoryMatch =
                activeLibraryCategory ===
                "all" ||
                category ===
                activeLibraryCategory;

            const searchMatch =
                searchable
                    .toLowerCase()
                    .includes(keyword);


            const show =
                categoryMatch &&
                searchMatch;


            card.classList.toggle(
                "hidden",
                !show
            );


            if (show) {
                visibleCount++;
            }

        });


        emptyResults.classList.toggle(
            "show",
            visibleCount === 0
        );

    }


    libraryTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                libraryTabs.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                tab.classList.add(
                    "active"
                );


                activeLibraryCategory =
                    tab.dataset.category;


                filterLibrary();

            }
        );

    });


    librarySearch.addEventListener(
        "input",
        filterLibrary
    );


    /* =================================================
       RESOURCE MODAL
    ================================================= */

    const contentModal =
        document.getElementById(
            "contentModal"
        );

    const modalOverlay =
        document.getElementById(
            "modalOverlay"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );

    const modalText =
        document.getElementById(
            "modalText"
        );

    const resourceLinks =
        document.querySelectorAll(
            ".resource-link"
        );

    const featuredOpen =
        document.getElementById(
            "featuredOpen"
        );


    const modalData = {

        video: {
            title:
                "Khu vực Video",
            text:
                "Bạn có thể thay khu vực này bằng iframe YouTube hoặc video riêng của dự án."
        },

        guide: {
            title:
                "Khu vực Hướng dẫn",
            text:
                "Dùng khu vực này để đưa tài liệu PDF, bài đọc hoặc hướng dẫn kiểm chứng."
        },

        research: {
            title:
                "Khu vực Nghiên cứu",
            text:
                "Bạn có thể gắn tài liệu học thuật, bài nghiên cứu hoặc đường dẫn nguồn."
        },

        deepfake: {
            title:
                "Khu vực Deepfake",
            text:
                "Đây là nơi phù hợp để đưa video, hình ảnh hoặc case study về deepfake."
        },

        critical: {
            title:
                "Khu vực Tư duy phản biện",
            text:
                "Dùng để chèn bài đọc, tình huống hoặc hoạt động thực hành."
        },

        featured: {
            title:
                "Nội dung nổi bật",
            text:
                "Khu vực này có thể thay bằng video YouTube, video local hoặc một tài liệu quan trọng."
        }

    };


    function openModal(
        type = "featured"
    ) {

        const data =
            modalData[type] ||
            modalData.featured;


        modalTitle.textContent =
            data.title;

        modalText.textContent =
            data.text;


        contentModal.classList.add(
            "active"
        );

        contentModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    function closeModal() {

        contentModal.classList.remove(
            "active"
        );

        contentModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }


    resourceLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                openModal(
                    link.dataset.resource
                );

            }
        );

    });


    featuredOpen.addEventListener(
        "click",
        () => {
            openModal("featured");
        }
    );


    modalClose.addEventListener(
        "click",
        closeModal
    );

    modalOverlay.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                contentModal.classList.contains(
                    "active"
                )
            ) {
                closeModal();
            }

        }
    );


    /* =================================================
       METHODS
    ================================================= */

    const methodItems =
        document.querySelectorAll(
            ".method-item"
        );

    const methodCodeLabel =
        document.getElementById(
            "methodCodeLabel"
        );

    const methodIndex =
        document.getElementById(
            "methodIndex"
        );

    const methodLetter =
        document.getElementById(
            "methodLetter"
        );

    const methodTag =
        document.getElementById(
            "methodTag"
        );

    const methodTitle =
        document.getElementById(
            "methodTitle"
        );

    const methodDescription =
        document.getElementById(
            "methodDescription"
        );

    const methodPoints =
        document.getElementById(
            "methodPoints"
        );

    const methodTip =
        document.getElementById(
            "methodTip"
        );


    const methods = {

        sift: {

            code: "SIFT",

            letter: "S",

            tag:
                "QUICK VERIFICATION",

            title:
                "SIFT — 4 hành động kiểm chứng nhanh.",

            description:
                "Một quy trình gồm Stop, Investigate, Find và Trace, giúp bạn xử lý một tuyên bố nhanh và có hệ thống.",

            points: [
                "Stop — Dừng lại",
                "Investigate — Điều tra nguồn",
                "Find — Tìm nguồn tốt hơn",
                "Trace — Truy xuất bối cảnh"
            ],

            tip:
                "Phù hợp khi bạn cần nhanh chóng xác định mình nên kiểm tra điều gì trước."
        },


        craap: {

            code: "CRAAP",

            letter: "C",

            tag:
                "SOURCE EVALUATION",

            title:
                "CRAAP — Đánh giá chất lượng nguồn.",

            description:
                "Có thể sử dụng các tiêu chí Currency, Relevance, Authority, Accuracy và Purpose để xem một nguồn có phù hợp với nhu cầu hay không.",

            points: [
                "Currency — Tính cập nhật",
                "Relevance — Mức độ liên quan",
                "Authority — Thẩm quyền",
                "Accuracy — Độ chính xác",
                "Purpose — Mục đích"
            ],

            tip:
                "Hữu ích khi bạn đang đánh giá một website, bài viết hoặc tài liệu."
        },


        lateral: {

            code: "LATERAL",

            letter: "L",

            tag:
                "CROSS-CHECK",

            title:
                "Lateral Reading — Đọc ngang.",

            description:
                "Thay vì chỉ đọc sâu một trang, hãy mở thêm các nguồn khác để kiểm tra tổ chức, tác giả hoặc tuyên bố đang được đề cập.",

            points: [
                "Mở nhiều nguồn",
                "Tìm nguồn độc lập",
                "So sánh cách giải thích",
                "Xác định điểm đồng thuận"
            ],

            tip:
                "Rất hữu ích với các website hoặc tài khoản mà bạn chưa từng biết."
        },


        reverse: {

            code: "REVERSE",

            letter: "R",

            tag:
                "VISUAL VERIFICATION",

            title:
                "Reverse Image Search — Tìm kiếm ngược hình ảnh.",

            description:
                "Dùng công cụ tìm kiếm hình ảnh để xem một hình ảnh xuất hiện ở đâu, được đăng từ khi nào và trong bối cảnh nào.",

            points: [
                "Tải ảnh lên",
                "Tìm các bản sao",
                "Kiểm tra thời điểm",
                "Đối chiếu bối cảnh"
            ],

            tip:
                "Đặc biệt hữu ích khi một hình ảnh được chia sẻ với chú thích mới."
        },


        date: {

            code: "DATE",

            letter: "D",

            tag:
                "CONTEXT CHECK",

            title:
                "Check the Date — Kiểm tra thời điểm.",

            description:
                "Một nội dung cũ có thể được chia sẻ lại như một sự kiện mới. Kiểm tra ngày xuất hiện đầu tiên giúp xác định bối cảnh.",

            points: [
                "Kiểm tra ngày đăng",
                "Tìm phiên bản cũ",
                "Đối chiếu sự kiện",
                "Xác định bối cảnh thời gian"
            ],

            tip:
                "Đừng chỉ hỏi 'Điều này có thật không?', hãy hỏi 'Điều này xảy ra khi nào?'"
        },


        source: {

            code: "SOURCE",

            letter: "E",

            tag:
                "SOURCE ANALYSIS",

            title:
                "Source Evaluation — Đánh giá nguồn.",

            description:
                "Phân tích ai tạo ra nội dung, họ có chuyên môn gì, mục đích gì và có cung cấp bằng chứng để người đọc kiểm tra hay không.",

            points: [
                "Ai tạo nội dung?",
                "Nguồn có chuyên môn?",
                "Có bằng chứng?",
                "Mục đích là gì?"
            ],

            tip:
                "Nguồn là một phần quan trọng của bằng chứng, nhưng nguồn tốt vẫn cần được kiểm tra."
        }

    };


    const methodOrder = [
        "sift",
        "craap",
        "lateral",
        "reverse",
        "date",
        "source"
    ];


    function showMethod(
        methodKey
    ) {

        const method =
            methods[methodKey];

        if (!method) {
            return;
        }


        methodItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.method ===
                methodKey
            );

        });


        const index =
            methodOrder.indexOf(
                methodKey
            ) + 1;


        methodCodeLabel.textContent =
            method.code;

        methodIndex.textContent =
            `${String(index).padStart(2, "0")} / 06`;

        methodLetter.textContent =
            method.letter;

        methodTag.textContent =
            method.tag;

        methodTitle.textContent =
            method.title;

        methodDescription.textContent =
            method.description;

        methodTip.textContent =
            method.tip;


        methodPoints.innerHTML =
            method.points
                .map(
                    (point, pointIndex) => `
                        <div>
                            <span>
                                ${String(
                                    pointIndex + 1
                                ).padStart(2, "0")}
                            </span>

                            ${point}
                        </div>
                    `
                )
                .join("");

    }


    methodItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                showMethod(
                    item.dataset.method
                );

            }
        );

    });


    showMethod("sift");


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

        {
            media: {
                type: "image",
                src:
                    "assets/quiz/question-01.jpg",
                label:
                    "Hình ảnh mạng xã hội"
            },

            question:
                "Một bài đăng khẳng định: \"90% chuyên gia đã xác nhận thông tin này\", nhưng không có tên chuyên gia hay nghiên cứu nào được dẫn.",

            context:
                "Bạn thấy bài đăng có số liệu rất cụ thể nhưng không thể truy ra nguồn gốc.",

            answer: false,

            explanation:
                "Con số phần trăm không tự tạo ra độ tin cậy. Khi không biết 90% được tính từ đâu, ai tham gia và nghiên cứu nào đứng phía sau, tuyên bố chưa có đủ bằng chứng.",

            signal:
                "Số liệu thiếu nguồn",

            evidence:
                "Không có nghiên cứu hoặc danh sách chuyên gia để kiểm tra",

            next:
                "Tìm nguyên văn tuyên bố và nguồn thống kê"
        },


        {
            media: {
                type: "video",
                src:
                    "assets/quiz/deepfake-01.mp4",
                label:
                    "Video deepfake AI"
            },

            question:
                "Video cho thấy một nhân vật phát biểu rất tự nhiên, nhưng chuyển động môi, ánh sáng trên khuôn mặt và vùng tóc có nhiều điểm bất thường.",

            context:
                "Bạn chưa có bằng chứng độc lập xác nhận video là thật hoặc giả.",

            answer: false,

            explanation:
                "Các dấu hiệu trực quan chỉ cho thấy video đáng nghi, không đủ để kết luận tuyệt đối. Bước tiếp theo nên là tìm nguồn gốc video và kiểm tra bằng các nguồn độc lập.",

            signal:
                "Bất thường hình ảnh",

            evidence:
                "Môi, ánh sáng và vùng tóc có dấu hiệu không nhất quán",

            next:
                "Truy xuất video gốc và đối chiếu nguồn"
        },


        {
            media: {
                type: "youtube",
                src:
                    "",
                label:
                    "Video YouTube"
            },

            question:
                "Một video cũ được đăng lại với chú thích rằng sự kiện vừa xảy ra trong ngày hôm nay.",

            context:
                "Hình ảnh trong video phù hợp với sự kiện, nhưng thời điểm được ghi trong bài đăng khiến bạn nghi ngờ.",

            answer: false,

            explanation:
                "Nội dung có thể là video thật nhưng được đặt vào bối cảnh sai. Đây là lý do cần kiểm tra ngày xuất hiện và nguồn gốc ban đầu.",

            signal:
                "Sai bối cảnh thời gian",

            evidence:
                "Video được đăng từ trước thời điểm sự kiện được mô tả",

            next:
                "Dùng Reverse Search và kiểm tra ngày"
        },


        {
            media: {
                type: "placeholder",
                label:
                    "Bài viết cần xác minh"
            },

            question:
                "Một bài viết không ghi tên tác giả, không có ngày cập nhật và không dẫn bất kỳ nguồn dữ liệu nào.",

            context:
                "Nội dung viết rất thuyết phục nhưng bạn không thể kiểm tra ai chịu trách nhiệm về tuyên bố.",

            answer: false,

            explanation:
                "Một văn bản thuyết phục vẫn cần nguồn để người đọc kiểm tra. Việc thiếu tác giả, thời gian và nguồn tham khảo làm giảm khả năng xác minh độc lập.",

            signal:
                "Nguồn không rõ",

            evidence:
                "Không có tác giả, ngày hoặc tài liệu gốc",

            next:
                "Điều tra website và tìm nguồn độc lập"
        },


        {
            media: {
                type: "image",
                src:
                    "assets/quiz/question-05.jpg",
                label:
                    "Ảnh được chia sẻ lại"
            },

            question:
                "Một hình ảnh được chia sẻ với chú thích về một sự kiện mới, nhưng khi tìm kiếm ngược, ảnh xuất hiện trong các bài viết từ nhiều năm trước.",

            context:
                "Hình ảnh là thật nhưng có vẻ đã bị đưa vào một bối cảnh khác.",

            answer: false,

            explanation:
                "Một hình ảnh có thể hoàn toàn xác thực nhưng cách sử dụng hiện tại vẫn gây hiểu lầm nếu nó được gắn với một sự kiện khác.",

            signal:
                "Ảnh thật, bối cảnh sai",

            evidence:
                "Nguồn cũ cho thấy ảnh xuất hiện ở một sự kiện khác",

            next:
                "Tìm nguồn ảnh đầu tiên"
        },


        {
            media: {
                type: "placeholder",
                label:
                    "Bài kiểm chứng"
            },

            question:
                "Một bài fact-check đưa ra tuyên bố, dẫn tài liệu gốc và trình bày cách dữ liệu được dùng để đi đến kết luận.",

            context:
                "Người đọc có thể mở nguồn và tự kiểm tra phần bằng chứng.",

            answer: true,

            explanation:
                "Một nội dung kiểm chứng mạnh thường cho phép truy ngược từ kết luận về tuyên bố, dữ liệu và tài liệu nguồn.",

            signal:
                "Có thể truy xuất bằng chứng",

            evidence:
                "Tài liệu gốc được dẫn trực tiếp",

            next:
                "Mở nguồn và kiểm tra lại dữ liệu"
        },


        {
            media: {
                type: "image",
                src:
                    "assets/quiz/question-07.jpg",
                label:
                    "Ảnh chứa thông tin thống kê"
            },

            question:
                "Một infographic có biểu đồ nhưng trục dữ liệu bị cắt khiến mức chênh lệch giữa hai cột trông lớn hơn rất nhiều.",

            context:
                "Con số có thể đúng, nhưng cách trình bày khiến người xem dễ hiểu sai.",

            answer: true,

            explanation:
                "Thông tin có thể không hoàn toàn sai nhưng vẫn gây hiểu lầm do cách trực quan hóa dữ liệu. Cần xem dữ liệu gốc thay vì chỉ nhìn đồ họa.",

            signal:
                "Cách trình bày gây thiên lệch",

            evidence:
                "Trục biểu đồ bị thay đổi",

            next:
                "Xem bảng số liệu gốc"
        },


        {
            media: {
                type: "youtube",
                src:
                    "",
                label:
                    "Video đang lan truyền"
            },

            question:
                "Một đoạn video được chia sẻ rất mạnh trên mạng xã hội, nhưng không có nguồn ban đầu và không rõ ai quay video.",

            context:
                "Nhiều lượt chia sẻ không cung cấp thêm bằng chứng về nguồn gốc.",

            answer: false,

            explanation:
                "Độ phổ biến không phải là bằng chứng. Video cần được truy xuất về nguồn ban đầu trước khi xác định bối cảnh và tính xác thực.",

            signal:
                "Thiếu nguồn gốc",

            evidence:
                "Không xác định được người tạo hoặc video gốc",

            next:
                "Tìm phiên bản đầu tiên"
        },


        {
            media: {
                type: "placeholder",
                label:
                    "Tuyên bố cần đối chiếu"
            },

            question:
                "Hai nguồn độc lập cùng dẫn một tài liệu sơ cấp để mô tả cùng một sự kiện và dữ liệu trong tài liệu có thể kiểm tra.",

            context:
                "Bạn vẫn nên kiểm tra tài liệu gốc thay vì chỉ dựa vào hai bài báo.",

            answer: true,

            explanation:
                "Sự nhất quán giữa nhiều nguồn độc lập là tín hiệu hữu ích, nhưng việc truy xuất về nguồn sơ cấp vẫn là bước mạnh hơn để kiểm tra chi tiết.",

            signal:
                "Nhiều nguồn độc lập",

            evidence:
                "Cùng dẫn một nguồn sơ cấp",

            next:
                "Mở tài liệu gốc"
        },


        {
            media: {
                type: "image",
                src:
                    "assets/quiz/question-10.jpg",
                label:
                    "Ảnh AI / Deepfake"
            },

            question:
                "Một bức ảnh có bàn tay và chữ trên nền bị biến dạng. Bạn kết luận ngay rằng ảnh chắc chắn là deepfake.",

            context:
                "Bạn mới phát hiện một số dấu hiệu bất thường bằng mắt thường.",

            answer: false,

            explanation:
                "Dấu hiệu bất thường chỉ là lý do để kiểm tra thêm. Không nên biến một dấu hiệu thành kết luận tuyệt đối nếu chưa có bằng chứng khác.",

            signal:
                "Kết luận quá sớm",

            evidence:
                "Chỉ có dấu hiệu trực quan",

            next:
                "Reverse Search và đối chiếu nguồn"
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

});