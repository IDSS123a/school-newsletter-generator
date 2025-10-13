import { render, screen } from "@testing-library/react";
import { ErrorDisplay } from "../components/ErrorDisplay";
import '@testing-library/jest-dom';

test("renders error message", () => {
  render(<ErrorDisplay error="Test error" />);
  expect(screen.getByText(/Test error/i)).toBeInTheDocument();
});
