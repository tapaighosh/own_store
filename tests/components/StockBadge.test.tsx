/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { StockBadge } from "@/components/store/StockBadge";

describe("StockBadge", () => {
  it("renders 'In Stock' when stock > threshold", () => {
    render(<StockBadge stock={10} lowStockThreshold={5} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("renders 'Low Stock (X left)' when stock <= threshold and stock > 0", () => {
    render(<StockBadge stock={3} lowStockThreshold={5} />);
    expect(screen.getByText("Low Stock (3 left)")).toBeInTheDocument();
  });

  it("renders 'Out of Stock' when stock === 0", () => {
    render(<StockBadge stock={0} lowStockThreshold={5} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });
});
