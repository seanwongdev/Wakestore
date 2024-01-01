import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar/Navbar";
import { useSession } from "next-auth/react";
jest.mock("next-auth/react");

describe("Navbar - rendering", () => {
  // it("should render a log in button when signed out", async () => {
  //   (useSession as jest.Mock).mockReturnValueOnce({
  //     data: {},
  //     status: "unauthenticated",
  //   });

  //   const mockCollectionArr = [
  //     {
  //       collection_id: 1,
  //       collection_name: "Riding Essentials",
  //       collection_url: "/riding-essentials",
  //     },
  //     {
  //       collection_id: 1,
  //       collection_name: "Apparel",
  //       collection_url: "/apparel",
  //     },
  //   ];

  //   const NavbarProps = {
  //     onSignup: jest.fn(),
  //     onSignin: jest.fn(),
  //     onSearch: jest.fn(),
  //     data: mockCollectionArr,
  //   };

  //   render(<Navbar {...NavbarProps} />);
  //   expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  // });

  // it("should render headers properly regardless of session status", async () => {
  //   (useSession as jest.Mock).mockReturnValueOnce({
  //     data: {},
  //     status: "unauthenticated",
  //   });

  //   const mockCollectionArr = [
  //     {
  //       collection_id: 1,
  //       collection_name: "Riding Essentials",
  //       collection_url: "/riding-essentials",
  //     },
  //     {
  //       collection_id: 1,
  //       collection_name: "Apparel",
  //       collection_url: "/apparel",
  //     },
  //   ];

  //   const NavbarProps = {
  //     onSignup: jest.fn(),
  //     onSignin: jest.fn(),
  //     onSearch: jest.fn(),
  //     data: mockCollectionArr,
  //   };

  //   render(<Navbar {...NavbarProps} />);
  //   expect(screen.getAllByRole("link").length).toBe(3);
  // });

  it("should render a log out button when signed in", async () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {
        user: {
          username: "admin",
        },
      },
      status: "authenticated",
    });

    const mockCollectionArr = [
      {
        collection_id: 1,
        collection_name: "Riding Essentials",
        collection_url: "/riding-essentials",
      },
      {
        collection_id: 1,
        collection_name: "Apparel",
        collection_url: "/apparel",
      },
    ];

    const NavbarProps = {
      onSignup: jest.fn(),
      onSignin: jest.fn(),
      onSearch: jest.fn(),
      data: mockCollectionArr,
    };

    render(<Navbar {...NavbarProps} />);
    expect(screen.getByRole("button", { name: "admin" })).toBeInTheDocument();
  });
});
