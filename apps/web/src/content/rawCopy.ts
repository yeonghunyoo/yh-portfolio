/**
 * Copy the design exports carry in an *attribute*, which strings.json does not collect —
 * so these have no `Strings.*` key and are kept verbatim, exactly as the prototype
 * writes them. Nothing here is invented; each one is listed in the build report under
 * human_check so a key can be added to the contract if the human wants one.
 *
 *   title1        `title` of the theme button          (all three exports)
 *   alt1..alt4    `alt` of the four Forest screenshots (Resume.dc.html, Forest.dc.html)
 *   alt5          `alt` of the lightbox image          (Forest.dc.html, Handoff Agent.dc.html)
 *   alt6..alt10   `alt` of the five comparison shots   (Handoff Agent.dc.html)
 *   themeLight/themeMint  the toggle's two labels, Latin text with no Strings entry
 */
export const RawCopy = {
  title1: "테마 전환",
  alt1: "Forest 온보딩",
  alt2: "Forest 홈",
  alt3: "Forest 사운드",
  alt4: "Forest 기록",
  alt5: "확대 이미지",
  alt6: "온보딩 화면 비교",
  alt7: "홈 화면 비교",
  alt8: "사운드 화면 비교",
  alt9: "기록 화면 비교",
  alt10: "추가 비교",
  themeLight: "Light",
  themeMint: "Mint",
} as const;
