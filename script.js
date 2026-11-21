document.addEventListener("DOMContentLoaded", function () {

    const analyzeBtn = document.getElementById("analyzeBtn");
    const htmlInput = document.getElementById("htmlInput");
    const results = document.getElementById("results");
    const issueCount = document.getElementById("issueCount");

    if (!analyzeBtn || !htmlInput || !results || !issueCount) {
        alert("Error: HTML elements not found. Check your index.html IDs.");
        return;
    }

    analyzeBtn.addEventListener("click", function () {

        const html = htmlInput.value.trim();

        if (!html) {
            results.innerHTML = "<p>Please paste HTML code first!</p>";
            return;
        }

        const doc = new DOMParser().parseFromString(html, "text/html");
        const issues = [];

        // Missing alt text
        doc.querySelectorAll("img").forEach(img => {
            if (!img.hasAttribute("alt")) {
                issues.push("Image is missing alt text.");
            }
        });

        // Unlabeled form elements
        doc.querySelectorAll("input, select, textarea").forEach(element => {
            const labeled =
                element.hasAttribute("aria-label") ||
                element.hasAttribute("aria-labelledby") ||
                element.closest("label") ||
                (element.id && doc.querySelector('label[for="' + element.id + '"]'));

            if (!labeled) {
                issues.push("Form element is missing an accessible label.");
            }
        });

        // Skipped heading levels
        const headings = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")];

        for (let i = 1; i < headings.length; i++) {
            const prev = Number(headings[i - 1].tagName[1]);
            const curr = Number(headings[i].tagName[1]);

            if (curr > prev + 1) {
                issues.push("Heading level has been skipped.");
            }
        }

        results.innerHTML = "";

        if (issues.length === 0) {
            results.innerHTML = "<h3>🎉 No basic issues detected!</h3>";
        } else {
            issues.forEach(issue => {
                const div = document.createElement("div");
                div.className = "issue-card";
                div.textContent = "⚠️ " + issue;
                results.appendChild(div);
            });
        }

        issueCount.textContent = issues.length + " Issues";

    });

});  
