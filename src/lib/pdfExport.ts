import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { createRoot } from "react-dom/client";
import type { ReactElement } from "react";

export async function exportPagesAsPdf(
  renderPage: (pageIndex: number) => ReactElement | null,
  totalPages: number,
  filename = "resume.pdf"
) {
  try {
    if (!jsPDF) throw new Error("jsPDF is not available. Check import.");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    const waitForImages = (rootEl: HTMLElement, timeout = 3000) =>
      new Promise<void>((resolve) => {
        const imgs = Array.from(rootEl.querySelectorAll("img")) as HTMLImageElement[];
        if (imgs.length === 0) return resolve();
        let remaining = imgs.length;
        const onDone = () => {
          remaining -= 1;
          if (remaining <= 0) resolve();
        };

        imgs.forEach((img) => {
          if (img.complete && img.naturalWidth > 0) return onDone();
          const onEnd = () => {
            img.removeEventListener("load", onEnd);
            img.removeEventListener("error", onEnd);
            onDone();
          };
          img.addEventListener("load", onEnd);
          img.addEventListener("error", onEnd);
        });

        setTimeout(() => resolve(), timeout);
      });

    for (let i = 0; i < totalPages; i++) {
      const temp = document.createElement("div");
      temp.style.width = "210mm";
      temp.style.minHeight = "297mm";
      temp.style.padding = "0";
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      temp.style.top = "0";
      temp.style.background = "white";
      document.body.appendChild(temp);

      const wrapper = document.createElement("div");
      temp.appendChild(wrapper);

      const pageElement = renderPage(i);

      const container = document.createElement("div");
      wrapper.appendChild(container);

      const root = createRoot(container);
      root.render(pageElement);

      await waitForImages(wrapper, 3000);
      await new Promise((res) => setTimeout(res, 120));

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        imageTimeout: 3000,
      });

      try {
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error("Rendered canvas is empty");
        }

        const imgDataPng = canvas.toDataURL("image/png");
        const imgHeightPng = (canvas.height * pageWidth) / canvas.width;

        if (i !== 0) pdf.addPage();
        try {
          pdf.addImage(imgDataPng, "PNG", 0, 0, pageWidth, imgHeightPng);
        } catch (pngErr) {
          // PNG failed (corrupt). Try JPEG fallback.
          console.warn("PNG addImage failed, attempting JPEG fallback", pngErr);
          const imgDataJpeg = canvas.toDataURL("image/jpeg", 0.95);
          const imgHeightJpeg = (canvas.height * pageWidth) / canvas.width;
          pdf.addImage(imgDataJpeg, "JPEG", 0, 0, pageWidth, imgHeightJpeg);
        }
        } finally {
         try {
           root.unmount();
         } catch {
           // ignore
         }
        if (temp.parentNode) document.body.removeChild(temp);
      }
    }

    pdf.save(filename);
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    try {
      alert("Failed to generate PDF. Check console for details.");
    } catch {
      // ignore
    }
    throw err;
  }
}
