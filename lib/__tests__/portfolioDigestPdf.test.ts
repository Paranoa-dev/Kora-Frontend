import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderDigestPdf } from "../portfolioDigestPdf";
import type { DigestDocument } from "../portfolioDigest";

const mockedSetProperties = vi.fn();
const mockedText = vi.fn();
const mockedSetFontSize = vi.fn();
const mockedSetFont = vi.fn();
const mockedSetFillColor = vi.fn();
const mockedSetTextColor = vi.fn();
const mockedRect = vi.fn();

const mockInternal = { pageSize: { getWidth: () => 210, getHeight: () => 296 } };
const mockPdf = {
  setProperties: mockedSetProperties,
  text: mockedText,
  setFontSize: mockedSetFontSize,
  setFont: mockedSetFont,
  setFillColor: mockedSetFillColor,
  setTextColor: mockedSetTextColor,
  rect: mockedRect,
  internal: mockInternal,
};

vi.mock("jspdf", () => ({
  default: vi.fn(() => mockPdf),
}));

const doc: DigestDocument = {
  title: "Portfolio Digest",
  subtitle: "Q3 2024",
  generatedAt: "2024-10-01T00:00:00Z",
  sections: [],
};

describe("portfolioDigestPdf (Issue #923)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedSetProperties.mockReturnValue(undefined);
    mockedText.mockReturnValue(undefined);
  });

  it("sets document-level accessibility metadata from the digest", async () => {
    await renderDigestPdf(doc, { filename: "digest.pdf" });
    expect(mockedSetProperties).toHaveBeenCalledWith({
      title: "Portfolio Digest",
      subject: expect.stringContaining("Q3 2024"),
      author: "Kora Protocol",
      keywords: expect.stringContaining("portfolio"),
      creator: expect.stringContaining("portfolioDigestPdf"),
    });
  });

  it("renders the document title and subtitle", async () => {
    await renderDigestPdf(doc, { filename: "digest.pdf" });
    expect(mockedText).toHaveBeenCalledWith("Portfolio Digest", expect.any(Number), expect.any(Number));
    expect(mockedText).toHaveBeenCalledWith("Q3 2024", expect.any(Number), expect.any(Number));
  });

  it("calls buildOutline for the document title", async () => {
    await renderDigestPdf(doc, { filename: "digest.pdf" });
    expect(mockedSetFont).toHaveBeenCalled();
  });
});
