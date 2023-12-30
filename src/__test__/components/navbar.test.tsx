import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar/Navbar";

describe("Navbar - rendering", () => {
  it("should have rendered a logo", () => {
    render(<Navbar />);
  });
});
