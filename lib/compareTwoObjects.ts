export function compareTwoObjects(
  obj1: { [key: string]: string },
  obj2: { [key: string]: string }
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  );

  return true;
}
