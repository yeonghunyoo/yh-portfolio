import { Strings } from "@generated/Strings";

/**
 * The eight code samples of screen s3/s4/s5.
 *
 * These render inside `<pre>`, so their line breaks are part of the design. The
 * generated `Strings.Shared.*` constants for them collapse every run of whitespace
 * to a single space (the extractor normalises markup text), which would print the
 * samples as one long line. So the sample text lives here with its line breaks and
 * `assertCodeSamplesMatchStrings()` proves — at build time and in the test suite —
 * that collapsing it reproduces the contracted constant exactly. Any drift in the
 * contract fails the build instead of silently diverging.
 */

/** The five elements the hover highlight ties together across the four samples. */
export type TokenKey = "gap" | "size" | "color" | "text" | "click";

/** Key of the generated `Strings.Shared` table. */
export type SharedStringKey = keyof typeof Strings.Shared;

export interface CodePart {
  readonly text: string;
  /** Present on the parts that participate in the cross-sample highlight. */
  readonly tok?: TokenKey;
  /** `Strings.Shared` key this part must reproduce, when the contract has one. */
  readonly strings?: SharedStringKey;
}

export interface CodeSample {
  readonly title: string;
  readonly parts: readonly CodePart[];
}

/**
 * `{{ greetingHole }}` / `{{ openSettingsHole }}` are prototype template holes; the
 * prototype substitutes them with the literal text below before painting, which is
 * what the reader sees. The Strings extractor captured the unsubstituted form with
 * single braces, so the assertion substitutes back before comparing.
 */
const HOLES: Readonly<Record<string, string>> = {
  "{{ greeting }}": "{greetingHole}",
  '"{{ openSettings }}"': '"{openSettingsHole}"',
};

/** ① Claude Design HTML — design/project/forest.dc.html */
const SAMPLE_HTML: CodeSample = {
  title: Strings.Shared.claudeDesignHtmlDesignProjectForest,
  parts: [
    {
      strings: "divStyleDisplayFlexFlexDirection",
      text: '<div style="display:flex;\n     flex-direction:column;\n     ',
    },
    { tok: "gap", strings: "gap20Px", text: "gap:20px" },
    {
      strings: "divStyleDisplayFlexJustifyContent",
      text: '">\n  <div style="display:flex;\n       justify-content:space-between">\n    <span style="\n      font-family:var(--font-heading);\n      ',
    },
    { tok: "size", strings: "fontSize20Px", text: "font-size:20px" },
    { text: ";\n      " },
    { tok: "color", strings: "colorVarColorAccent300", text: "color:var(--color-accent-300)" },
    { strings: "t28F195", text: '">\n      ' },
    { tok: "text", strings: "forest2", text: "forest" },
    {
      strings: "spanSpanStyleFontSize15Px",
      text: '</span>\n    <span style="font-size:15px">\n      {{ greeting }}</span>\n    <div ',
    },
    { tok: "click", strings: "scCamelOnClick", text: 'sc-camel-on-click="{{ openSettings }}"' },
    {
      strings: "styleWidth40PxHeight40PxDiv",
      text: '\n         style="width:40px;height:40px">\n    </div>',
    },
  ],
};

/** ② The layout tree the server derives — design/derived/layout/home.json */
const SAMPLE_TREE: CodeSample = {
  title: Strings.Shared.seobeogaMandeunReiautTeuriDesignDerived,
  parts: [
    { text: '{ "kind": "column",\n  "style": { ' },
    { tok: "gap", strings: "gap20Px2", text: '"gap": "20px"' },
    {
      text: ' },\n  "children": [\n  { "kind": "row",\n    "style": { "justify-content":\n               "space-between" },\n    "children": [\n    { "kind": "text",\n      ',
    },
    { tok: "text", strings: "textStringsHomeForest", text: '"text": "Strings.Home.forest"' },
    { text: ',\n      "style": {\n        ' },
    { tok: "size", strings: "fontSize20Px2", text: '"font-size": "20px"' },
    { text: ",\n        " },
    {
      tok: "color",
      strings: "colorDesignTokensColorAccent300",
      text: '"color": "DesignTokens.Color.Accent._300"',
    },
    {
      text: ' } },\n    { "kind": "text", "bind": "greeting" },\n    { "kind": "box",\n      ',
    },
    { tok: "click", strings: "onClickOpenSettings", text: '"on_click": "openSettings"' },
    {
      text: ',\n      "style": { "width": "40px",\n                 "height": "40px" } }\n    ] } ] }',
    },
  ],
};

/** ③ SwiftUI, written by the iOS agent — apps/ios/Forest/Screens/HomeView.swift */
const SAMPLE_SWIFT: CodeSample = {
  title: Strings.Shared.iOsEijeonteugaOmginSwiftUiAppsIos,
  parts: [
    { strings: "vStackAlignmentLeading", text: "VStack(alignment: .leading,\n       " },
    { tok: "gap", strings: "spacing20", text: "spacing: 20" },
    {
      text: ") {\n  HStack(alignment: .top) {\n    VStack(alignment: .leading,\n           spacing: 4) {\n      ",
    },
    { tok: "text", strings: "textStringsHomeForest2", text: "Text(Strings.Home.forest)" },
    { text: "\n        " },
    { tok: "size", strings: "fontTypographyHeading20", text: ".font(Typography.heading(20))" },
    { text: "\n        " },
    {
      tok: "color",
      strings: "foregroundStylePaletteAccent300",
      text: ".foregroundStyle(Palette.accent300)",
    },
    {
      text: "\n      Text(model.greeting)\n        .font(Typography.body(15))\n    }\n    Spacer()\n    ",
    },
    {
      tok: "click",
      strings: "buttonActionModelOpenSettings",
      text: "Button(action: model.openSettings)",
    },
    { text: " {\n      Circle().frame(width: 40, height: 40)\n    }\n  }\n}" },
  ],
};

/** ④ Compose, written by the Android agent — apps/android/.../ui/screens/HomeScreen.kt */
const SAMPLE_COMPOSE: CodeSample = {
  title: Strings.Shared.androidEijeonteugaOmginComposeAppsAndroid,
  parts: [
    {
      strings: "columnScCamelVerticalArrangement",
      text: "Column(\n  sc-camel-vertical-arrangement =\n    ",
    },
    { tok: "gap", strings: "arrangementSpacedBy20Dp", text: "Arrangement.spacedBy(20.dp)" },
    {
      text: "\n) {\n  Row(\n    sc-camel-horizontal-arrangement = Arrangement.SpaceBetween,\n    sc-camel-vertical-alignment = Alignment.Top\n  ) {\n    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {\n      ",
    },
    { tok: "text", strings: "textTextStringsHomeForest", text: "Text(text = Strings.Home.forest," },
    { text: "\n        " },
    { tok: "size", strings: "styleTypographyHeading20Sp", text: "style = Typography.heading(20.sp)" },
    { text: ",\n        " },
    { tok: "color", strings: "colorPaletteAccent300", text: "color = Palette.accent300" },
    {
      text: ")\n      Text(text = model.greeting,\n        style = Typography.body(15.sp))\n    }\n    ",
    },
    {
      tok: "click",
      strings: "iconButtonOnClickModelOpenSettings",
      text: "IconButton(onClick = model::openSettings)",
    },
    { text: " {\n      Box(Modifier.size(40.dp).clip(CircleShape))\n    }\n  }\n}" },
  ],
};

/** The four samples of the HTML → tree → native walkthrough, in reading order. */
export const TRANSLATION_SAMPLES: readonly CodeSample[] = [
  SAMPLE_HTML,
  SAMPLE_TREE,
  SAMPLE_SWIFT,
  SAMPLE_COMPOSE,
];

/** Generated-constants cards. Neither sample carries a Strings key in the contract. */
export const GENERATED_STRINGS_SWIFT = `// generated by the server; never edit
public enum Strings {
  public enum Home {
    public static let sc-camel-chucheon-miksing = "추천 믹싱"
    public static let forest = "forest"
    public static let sc-camel-ibeon-ju-il-yeonsok = "이번 주 {streakCount}일 연속"
    public static let jeulgyeochatgi = "즐겨찾기"
  }`;

export const GENERATED_STRINGS_KOTLIN = `// generated by the server; never edit
object Strings {
  object Home {
    const val sc-camel-chucheon-miksing = "추천 믹싱"
    const val forest = "forest"
    const val sc-camel-ibeon-ju-il-yeonsok = "이번 주 {streakCount}일 연속"
    const val jeulgyeochatgi = "즐겨찾기"
  }`;

/** s4 — the openapi.yaml draft. `Strings.Shared.openapi303InfoTitle`. */
export const OPENAPI_DRAFT = `openapi: 3.0.3
info:
  title: forest API
  description: |
    디자인 화면 4개(onboarding · home · sound · stats)와 공유 컴포넌트가
    필요로 하는 데이터만 담는다.
    범위 밖(디자인에 화면이 없어 만들지 않는다):
    - 로그인/회원가입 화면이 없다 → 기기 익명 등록으로 계정을 만들고 JWT 를 발급한다.
    - 확장 음원 브라우징 UI 가 없다 → 카탈로그·다운로드 URL 만 제공한다.
    - 결제/구독 구매 화면이 없다 → 구독 상태는 읽기 전용, 관리·내역은 외부 링크로 넘긴다.
paths:
  /auth/device:
    post:
      operationId: registerDevice
      summary: 기기 익명 등록 — 계정 생성 또는 기존 계정 재획득 후 토큰 발급`;

/** s5 — how the agent nudges the human to fill secrets in. `Strings.Shared.wranglerTomlUiReplacewithd1`. */
export const SECRET_NUDGE = `· wrangler.toml 의 REPLACE_WITH_D1_DATABASE_ID
  → \`npx wrangler d1 create forest\` 로 만든 실제 id 로 교체

· JWT_SECRET 은 Worker 시크릿으로만 넣는다
  → npx wrangler secret put JWT_SECRET  (32바이트 이상 랜덤)
  → 저장소에는 자리표시자만 있다

· 배포 전 원격 마이그레이션 적용
  → npx wrangler d1 migrations apply forest --remote`;

const collapse = (value: string): string => value.trim().split(/\s+/).join(" ");

const substituteHoles = (value: string): string =>
  Object.entries(HOLES).reduce((acc, [rendered, raw]) => acc.split(rendered).join(raw), value);

function expect(key: SharedStringKey, actual: string): string | null {
  const wanted = Strings.Shared[key];
  const got = substituteHoles(collapse(actual));
  return got === wanted ? null : `Strings.Shared.${key}\n  contract: ${wanted}\n  rendered: ${got}`;
}

/**
 * Every code fragment that has a Strings key must collapse to exactly that value.
 * Called from the s3/s4/s5 sections at build time and from the test suite.
 */
export function assertCodeSamplesMatchStrings(): void {
  const problems: string[] = [];

  for (const sample of TRANSLATION_SAMPLES) {
    for (const part of sample.parts) {
      if (!part.strings) continue;
      const problem = expect(part.strings, part.text);
      if (problem) problems.push(problem);
    }
  }

  const standalone: ReadonlyArray<readonly [SharedStringKey, string]> = [
    ["openapi303InfoTitle", OPENAPI_DRAFT],
    ["wranglerTomlUiReplacewithd1", SECRET_NUDGE],
  ];
  for (const [key, value] of standalone) {
    const problem = expect(key, value);
    if (problem) problems.push(problem);
  }

  if (problems.length > 0) {
    throw new Error(
      `code samples no longer match shared/generated/Strings.ts:\n${problems.join("\n")}`,
    );
  }
}
