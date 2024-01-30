export function getInitials(name: string | undefined) {
  if (!name) return "CN";
  const words = name.split(" ").slice(0, 3);
  let initials = "";

  words.forEach((word) => {
    if (word.length > 0) {
      initials += word[0].toUpperCase();
    }
  });

  return initials;
}
