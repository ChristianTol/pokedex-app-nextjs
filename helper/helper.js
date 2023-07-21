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

export const darkenColor = (color, percentage) => {
  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percentage);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  const newColor = (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1);
  return "#" + newColor;
};
