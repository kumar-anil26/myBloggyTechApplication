export default function calculateReadingTime(content) {
  const wordPerMinutes = 200;
  const totalWords = content?.split().length;
  const readingTime = Math.ceil(totalWords / wordPerMinutes);
  return readingTime;
}
