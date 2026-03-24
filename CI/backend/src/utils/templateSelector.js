export const chooseTemplate = ({ careerLevel, skills = [], projects = [] }) => {
  if (careerLevel === "experienced") {
    return "professional";
  }

  if (projects.length >= 3 || skills.length >= 6) {
    return "modern";
  }

  return "compact";
};
