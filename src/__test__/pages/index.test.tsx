import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/pages/index";

describe("Landing page", () => {
  it("Should render properly", () => {
    render(<Home />);

    const landingMessage = screen.getByTestId("landing-message");
    const text = "SHRED YOUR SORROWS AWAY WITH US - COME REDISCOVER YOURSELF!";

    expect(landingMessage).toHaveTextContent(text);
  });
});
