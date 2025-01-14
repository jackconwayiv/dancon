export function formatTab(
  tab: string | false | undefined,
  toneSteps: number
): string[] {
  const splitTab = (tab || "")
    .replaceAll("[tab]", "")
    .replaceAll("[/tab]", "")
    .replaceAll("\r\n", "\n")
    .split("\n");

  let tabStartIndex = 0;
  const capoArray = splitTab.filter((e) => e.toLowerCase().includes("capo"));
  for (let i = 0; i < splitTab.length; i++) {
    if (splitTab[i].includes("[ch]")) {
      tabStartIndex = i;
      break;
    }
  }
  const trimmedTab = splitTab.slice(tabStartIndex, splitTab.length);
  const capoDisplay = capoArray[0] || [];
  const transposeDisplay =
    toneSteps != 0 ? "transposed " + toneSteps + " steps" : "";
  const capoAndTranspositionDisplay = capoDisplay + " " + transposeDisplay;
  const fixedTab = [capoAndTranspositionDisplay, ...trimmedTab];
  return fixedTab;
}

export function splitTabIntoColumns(
  tab: string[],
  maxLength: number
): string[][] {
  let linesInColumnCount = 0;
  return tab.reduce(
    (acc, cur) => {
      const isFinalLine = linesInColumnCount % maxLength === maxLength - 1;
      const hasChords = cur.includes("[ch]");
      const curColumn =
        Math.floor(linesInColumnCount / maxLength) +
        (isFinalLine && hasChords ? 1 : 0);

      linesInColumnCount++;
      if (isFinalLine && hasChords) {
        // if we're moving the line to the next column because it has chords,
        // add to the lines in column count so we don't get off by one in the
        // next column
        linesInColumnCount++;
      }

      return [...acc.slice(0, curColumn), [...(acc[curColumn] || []), cur]];
    },
    [[]] as string[][]
  );
}

export function countTabColumns(
  tab: string | false | undefined,
  maxColumnLength: number
): number {
  return splitTabIntoColumns(formatTab(tab, 0), maxColumnLength).length;
}
