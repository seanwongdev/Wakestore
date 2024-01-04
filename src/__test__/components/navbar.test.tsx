import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Navbar from "@/components/Navbar/Navbar";
import { useSession } from "next-auth/react";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react");

describe("Navbar - rendering", () => {
  it("should render a log in button when signed out", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {},
      status: "unauthenticated",
    });

    const mockCollectionArr = [
      {
        collection_id: 1,
        collection_name: "Riding Essentials",
        collection_url: "/riding-essentials",
      },
      {
        collection_id: 2,
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
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("should render headers properly regardless of session status", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {},
      status: "unauthenticated",
    });

    const mockCollectionArr = [
      {
        collection_id: 1,
        collection_name: "Mock Rider",
        collection_url: "/mock-rider",
      },
      {
        collection_id: 2,
        collection_name: "Mock Apparel",
        collection_url: "/mock-apparel",
      },
    ];

    const NavbarProps = {
      onSignup: jest.fn(),
      onSignin: jest.fn(),
      onSearch: jest.fn(),
      data: mockCollectionArr,
    };

    render(<Navbar {...NavbarProps} />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(3);
    expect(links[0]).toHaveTextContent("ShredShop");
    expect(links[1]).toHaveTextContent("Mock Rider");
    expect(links[2]).toHaveTextContent("Mock Apparel");
  });

  it("should render search icon when rendered", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {},
      status: "unauthenticated",
    });

    const mockCollectionArr = [
      {
        collection_id: 1,
        collection_name: "Mock Rider",
        collection_url: "/mock-rider",
      },
    ];

    const NavbarProps = {
      onSignup: jest.fn(),
      onSignin: jest.fn(),
      onSearch: jest.fn(),
      data: mockCollectionArr,
    };

    render(<Navbar {...NavbarProps} />);
    expect(screen.getByTestId("button-search-icon")).toBeInTheDocument();
  });

  it("should render cart icon button when rendered", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {},
      status: "unauthenticated",
    });

    const mockCollectionArr = [
      {
        collection_id: 1,
        collection_name: "Mock Rider",
        collection_url: "/mock-rider",
      },
    ];

    const NavbarProps = {
      onSignup: jest.fn(),
      onSignin: jest.fn(),
      onSearch: jest.fn(),
      data: mockCollectionArr,
    };

    render(<Navbar {...NavbarProps} />);
    expect(screen.getByTestId("button-cart-icon")).toBeInTheDocument();
  });

  it("should render name of user button when signed in", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          username: "mockAdmin",
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
        collection_id: 2,
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
    expect(
      screen.getByRole("button", { name: "MockAdmin" })
    ).toBeInTheDocument();
  });

  it("should render Account and Log out buttons upon mouse hover over user name when signed in", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          username: "mockAdmin",
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
    ];

    const NavbarProps = {
      onSignup: jest.fn(),
      onSignin: jest.fn(),
      onSearch: jest.fn(),
      data: mockCollectionArr,
    };

    render(<Navbar {...NavbarProps} />);

    expect(
      screen.queryByRole("button", { name: "Account" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Log out" })
    ).not.toBeInTheDocument();

    const userButton = screen.getByRole("button", { name: "MockAdmin" });
    await userEvent.hover(userButton);

    expect(
      screen.getByRole("button", { name: "MockAdmin" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });
});
