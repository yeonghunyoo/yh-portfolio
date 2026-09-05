import { Strings } from "@generated/Strings";

/**
 * Verbatim <pre> text from the design exports. strings.json collapses whitespace, so the
 * line breaks live here and the matching Strings constant is carried next to each segment;
 * test/codeSamples.test.ts asserts the two stay identical once whitespace is collapsed.
 */
export interface CodeSample {
  readonly text: string;
  readonly strings: string | null;
}

export const CodeSamples = {
  h1: { text: "<div style=\"display:flex;\n     flex-direction:column;\n     ", strings: Strings.HandoffAgent.divStyleDisplayFlexFlexDirection },
  h2: { text: "gap:20px", strings: Strings.HandoffAgent.gap20Px },
  h3: { text: "\">\n  <div style=\"display:flex;\n       justify-content:space-between\">\n    <span style=\"\n      font-family:var(--font-heading);\n      ", strings: Strings.HandoffAgent.divStyleDisplayFlexJustifyContent },
  h4: { text: "font-size:20px", strings: Strings.HandoffAgent.fontSize20Px },
  h5: { text: ";\n      ", strings: null },
  h6: { text: "color:var(--color-accent-300)", strings: Strings.HandoffAgent.colorVarColorAccent300 },
  h7: { text: "\">\n      ", strings: Strings.HandoffAgent.t28F195 },
  h8: { text: "forest", strings: Strings.HandoffAgent.forest2 },
  h9: { text: "</span>\n    <span style=\"font-size:15px\">\n      {{ greetingHole }}</span>\n    <div ", strings: Strings.HandoffAgent.spanSpanStyleFontSize15Px },
  h10: { text: "sc-camel-on-click=\"{{ openSettingsHole }}\"", strings: Strings.HandoffAgent.scCamelOnClick },
  h11: { text: "\n         style=\"width:40px;height:40px\">\n    </div>", strings: Strings.HandoffAgent.styleWidth40PxHeight40PxDiv },
  h12: { text: "{ \"kind\": \"column\",\n  \"style\": { ", strings: null },
  h13: { text: "\"gap\": \"20px\"", strings: Strings.HandoffAgent.gap20Px2 },
  h14: { text: " },\n  \"children\": [\n  { \"kind\": \"row\",\n    \"style\": { \"justify-content\":\n               \"space-between\" },\n    \"children\": [\n    { \"kind\": \"text\",\n      ", strings: null },
  h15: { text: "\"text\": \"Strings.Home.forest\"", strings: Strings.HandoffAgent.textStringsHomeForest },
  h16: { text: ",\n      \"style\": {\n        ", strings: null },
  h17: { text: "\"font-size\": \"20px\"", strings: Strings.HandoffAgent.fontSize20Px2 },
  h18: { text: ",\n        ", strings: null },
  h19: { text: "\"color\": \"DesignTokens.Color.Accent._300\"", strings: Strings.HandoffAgent.colorDesignTokensColorAccent300 },
  h20: { text: " } },\n    { \"kind\": \"text\", \"bind\": \"greeting\" },\n    { \"kind\": \"box\",\n      ", strings: null },
  h21: { text: "\"on_click\": \"openSettings\"", strings: Strings.HandoffAgent.onClickOpenSettings },
  h22: { text: ",\n      \"style\": { \"width\": \"40px\",\n                 \"height\": \"40px\" } }\n    ] } ] }", strings: null },
  h23: { text: "VStack(alignment: .leading,\n       ", strings: Strings.HandoffAgent.vStackAlignmentLeading },
  h24: { text: "spacing: 20", strings: Strings.HandoffAgent.spacing20 },
  h25: { text: ") {\n  HStack(alignment: .top) {\n    VStack(alignment: .leading,\n           spacing: 4) {\n      ", strings: null },
  h26: { text: "Text(Strings.Home.forest)", strings: Strings.HandoffAgent.textStringsHomeForest2 },
  h27: { text: "\n        ", strings: null },
  h28: { text: ".font(Typography.heading(20))", strings: Strings.HandoffAgent.fontTypographyHeading20 },
  h29: { text: "\n        ", strings: null },
  h30: { text: ".foregroundStyle(Palette.accent300)", strings: Strings.HandoffAgent.foregroundStylePaletteAccent300 },
  h31: { text: "\n      Text(model.greeting)\n        .font(Typography.body(15))\n    }\n    Spacer()\n    ", strings: null },
  h32: { text: "Button(action: model.openSettings)", strings: Strings.HandoffAgent.buttonActionModelOpenSettings },
  h33: { text: " {\n      Circle().frame(width: 40, height: 40)\n    }\n  }\n}", strings: null },
  h34: { text: "Column(\n  verticalArrangement =\n    ", strings: Strings.HandoffAgent.columnVerticalArrangement },
  h35: { text: "Arrangement.spacedBy(20.dp)", strings: Strings.HandoffAgent.arrangementSpacedBy20Dp },
  h36: { text: "\n) {\n  Row(\n    horizontalArrangement = Arrangement.SpaceBetween,\n    verticalAlignment = Alignment.Top\n  ) {\n    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {\n      ", strings: null },
  h37: { text: "Text(text = Strings.Home.forest,", strings: Strings.HandoffAgent.textTextStringsHomeForest },
  h38: { text: "\n        ", strings: null },
  h39: { text: "style = Typography.heading(20.sp)", strings: Strings.HandoffAgent.styleTypographyHeading20Sp },
  h40: { text: ",\n        ", strings: null },
  h41: { text: "color = Palette.accent300", strings: Strings.HandoffAgent.colorPaletteAccent300 },
  h42: { text: ")\n      Text(text = model.greeting,\n        style = Typography.body(15.sp))\n    }\n    ", strings: null },
  h43: { text: "IconButton(onClick = model::openSettings)", strings: Strings.HandoffAgent.iconButtonOnClickModelOpenSettings },
  h44: { text: " {\n      Box(Modifier.size(40.dp).clip(CircleShape))\n    }\n  }\n}", strings: null },
  h45: { text: "// generated by the server; never edit\npublic enum Strings {\n  public enum Home {\n    public static let chucheonMiksing = \"추천 믹싱\"\n    public static let forest = \"forest\"\n    public static let ibeonJuIlYeonsok = \"이번 주 {streakCount}일 연속\"\n    public static let jeulgyeochatgi = \"즐겨찾기\"\n  }", strings: null },
  h46: { text: "// generated by the server; never edit\nobject Strings {\n  object Home {\n    const val chucheonMiksing = \"추천 믹싱\"\n    const val forest = \"forest\"\n    const val ibeonJuIlYeonsok = \"이번 주 {streakCount}일 연속\"\n    const val jeulgyeochatgi = \"즐겨찾기\"\n  }", strings: null },
  h47: { text: "openapi: 3.0.3\ninfo:\n  title: forest API\n  description: |\n    디자인 화면 4개(onboarding · home · sound · stats)와 공유 컴포넌트가\n    필요로 하는 데이터만 담는다.\n    범위 밖(디자인에 화면이 없어 만들지 않는다):\n    - 로그인/회원가입 화면이 없다 → 기기 익명 등록으로 계정을 만들고 JWT 를 발급한다.\n    - 확장 음원 브라우징 UI 가 없다 → 카탈로그·다운로드 URL 만 제공한다.\n    - 결제/구독 구매 화면이 없다 → 구독 상태는 읽기 전용, 관리·내역은 외부 링크로 넘긴다.\npaths:\n  /auth/device:\n    post:\n      operationId: registerDevice\n      summary: 기기 익명 등록 — 계정 생성 또는 기존 계정 재획득 후 토큰 발급", strings: Strings.HandoffAgent.openapi303InfoTitle },
  h48: { text: "· wrangler.toml 의 REPLACE_WITH_D1_DATABASE_ID\n  → `npx wrangler d1 create forest` 로 만든 실제 id 로 교체\n\n· JWT_SECRET 은 Worker 시크릿으로만 넣는다\n  → npx wrangler secret put JWT_SECRET  (32바이트 이상 랜덤)\n  → 저장소에는 자리표시자만 있다\n\n· 배포 전 원격 마이그레이션 적용\n  → npx wrangler d1 migrations apply forest --remote", strings: Strings.HandoffAgent.wranglerTomlUiReplacewithd1 },
} as const satisfies Record<string, CodeSample>;
