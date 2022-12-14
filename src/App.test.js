import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const setup = (jsx) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

test("renders app", () => {
  render(<App />);
  const linkElement = screen.getByText(/grain-tac-toe/i);
  expect(linkElement).toBeInTheDocument();
});

test("defaults to 3x3", () => {
  const { container } = render(<App />);
  const cells = Array.from(container.querySelectorAll(".cell"));
  expect(cells.length).toEqual(9);
});

test("can't be made smaller when already at 3x3", () => {
  render(<App />);
  const minusButton = screen.getByText("-");
  expect(minusButton).toBeDisabled();
});

test("can be made larger", async () => {
  const { user, container } = setup(<App />);

  const plusButton = screen.getByText("+");
  const minusButton = screen.getByText("-");
  await user.click(plusButton);

  const cells = Array.from(container.querySelectorAll(".cell"));
  expect(cells.length).toEqual(16);
  expect(minusButton).toBeEnabled();
});

test("can be 6x6 maximum", async () => {
  const { user, container } = setup(<App />);

  const plusButton = screen.getByText("+");
  const minusButton = screen.getByText("-");

  await user.click(plusButton)
  await user.click(plusButton)
  await user.click(plusButton);

  const cells = Array.from(container.querySelectorAll(".cell"));
  expect(cells.length).toEqual(36);
  expect(minusButton).toBeEnabled();
  expect(plusButton).toBeDisabled();
});

test("clicking produces proper marks", async () => {
  const { user, container } = setup(<App />);
  const cells = Array.from(container.querySelectorAll(".cell"));

  // First move
  await user.click(cells[1]);
  expect(cells[1].innerHTML).toEqual("❌");

  // Click same cell twice -- it shouldn't change
  await user.click(cells[1]);
  expect(cells[1].innerHTML).toEqual("❌");

  // Click new cell, it should output an O
  await user.click(cells[2]);
  expect(cells[2].innerHTML).toEqual("⭕️");
});

test("should clear state when changing size", async () => {
  const { user, container } = setup(<App />);
  const cells = Array.from(container.querySelectorAll(".cell"));
  const plusButton = screen.getByText("+");

  await user.click(cells[1]);
  expect(cells[1].innerHTML).toEqual("❌");

  await user.click(plusButton);
  expect(cells.map(c => c.innerHTML).every(content => content === '')).toBeTruthy();
});
