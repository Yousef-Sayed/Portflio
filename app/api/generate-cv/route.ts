import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import * as mupdf from "mupdf";
import QRCode from "qrcode";

// ---------- Color palette (formal corporate palette) ----------
// Clean white background with subtle professional accents
const PRIMARY = { r: 0.15, g: 0.15, b: 0.18 }; // Dark slate - headings
const SECONDARY = { r: 0.35, g: 0.38, b: 0.42 }; // Muted gray - subheadings
const BODY = { r: 0.25, g: 0.25, b: 0.28 }; // Dark gray - body text

// Helper for backward compatibility
const DARK = BODY;

// ---------- A4 dimensions (in points) ----------
const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const MARGIN_TOP = 50;
const MARGIN_BOTTOM = 50;
const CONTENT_W = A4_W - MARGIN_LEFT - MARGIN_RIGHT;

// ---------- Helpers ----------

/** Escape text for PDF content stream literal strings */
function esc(text: string): string {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/[^\x20-\x7E]/g, ""); // strip non-ASCII for simple font safety
}

/** Convert page-top Y (0 = top of content area) to PDF Y (0 = bottom of page) */
function pdfY(topY: number): number {
    return A4_H - MARGIN_TOP - topY;
}

/** Word-wrap text to fit within maxWidth at a given fontSize using the font */
function wrapText(
    text: string,
    font: mupdf.Font,
    fontSize: number,
    maxWidth: number
): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        let testWidth = 0;
        for (let i = 0; i < testLine.length; i++) {
            const glyph = font.encodeCharacter(testLine.charCodeAt(i));
            testWidth += font.advanceGlyph(glyph, 0) * fontSize;
        }
        if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

/** Measure string width */
function measureText(text: string, font: mupdf.Font, fontSize: number): number {
    let w = 0;
    for (let i = 0; i < text.length; i++) {
        const glyph = font.encodeCharacter(text.charCodeAt(i));
        w += font.advanceGlyph(glyph, 0) * fontSize;
    }
    return w;
}

// ---------- Main API handler ----------
export async function GET(request: NextRequest) {
    try {
        // ---- Fetch data from Convex ----
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        let projects: Array<{
            title: string;
            description: string;
            liveUrl?: string;
            playStoreUrl?: string;
            githubUrl?: string;
            platform?: string;
            tags: string[];
        }> = [];
        let experience: Array<{
            role: string;
            company: string;
            period: string;
            description: string;
            current?: boolean;
        }> = [];
        let skills: Array<{
            name: string;
            category: string;
            level: number;
        }> = [];
        let contactEmail = "youssefabdrabooh@gmail.com";
        let phoneNumbers: Array<{ label: string; number: string }> = [];
        let socialFacebook = "https://www.facebook.com/yousef.sayed.98434";
        let socialGithub = "https://github.com/Yousef-Sayed/";
        let socialLinkedin = "";

        if (convexUrl) {
            const client = new ConvexHttpClient(convexUrl);

            const [
                activeProjects,
                activeExperience,
                activeSkills,
                emailSetting,
                phonesSetting,
                fbSetting,
                ghSetting,
                liSetting,
            ] = await Promise.all([
                client.query(api.projects.getActive),
                client.query(api.experience.getActive),
                client.query(api.skills.getActive),
                client.query(api.messages.getSetting, { key: "contact_email" }),
                client.query(api.messages.getSetting, { key: "contact_phones" }),
                client.query(api.messages.getSetting, { key: "social_facebook" }),
                client.query(api.messages.getSetting, { key: "social_github" }),
                client.query(api.messages.getSetting, { key: "social_linkedin" }),
            ]);

            projects = activeProjects.map((p) => ({
                title: p.title,
                description: p.description,
                liveUrl: p.liveUrl,
                playStoreUrl: p.playStoreUrl,
                githubUrl: p.githubUrl,
                platform: p.platform,
                tags: p.tags,
            }));

            experience = activeExperience.map((e) => ({
                role: e.role,
                company: e.company,
                period: e.period,
                description: e.description,
                current: e.current,
            }));

            skills = activeSkills.map((s) => ({
                name: s.name,
                category: s.category,
                level: s.level,
            }));

            if (emailSetting) contactEmail = emailSetting;
            if (phonesSetting) {
                try {
                    const parsed = JSON.parse(phonesSetting);
                    if (Array.isArray(parsed)) phoneNumbers = parsed;
                } catch { /* use default */ }
            }
            if (fbSetting) socialFacebook = fbSetting;
            if (ghSetting) socialGithub = ghSetting;
            if (liSetting) socialLinkedin = liSetting;
        } else {
            // Fallback to static portfolio data
            const { portfolioData, socialLinks } = await import("@/data/portfolio-data");
            const d = portfolioData.en;

            projects = d.projects.map((p) => ({
                title: p.title,
                description: p.description,
                liveUrl: p.liveUrl,
                playStoreUrl: p.playStoreUrl,
                githubUrl: p.githubUrl,
                platform: p.platform,
                tags: p.tags,
            }));

            experience = d.experience.map((e) => ({
                role: e.role,
                company: e.company,
                period: e.period,
                description: e.description,
                current: e.current,
            }));

            skills = [
                ...d.skills.frontend.map((s) => ({ name: s.name, category: "frontend", level: s.level })),
                ...d.skills.backend.map((s) => ({ name: s.name, category: "backend", level: s.level })),
            ];

            contactEmail = d.personalInfo.email;
            socialFacebook = socialLinks.find((l) => l.name === "Facebook")?.url || "";
            socialGithub = socialLinks.find((l) => l.name === "GitHub")?.url || "";
        }

        // Clean phone numbers (remove trailing non-ASCII like Arabic chars)
        phoneNumbers = phoneNumbers.map((p) => ({
            ...p,
            number: p.number.replace(/[^\x20-\x7E+]/g, "").trim(),
        }));

        // If no phone numbers from DB, use defaults
        if (phoneNumbers.length === 0) {
            phoneNumbers = [
                { label: "Mobile", number: "+20 1018169667" },
                { label: "Mobile", number: "+20 1122917397" },
            ];
        }

        // ---- Website URL (dynamic from request) ----
        const websiteUrl =
            process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

        // ---- Generate QR code as PNG buffer ----
        const qrDataUrl: string = await QRCode.toDataURL(websiteUrl, {
            width: 200,
            margin: 1,
            color: { dark: "#262830", light: "#FFFFFF" }, // Matches PRIMARY color
            errorCorrectionLevel: "M",
        });
        const qrBase64 = qrDataUrl.split(",")[1];
        const qrBuffer = Buffer.from(qrBase64, "base64");

        // ---- Create PDF with mupdf ----
        const doc = new mupdf.PDFDocument();

        // Fonts
        const helvetica = new mupdf.Font("Helvetica");
        const helveticaBold = new mupdf.Font("Helvetica-Bold");
        const helveticaOblique = new mupdf.Font("Helvetica-Oblique");

        const fontRef = doc.addSimpleFont(helvetica, "Latin");
        const fontBoldRef = doc.addSimpleFont(helveticaBold, "Latin");
        const fontItalicRef = doc.addSimpleFont(helveticaOblique, "Latin");

        // QR code image
        const qrImage = new mupdf.Image(qrBuffer);
        const qrImageRef = doc.addImage(qrImage);

        // Social media links setup
        const socialLinks: Array<{ label: string; url: string }> = [];
        if (socialGithub) socialLinks.push({ label: "GitHub", url: socialGithub });
        if (socialLinkedin) socialLinks.push({ label: "LinkedIn", url: socialLinkedin });
        if (socialFacebook) socialLinks.push({ label: "Facebook", url: socialFacebook });

        const socialLinkFontSize = 9;

        // Track links per page: { pageIndex, rect, uri }
        const linkQueue: Array<{ pageIndex: number; rect: [number, number, number, number]; uri: string }> = [];
        let currentPageIndex = 0;

        // ---- Build pages ----
        // We accumulate content stream operators and track Y position.
        // When we run out of space, we finish the current page and start a new one.

        type PageData = {
            content: string;
        };
        const pages: PageData[] = [];
        let stream = "";
        let curY = 0; // Y from top of content area

        function startPage() {
            stream = "";
            curY = 0;
        }

        function finishPage() {
            const fonts = doc.newDictionary();
            fonts.put("F1", fontRef);
            fonts.put("F2", fontBoldRef);
            fonts.put("F3", fontItalicRef);

            const xobjects = doc.newDictionary();
            xobjects.put("QR", qrImageRef);

            const resources = doc.addObject(doc.newDictionary());
            resources.put("Font", fonts);
            resources.put("XObject", xobjects);

            const pageObj = doc.addPage(
                [0, 0, A4_W, A4_H],
                0,
                resources,
                stream
            );
            doc.insertPage(-1, pageObj);
            pages.push({ content: stream });
        }

        function ensureSpace(needed: number) {
            const maxY = A4_H - MARGIN_TOP - MARGIN_BOTTOM;
            if (curY + needed > maxY) {
                finishPage();
                currentPageIndex++;
                startPage();
            }
        }

        function addText(
            text: string,
            x: number,
            fontSize: number,
            fontName: string,
            color: { r: number; g: number; b: number }
        ) {
            stream += `BT ${color.r.toFixed(3)} ${color.g.toFixed(3)} ${color.b.toFixed(3)} rg /${fontName} ${fontSize} Tf ${(MARGIN_LEFT + x).toFixed(2)} ${pdfY(curY).toFixed(2)} Td (${esc(text)}) Tj ET\n`;
        }

        function addLine(
            x1: number,
            y: number,
            x2: number,
            lineWidth: number,
            color: { r: number; g: number; b: number }
        ) {
            stream += `q ${color.r.toFixed(3)} ${color.g.toFixed(3)} ${color.b.toFixed(3)} RG ${lineWidth} w ${(MARGIN_LEFT + x1).toFixed(2)} ${pdfY(y).toFixed(2)} m ${(MARGIN_LEFT + x2).toFixed(2)} ${pdfY(y).toFixed(2)} l S Q\n`;
        }

        function addRect(
            x: number,
            y: number,
            w: number,
            h: number,
            color: { r: number; g: number; b: number }
        ) {
            stream += `q ${color.r.toFixed(3)} ${color.g.toFixed(3)} ${color.b.toFixed(3)} rg ${(MARGIN_LEFT + x).toFixed(2)} ${(pdfY(y) - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f Q\n`;
        }

        function registerLink(
            x: number,
            y: number,
            w: number,
            h: number,
            uri: string
        ) {
            // PDF coords: bottom-left
            const pdfBottom = pdfY(y) - h;
            linkQueue.push({
                pageIndex: currentPageIndex,
                rect: [
                    MARGIN_LEFT + x,
                    pdfBottom,
                    MARGIN_LEFT + x + w,
                    pdfBottom + h,
                ],
                uri,
            });
        }

        function drawSectionHeading(title: string) {
            ensureSpace(46);
            curY += 14;
            // Underline accent bar (thinner, cleaner look)
            addRect(0, curY, CONTENT_W, 3, PRIMARY);
            // Section title with PRIMARY color
            stream += `BT ${PRIMARY.r.toFixed(3)} ${PRIMARY.g.toFixed(3)} ${PRIMARY.b.toFixed(3)} rg /F2 12 Tf ${(MARGIN_LEFT).toFixed(2)} ${(pdfY(curY) + 14).toFixed(2)} Td (${esc(title.toUpperCase())}) Tj ET\n`;
            curY += 24;
        }

        // =================== PAGE CONSTRUCTION ===================
        startPage();

        // QR code dimensions (drawn later so it renders on top)
        const qrSize = 72;
        const qrGap = 12; // gap between text and QR
        const qrX = CONTENT_W - qrSize; // relative to margin
        const qrYTop = 2; // slight offset from top

        // Max text width for header (leave room for QR)
        const headerTextW = CONTENT_W - qrSize - qrGap;

        // ---------- HEADER SECTION ----------
        // Name
        addText("Youssef Abdrabboh", 0, 26, "F2", PRIMARY);
        curY += 32;

        // Title
        addText("Software Engineer", 0, 13, "F3", SECONDARY);
        curY += 18;

        // Thin accent line (full width)
        addLine(0, curY, CONTENT_W, 1, PRIMARY);
        curY += 14;

        // Contact info row
        const contactItems: string[] = [];
        contactItems.push(contactEmail);
        phoneNumbers.forEach((p) => contactItems.push(p.number));

        const contactLine = contactItems.join("  |  ");
        // Wrap contact line if needed
        const contactLineW = measureText(contactLine, helvetica, 9);
        if (contactLineW <= headerTextW) {
            addText(contactLine, 0, 9, "F1", BODY);
            const emailWidth = measureText(contactEmail, helvetica, 9);
            registerLink(0, curY - 9, emailWidth, 13, `mailto:${contactEmail}`);
            curY += 15;
        } else {
            // Email on its own line
            addText(contactEmail, 0, 9, "F1", BODY);
            const emailWidth = measureText(contactEmail, helvetica, 9);
            registerLink(0, curY - 9, emailWidth, 13, `mailto:${contactEmail}`);
            curY += 14;
            // Phone numbers on next line
            const phoneLine = phoneNumbers.map((p) => p.number).join("  |  ");
            addText(phoneLine, 0, 9, "F1", BODY);
            curY += 15;
        }

        // Social media row - text-based links
        const socialLinkGap = 20;
        let socialX = 0;
        
        for (const social of socialLinks) {
            const textW = measureText(social.label, helvetica, socialLinkFontSize);
            
            // Draw link text with PRIMARY color
            stream += `BT ${PRIMARY.r.toFixed(3)} ${PRIMARY.g.toFixed(3)} ${PRIMARY.b.toFixed(3)} rg /F1 ${socialLinkFontSize} Tf ${(MARGIN_LEFT + socialX).toFixed(2)} ${pdfY(curY).toFixed(2)} Td (${esc(social.label)}) Tj ET\n`;
            
            // Add underline
            addLine(socialX, curY + 2, textW, 0.5, PRIMARY);
            
            // Register clickable area
            registerLink(socialX, curY - socialLinkFontSize, textW, socialLinkFontSize + 6, social.url);
            
            socialX += textW + socialLinkGap;
        }
        curY += 22;

        // ---------- QR CODE (drawn last in header so it appears above lines) ----------
        // White background behind QR to mask any intersecting lines
        stream += `q 1 1 1 rg ${(MARGIN_LEFT + qrX - 4).toFixed(2)} ${(pdfY(qrYTop) - qrSize - 14).toFixed(2)} ${(qrSize + 8).toFixed(2)} ${(qrSize + 22).toFixed(2)} re f Q\n`;
        // QR image
        stream += `q ${qrSize} 0 0 ${qrSize} ${(MARGIN_LEFT + qrX).toFixed(2)} ${(pdfY(qrYTop) - qrSize).toFixed(2)} cm /QR Do Q\n`;
        // Small label under QR
        const scanLabel = "Scan to visit website";
        const scanLabelW = measureText(scanLabel, helvetica, 6);
        stream += `BT ${SECONDARY.r.toFixed(3)} ${SECONDARY.g.toFixed(3)} ${SECONDARY.b.toFixed(3)} rg /F1 6 Tf ${(MARGIN_LEFT + qrX + (qrSize - scanLabelW) / 2).toFixed(2)} ${(pdfY(qrYTop) - qrSize - 9).toFixed(2)} Td (${esc(scanLabel)}) Tj ET\n`;
        // QR link area
        registerLink(qrX, qrYTop, qrSize, qrSize + 14, websiteUrl);
        curY += 8;

        // ---------- WORK EXPERIENCE ----------
        drawSectionHeading("Work Experience");

        for (const exp of experience) {
            ensureSpace(70);

            // Role - Bold
            addText(exp.role, 0, 11, "F2", PRIMARY);
            curY += 15;

            // Company + Period
            const companyPeriod = `${exp.company}  |  ${exp.period}${exp.current ? "  (Current)" : ""}`;
            addText(companyPeriod, 0, 9, "F3", SECONDARY);
            curY += 14;

            // Description (word-wrapped)
            const descLines = wrapText(exp.description, helvetica, 9, CONTENT_W - 10);
            for (const line of descLines) {
                ensureSpace(14);
                addText(line, 5, 9, "F1", BODY);
                curY += 13;
            }
            curY += 8;
        }

        // ---------- SKILLS ----------
        drawSectionHeading("Technical Skills");

        const frontendSkills = skills.filter((s) => s.category === "frontend");
        const backendSkills = skills.filter((s) => s.category === "backend");
        const colWidth = CONTENT_W / 2 - 10;

        // Column headers
        ensureSpace(22);
        addText("Frontend", 0, 11, "F2", PRIMARY);
        stream += `BT ${PRIMARY.r.toFixed(3)} ${PRIMARY.g.toFixed(3)} ${PRIMARY.b.toFixed(3)} rg /F2 11 Tf ${(MARGIN_LEFT + CONTENT_W / 2 + 10).toFixed(2)} ${pdfY(curY).toFixed(2)} Td (Backend) Tj ET\n`;
        curY += 20; // Extra spacing instead of underlines

        // Skill rows (side by side)
        const maxRows = Math.max(frontendSkills.length, backendSkills.length);
        for (let i = 0; i < maxRows; i++) {
            ensureSpace(16);
            if (i < frontendSkills.length) {
                const bullet = "- " + frontendSkills[i].name;
                addText(bullet, 5, 9, "F1", BODY);
            }
            if (i < backendSkills.length) {
                const bullet = "- " + backendSkills[i].name;
                stream += `BT ${BODY.r.toFixed(3)} ${BODY.g.toFixed(3)} ${BODY.b.toFixed(3)} rg /F1 9 Tf ${(MARGIN_LEFT + CONTENT_W / 2 + 15).toFixed(2)} ${pdfY(curY).toFixed(2)} Td (${esc(bullet)}) Tj ET\n`;
            }
            curY += 15;
        }
        curY += 8;

        // ---------- PROJECTS ----------
        drawSectionHeading("Projects");

        for (const proj of projects) {
            ensureSpace(60);

            // Project name - Bold
            addText(proj.title, 0, 11, "F2", PRIMARY);
            if (proj.platform) {
                const titleW = measureText(proj.title, helveticaBold, 11);
                stream += `BT ${SECONDARY.r.toFixed(3)} ${SECONDARY.g.toFixed(3)} ${SECONDARY.b.toFixed(3)} rg /F3 9 Tf ${(MARGIN_LEFT + titleW + 8).toFixed(2)} ${pdfY(curY).toFixed(2)} Td (${esc("(" + proj.platform + ")")}) Tj ET\n`;
            }
            curY += 15;

            // Tags
            if (proj.tags.length > 0) {
                const tagsStr = proj.tags.join("  |  ");
                addText(tagsStr, 5, 8, "F3", SECONDARY);
                curY += 12;
            }

            // Description (word-wrapped)
            const projDescLines = wrapText(proj.description, helvetica, 9, CONTENT_W - 10);
            for (const line of projDescLines) {
                ensureSpace(14);
                addText(line, 5, 9, "F1", BODY);
                curY += 13;
            }

            // Links row - with proper spacing and generous click targets
            let linkX = 5;
            const linkFontSize = 8;
            let hasLinks = false;

            const projLinks: Array<{ label: string; url: string }> = [];
            if (proj.liveUrl && proj.liveUrl.startsWith("http")) {
                projLinks.push({ label: "Live Demo", url: proj.liveUrl });
            }
            if (proj.playStoreUrl && proj.playStoreUrl.startsWith("http")) {
                projLinks.push({ label: "Play Store", url: proj.playStoreUrl });
            }
            if (proj.githubUrl && proj.githubUrl.startsWith("http")) {
                projLinks.push({ label: "GitHub", url: proj.githubUrl });
            }

            if (projLinks.length > 0) {
                hasLinks = true;
                curY += 2; // small gap before links
                for (const pLink of projLinks) {
                    const lw = measureText(pLink.label, helvetica, linkFontSize);
                    // Draw link text
                    addText(pLink.label, linkX, linkFontSize, "F1", SECONDARY);
                    // Underline (visible, slightly thicker)
                    addLine(linkX, curY + 2, linkX + lw, 0.5, SECONDARY);
                    // Register clickable area (generous: 4pt below baseline to fontSize above)
                    registerLink(linkX, curY - linkFontSize - 2, lw + 4, linkFontSize + 8, pLink.url);
                    linkX += lw + 18;
                }
            }

            if (hasLinks) {
                curY += 14;
            }

            curY += 10;
        }

        // ---------- FOOTER ----------
        ensureSpace(35);
        curY += 8;
        addLine(0, curY, CONTENT_W, 0.35, SECONDARY);
        curY += 14;
        const footerText = "Generated on " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        addText(footerText, 0, 7, "F3", SECONDARY);

        // Finish last page
        finishPage();

        // ---- Add clickable links to pages via PDF annotations ----
        for (const link of linkQueue) {
            if (link.pageIndex < doc.countPages()) {
                try {
                    const pageRef = doc.findPage(link.pageIndex);

                    // Build link annotation dictionary
                    const annotDict = doc.newDictionary();
                    annotDict.put("Type", doc.newName("Annot"));
                    annotDict.put("Subtype", doc.newName("Link"));

                    // Rect [x0, y0, x1, y1] in PDF coordinates
                    const rectArr = doc.newArray();
                    rectArr.push(doc.newReal(link.rect[0]));
                    rectArr.push(doc.newReal(link.rect[1]));
                    rectArr.push(doc.newReal(link.rect[2]));
                    rectArr.push(doc.newReal(link.rect[3]));
                    annotDict.put("Rect", rectArr);

                    // URI action
                    const actionDict = doc.newDictionary();
                    actionDict.put("S", doc.newName("URI"));
                    actionDict.put("URI", doc.newString(link.uri));
                    annotDict.put("A", actionDict);

                    // Invisible border
                    const borderArr = doc.newArray();
                    borderArr.push(doc.newInteger(0));
                    borderArr.push(doc.newInteger(0));
                    borderArr.push(doc.newInteger(0));
                    annotDict.put("Border", borderArr);

                    // F flag = 4 (Print) so the link is functional but no visible rectangle
                    annotDict.put("F", doc.newInteger(4));

                    const annotRef = doc.addObject(annotDict);

                    // Get or create Annots array on the page
                    let annots = pageRef.get("Annots");
                    if (!annots || annots.toString() === "null") {
                        annots = doc.newArray();
                        pageRef.put("Annots", doc.addObject(annots));
                    }
                    annots.push(annotRef);
                } catch (linkErr) {
                    console.warn("Failed to add link:", link.uri, linkErr);
                }
            }
        }

        // ---- Save PDF ----
        const buf = doc.saveToBuffer("compress=yes,garbage=3");

        // Convert mupdf Buffer to ArrayBuffer for Response
        const pdfBytes = buf.asUint8Array();
        const responseBuffer = new ArrayBuffer(pdfBytes.byteLength);
        new Uint8Array(responseBuffer).set(pdfBytes);

        return new NextResponse(responseBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="Youssef_Abdrabboh_CV.pdf"',
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("CV generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate CV", details: String(error) },
            { status: 500 }
        );
    }
}
