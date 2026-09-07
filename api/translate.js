export default async function handler(req, res) {
    /*
     * =====================================================
     * VERITAS TRANSLATION API
     * MyMemory Translation Service
     * =====================================================
     */

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const body = req.body || {};

        const text =
            typeof body.text === "string"
                ? body.text.trim()
                : "";

        let sourceLang =
            typeof body.sourceLang === "string"
                ? body.sourceLang.trim().toLowerCase()
                : "auto";

        const targetLang =
            typeof body.targetLang === "string"
                ? body.targetLang.trim().toLowerCase()
                : "";

        if (!text) {
            return res.status(400).json({
                error: "Missing text"
            });
        }

        if (!targetLang) {
            return res.status(400).json({
                error: "Missing target language"
            });
        }

        /*
         * MyMemory giới hạn request khoảng 500 bytes.
         */

        const byteLength =
            new TextEncoder()
                .encode(text)
                .length;

        if (byteLength > 500) {
            return res.status(400).json({
                error:
                    "Text is too long. Maximum is 500 bytes."
            });
        }

        /*
         * AUTO hiện dùng English làm fallback.
         * Đây chưa phải auto-detection thật.
         */

        if (sourceLang === "auto") {
            sourceLang = "en";
        }

        /*
         * Nếu cùng ngôn ngữ,
         * không cần gọi API.
         */

        if (sourceLang === targetLang) {
            return res.status(200).json({
                translation: text,
                detectedSourceLanguage: sourceLang
            });
        }

        const langPair =
            `${sourceLang}|${targetLang}`;

        const params =
            new URLSearchParams({
                q: text,
                langpair: langPair
            });

        const apiUrl =
            `https://api.mymemory.translated.net/get?${params.toString()}`;

        const response =
            await fetch(
                apiUrl,
                {
                    method: "GET",
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

        const rawText =
            await response.text();

        let data = null;

        try {
            data = JSON.parse(rawText);
        } catch (jsonError) {
            console.error(
                "MyMemory returned non-JSON:",
                rawText
            );

            return res.status(502).json({
                error:
                    "Translation service returned an invalid response."
            });
        }

        if (!response.ok) {
            console.error(
                "MyMemory HTTP error:",
                response.status,
                data
            );

            return res.status(502).json({
                error:
                    "Translation service is currently unavailable."
            });
        }

        /*
         * MyMemory responseStatus thường là 200
         * khi request thành công.
         */

        if (
            data?.responseStatus &&
            Number(data.responseStatus) !== 200
        ) {
            console.error(
                "MyMemory API error:",
                data
            );

            return res.status(502).json({
                error:
                    data?.responseDetails ||
                    "Translation failed."
            });
        }

        let translation =
            data?.responseData?.translatedText ||
            "";

        /*
         * Fallback:
         * tìm translation tốt nhất trong matches.
         */

        if (
            !translation &&
            Array.isArray(data?.matches)
        ) {
            const bestMatch =
                data.matches.find(
                    match =>
                        match &&
                        typeof match.translation === "string" &&
                        match.translation.trim()
                );

            translation =
                bestMatch?.translation || "";
        }

        if (!translation.trim()) {
            return res.status(502).json({
                error:
                    "No translation was returned."
            });
        }

        return res.status(200).json({
            translation:
                translation.trim(),

            detectedSourceLanguage:
                data?.responseData
                    ?.detectedLanguage ||
                sourceLang,

            sourceLanguage:
                sourceLang,

            targetLanguage:
                targetLang
        });

    } catch (error) {

        console.error(
            "Veritas Translation API Error:",
            error
        );

        return res.status(500).json({
            error:
                "Unexpected translation server error."
        });
    }
}