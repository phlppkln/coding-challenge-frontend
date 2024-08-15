import React from "react";
import { render, fireEvent, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardView from "./DashboardView.jsx";
import * as localStorageHelper from "../helpers/localStorageHelper";

jest.mock("../helpers/localStorageHelper");

describe(DashboardView, () => {
  // mock getMyIterationsfromLocalStorage
  beforeEach(() => {
    localStorageHelper.getMyIterationsfromLocalStorage.mockReturnValue([
      {
        id: 1,
        createdAt: new Date(),
        finished: false,
        deleted: false,
        myTitle: "Iteration 1 Test",
        myAnswers: [
          {
            question: "Question 1",
            answers: [
              { text: "Answer 1", selected: false },
              { text: "Answer 2", selected: false },
              { text: "Answer 3", selected: false },
            ],
          },
          {
            question: "Question 2",
            answers: [
              { text: "Answer 4", selected: false },
              { text: "Answer 5", selected: false },
              { text: "Answer 6", selected: false },
            ],
          },
        ],
      },
      {
        id: 2,
        createdAt: new Date(),
        finished: false,
        deleted: false,
        myTitle: "Iteration 2 Test",
        myAnswers: [
          {
            question: "Question 1",
            answers: [
              { text: "Answer 1", selected: false },
              { text: "Answer 2", selected: false },
              { text: "Answer 3", selected: false },
            ],
          },
          {
            question: "Question 2",
            answers: [
              { text: "Answer 4", selected: false },
              { text: "Answer 5", selected: false },
              { text: "Answer 6", selected: false },
            ],
          },
        ],
      },
      {
        id: 3,
        createdAt: new Date(),
        finished: false,
        deleted: false,
        myTitle: "Iteration 3 Test",
        myAnswers: [
          {
            question: "Question 1",
            answers: [
              { text: "Answer 1", selected: false },
              { text: "Answer 2", selected: false },
              { text: "Answer 3", selected: false },
            ],
          },
          {
            question: "Question 2",
            answers: [
              { text: "Answer 4", selected: false },
              { text: "Answer 5", selected: false },
              { text: "Answer 6", selected: false },
            ],
          },
        ],
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // check if the list of iterations is rendered
  it("renders a list of iterations", () => {
    const { getByText } = render(<DashboardView />);
    expect(getByText("Iteration 1 Test")).toBeInTheDocument();
    expect(getByText("Iteration 2 Test")).toBeInTheDocument();
    expect(getByText("Iteration 3 Test")).toBeInTheDocument();
  });

  // check if the create new iteration button is working
  it("calls the startView prop to open CreateQuestionnaireView in App.jsx when the create new iteration button is clicked", () => {
    const startView = jest.fn();
    const { getByText } = render(<DashboardView startView={startView} />);
    const createNewIterationButton = getByText("Create New Iteration");
    fireEvent.click(createNewIterationButton);
    expect(startView).toHaveBeenCalledTimes(1);
    expect(startView).toHaveBeenCalledWith("create-iteration");
  });

  // check if the iteration showcase is rendered
  it("shows an iteration in the showcase when an iteration from the list is clicked", () => {
    const { getByText, getByTestId } = render(<DashboardView />);

    // click on the first iteration
    const iteration = getByText("Iteration 1 Test");
    fireEvent.click(iteration);

    // check if the div with the class iteration showcase is rendered
    expect(
      document.querySelector(".iteration-showcase-container")
    ).toBeInTheDocument();

    // check if the heading in the iteration showcase has the correct title
    const selectedTitle = getByTestId("selected-iteration-title");
    expect(selectedTitle.textContent).toBe("Iteration 1 Test");
  });

  // check if the clear all iterations button is working
  it("clears all iterations when the clear all iterations button is clicked", () => {
    const { queryByText } = render(<DashboardView />);
    const clearAllIterationsButton = queryByText("Clear All Iterations");
    fireEvent.click(clearAllIterationsButton);

    expect(localStorageHelper.clearAllIterations).toHaveBeenCalledTimes(1);

    // Check that the iteration elements are no longer in the document
    expect(queryByText("Iteration 1 Test")).not.toBeInTheDocument();
    expect(queryByText("Iteration 2 Test")).not.toBeInTheDocument();
    expect(queryByText("Iteration 3 Test")).not.toBeInTheDocument();
  });
});
