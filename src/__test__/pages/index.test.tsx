import { getAllByRole, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/pages/index";
import Image from "next/image";

describe("Landing page - rendering", () => {
  it("should render Homepage text", () => {
    render(<Home />);

    const landingMessage = screen.getByTestId("landing-message");
    const text = "SHRED YOUR SORROWS AWAY WITH US - COME REDISCOVER YOURSELF!";

    expect(landingMessage).toHaveTextContent(text);
  });

  it("should display Homepage image", () => {
    render(<Home />);
    const imageElement = screen.getByAltText("landingpage");
    const url = encodeURIComponent(
      "https://res.cloudinary.com/dleikmnsf/image/upload/v1703562355/kalisa-veer-uo_sPhQWe5k-unsplash_aje5bm.jpg"
    );
    expect(imageElement).toHaveAttribute("src", expect.stringContaining(url));
  });

  it("should display collection1 image", () => {
    render(<Home />);
    const imageElement = screen.getByAltText("collection1");
    const url = encodeURIComponent(
      "https://res.cloudinary.com/dleikmnsf/image/upload/v1703573657/BTG0721-WTF-Wakeboards-scaled_apz85d.jpg"
    );
    expect(imageElement).toHaveAttribute("src", expect.stringContaining(url));
  });

  it("should display collection2 image", () => {
    render(<Home />);
    const imageElement = screen.getByAltText("collection2");
    const url = encodeURIComponent(
      "https://res.cloudinary.com/dleikmnsf/image/upload/v1703577325/t-shirt_v02yvl.jpg"
    );
    expect(imageElement).toHaveAttribute("src", expect.stringContaining(url));
  });

  it("should display collection3 image", () => {
    render(<Home />);
    const imageElement = screen.getByAltText("collection3");
    const url = encodeURIComponent(
      "https://res.cloudinary.com/dleikmnsf/image/upload/v1703139516/dev_projects/qyq9ceotu7tj0dtzheme.jpg"
    );
    expect(imageElement).toHaveAttribute("src", expect.stringContaining(url));
  });

  it("should display collection4 image", () => {
    render(<Home />);
    const imageElement = screen.getByAltText("collection4");
    const url = encodeURIComponent(
      "https://res.cloudinary.com/dleikmnsf/image/upload/v1703578682/wakeboardstarterpackageimpactbrickwithaquabuddy_wakeboard___1_700x_xtvwy2.webp"
    );
    expect(imageElement).toHaveAttribute("src", expect.stringContaining(url));
  });

  it("should display paragraphs for the respective collections", () => {
    render(<Home />);
    const paragraphEls = screen.getAllByTestId("collections-paragraph");

    expect(paragraphEls.length).toBe(8);

    const arrayText = [
      "RIDING ESSENTIALS",
      "Get everything you need for wakeboarding here!",
      "APPAREL",
      "Look good while feeling good!",
      "ACCESSORIES",
      "Miscellaneous items to complete your needs",
      "KIDS",
      "For the little ones",
    ];

    expect(paragraphEls[0]).toHaveTextContent(arrayText[0]);
    expect(paragraphEls[1]).toHaveTextContent(arrayText[1]);
    expect(paragraphEls[2]).toHaveTextContent(arrayText[2]);
    expect(paragraphEls[3]).toHaveTextContent(arrayText[3]);
    expect(paragraphEls[4]).toHaveTextContent(arrayText[4]);
    expect(paragraphEls[5]).toHaveTextContent(arrayText[5]);
    expect(paragraphEls[6]).toHaveTextContent(arrayText[6]);
    expect(paragraphEls[7]).toHaveTextContent(arrayText[7]);
  });
});
