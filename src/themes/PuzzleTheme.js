import { createBookSVG } from "./library/BookAssets.js";
import { t } from "../i18n/index.js";

/** Visual-only library theme. It deliberately contains no puzzle geometry. */
export class PuzzleTheme {
  constructor({ documentRef = document } = {}) {
    this.document = documentRef;
    this.name = "library";
    this.displayName = t("theme.displayName");
    this.description = t("theme.description");
  }

  /** Theme CSS is bundled from src/styles/main.css. */
  install() {
    return () => {};
  }

  renderBackground(container) {
    const books = (count) =>
      Array.from(
        { length: count },
        (_, index) =>
          `<span class="case-book-color-${index % 8} case-book-height-${index % 4}"></span>`,
      ).join("");
    container.innerHTML = `<div class="library-architecture"><div class="back-wall"></div><div class="bookcase left"><div class="case-top"></div><div class="case-books one">${books(14)}</div><div class="case-books two">${books(16)}</div><div class="case-books three">${books(13)}</div><div class="case-books four">${books(15)}</div><div class="case-books five">${books(12)}</div><div class="case-shelf s1"></div><div class="case-shelf s2"></div><div class="case-shelf s3"></div><div class="case-shelf s4"></div></div><div class="bookcase right"><div class="case-top"></div><div class="case-books one">${books(13)}</div><div class="case-books two">${books(15)}</div><div class="case-books three">${books(14)}</div><div class="case-books four">${books(16)}</div><div class="case-books five">${books(13)}</div><div class="case-shelf s1"></div><div class="case-shelf s2"></div><div class="case-shelf s3"></div><div class="case-shelf s4"></div></div><div class="arch-window"><div class="moon"></div></div><div class="ceiling-lamp"></div><div class="desk"></div></div><div class="library-floor"></div>`;
  }
  renderBook(book) {
    const element = this.document.createElement("div");
    element.className = "book-item";
    element.dataset.uid = book.uid;
    element.innerHTML = createBookSVG(book);
    element.setAttribute("aria-label", t("theme.bookLabel", {
      color: t(`books.colors.${book.color}`),
      size: t(`books.sizes.${book.size}`),
    }));
    return element;
  }
  destroy() {
    // CSS is owned by the Vite bundle, not by the theme instance.
  }
}
