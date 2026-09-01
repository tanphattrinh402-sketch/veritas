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
            "Một robot hình người được cho là đã hoàn thành quãng đường 100 m trong 8,64 giây tại một cuộc thi ở Bắc Kinh. Thành tích này được so sánh với kỷ lục 9,58 giây ở nội dung 100 m của Usain Bolt. Tuyên bố trên là thật hay giả?",

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
            "Có thông tin cho rằng số người đăng ký dự thi Kỳ thi tốt nghiệp THPT năm 2026 đã vượt mốc một triệu người và lên tới hơn 1,2 triệu. Bạn đánh giá tuyên bố này là thật hay giả?",

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
            "Một bài đăng khẳng định rằng bắt đầu từ năm 2027, toàn bộ học sinh THPT trên cả nước sẽ bắt buộc thực hiện kỳ thi tốt nghiệp THPT bằng máy tính. Tuyên bố này là thật hay giả?",

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
            "Một bài viết cho biết học sinh sử dụng điện thoại trước khi ngủ có nguy cơ mất tập trung vào ngày hôm sau cao hơn 30%. Tuyên bố này là thật hay giả?",

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
            "Một bài đăng cho rằng Việt Nam đã vượt mốc 100 triệu dân và hiện đứng thứ ba Đông Nam Á về quy mô dân số. Tuyên bố này là thật hay giả?",

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
            "Trong mùa tuyển sinh năm 2026, một số trường đại học tại Việt Nam vẫn sử dụng điểm SAT như một phương thức xét tuyển. Tuyên bố này là thật hay giả?",

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
            "Một bài đăng cho biết người dùng iPhone tại Việt Nam đã có thể sử dụng tính năng nhắn tin qua vệ tinh từ tháng 8/2026. Tuyên bố này là thật hay giả?",

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
            "Một bài viết ngày 19/08/2026 cho rằng từ năm học 2026–2027, học sinh THPT sẽ bắt buộc học nội dung nhận diện tin giả và kiểm chứng thông tin như một phần của môn Ngữ văn. Tuyên bố này là thật hay giả?",

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
            label: "Tuyên bố về tác động của một loại đồ uống"
        },

        question:
            "Một bài đăng cho rằng một thói quen sử dụng đồ uống quen thuộc vào buổi sáng có thể làm cơ thể tăng tốc độ trao đổi chất và đốt cháy mỡ nhanh hơn. Tuyên bố này được trình bày như một kết luận đã được khoa học chứng minh. Bạn đánh giá tuyên bố này là thật hay giả?",

        context:
            "Tuyên bố đưa ra một tác động sinh lý cụ thể và sử dụng cách diễn đạt mang tính khoa học. Hãy kiểm tra xem có bằng chứng nghiên cứu trực tiếp và đáng tin cậy nào thực sự hỗ trợ kết luận này hay không.",

        answer: false,

        explanation:
            "Tuyên bố được đánh giá là GIẢ trong bài kiểm tra. Chưa có bằng chứng đủ đáng tin cậy được cung cấp để khẳng định thói quen này có thể làm tăng tốc độ trao đổi chất và khiến cơ thể đốt cháy mỡ nhanh hơn như tuyên bố.",

        signal:
            "Một tuyên bố về sức khỏe cần có bằng chứng khoa học có thể truy xuất",

        evidence:
            "Nguồn được nêu không cho thấy đây là một nguồn y khoa hoặc nghiên cứu học thuật đủ độ tin cậy để xác nhận kết luận trên",

        next:
            "Tìm nghiên cứu gốc, tác giả, tạp chí công bố và phương pháp nghiên cứu trước khi kết luận"
    },


    /* =================================================
       CÂU 10
    ================================================= */

    {
        media: {
            type: "image",
            src: "assets/quiz/anh10.jpg",
            label: "Tuyên bố về chính sách đối với học sinh"
        },

        question:
            "Một thông tin được chia sẻ cho rằng trong một năm học sắp tới, học sinh THPT trên cả nước sẽ không còn được phép mang một thiết bị cá nhân quen thuộc đến trường nhằm giảm sự phụ thuộc vào công nghệ. Tuyên bố này được cho là một thay đổi chính sách trên phạm vi toàn quốc. Bạn đánh giá tuyên bố này là thật hay giả?",

        context:
            "Một quy định có thật ở một mức độ hoặc trong một hoàn cảnh nhất định có thể bị diễn giải thành một lệnh cấm rộng hơn. Hãy kiểm tra cơ quan ban hành, văn bản gốc và phạm vi áp dụng trước khi kết luận.",

        answer: false,

        explanation:
            "Tuyên bố được đánh giá là GIẢ trong bài kiểm tra. Nội dung đã mở rộng một quy định có thật thành tuyên bố cấm hoàn toàn học sinh THPT mang điện thoại đến trường trên phạm vi toàn quốc, nhưng không có căn cứ chính thức được cung cấp để xác nhận mức độ cấm này.",

        signal:
            "Phải phân biệt giữa quy định thực tế và cách diễn giải mở rộng trên mạng",

        evidence:
            "Nguồn được nêu không phải là văn bản chính thức của cơ quan quản lý giáo dục và không cung cấp căn cứ xác nhận lệnh cấm hoàn toàn trên phạm vi toàn quốc",

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
