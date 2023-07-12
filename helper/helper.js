export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const cleanDropdownWords = (x) => {
  let formattedOption = x;
  if (x.includes("-")) {
    const words = x.split("-");
    if (words.length === 2) {
      formattedOption =
        words[0].charAt(0).toUpperCase() +
        words[0].slice(1) +
        " & " +
        words[1].charAt(0).toUpperCase() +
        words[1].slice(1);
    } else {
      formattedOption = words
        .map((word, index) => {
          if (index === 1) {
            return word.charAt(0).toUpperCase() + word.slice(1) + " &";
          }
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
  } else {
    formattedOption = x.charAt(0).toUpperCase() + x.slice(1);
  }
};

export const cleanWords = (x) => {
  // Capitalize first letter of each word based on word length
  const formattedOption = x;
  const words = x.split("-");
  if (words.length === 2) {
    formattedOption =
      words[0].charAt(0).toUpperCase() +
      words[0].slice(1) +
      " " +
      words[1].charAt(0).toUpperCase() +
      words[1].slice(1);
  } else if (words.length === 3) {
    formattedOption =
      words[0].charAt(0).toUpperCase() +
      words[0].slice(1) +
      " " +
      words[1].charAt(0) +
      words[1].slice(1) +
      " " +
      words[2].charAt(0).toUpperCase() +
      words[2].slice(1);
  } else {
    formattedOption = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  return formattedOption;
};
