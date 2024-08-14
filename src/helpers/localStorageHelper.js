/**
 * add new iteration to local storage item "myIterations"
 * @param { object } newIteration
 * @returns { boolean } true if success
 */
export const addIterationToLocalStorage = (newIteration) => {
  try {
    if (localStorage.getItem("myIterations") === null) {
      localStorage.setItem("myIterations", JSON.stringify([]));
    }
    let myIterations = JSON.parse(localStorage.getItem("myIterations"));
    myIterations.push(newIteration);
    localStorage.setItem("myIterations", JSON.stringify(myIterations));
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

/**
 *
 * @returns { array } myIterations from local storage
 */
export const getMyIterationsfromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("myIterations"));
};

/**
 * remove iteration from local storage item "myIterations"
 * @param { number } id
 * @returns { boolean } true if success
 */
export const removeIterationFromLocalStorage = (id) => {
  try {
    let myIterations = JSON.parse(localStorage.getItem("myIterations"));
    myIterations = myIterations.filter((iteration) => iteration.id !== id);
    localStorage.setItem("myIterations", JSON.stringify(myIterations));
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

/**
 * clear all iterations from local storage
 */
export const clearAllIterations = () => {
  // clear all iterations from local storage
  localStorage.removeItem("myIterations");
};
