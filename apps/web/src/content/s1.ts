import { Strings } from "@generated/Strings";

/**
 * Screens.s1 — 02 구성.
 *
 * Each card is `lead <b>emphasis</b>tail` or `lead <b>emphasis</b> tail`; the
 * template joins them exactly as the design's markup does.
 */
export const composition = {
  title: Strings.Shared.peulreogeuinGuseong,
  mcpServer: {
    lead: Strings.Shared.dijainJeongjeBaekendeuInpeuraSeupekInteobyu,
    emphasis: Strings.Shared.mCpSeobeo,
    tail: Strings.Shared.roGuchuk,
  },
  generatedConstants: {
    lead: Strings.Shared.jungganSanchulmuleunGakPeulraetpomeMatneun,
    emphasis: Strings.Shared.swiftKotlin,
    tail: Strings.Shared.deungEoneoroSaengseongdoeeoEijeonteueNeomgyeojim,
  },
  openapi: {
    lead: Strings.Shared.pythonGibanMcpGa,
    emphasis: Strings.Shared.openApi,
    tail: Strings.Shared.gibanBaekendeuSeupekeulJeanJoriphayeoMunseo,
  },
  agents: {
    lead: Strings.Shared.peulraetpomIosAndroidBackendEijeonteu,
    platformCount: Strings.Shared._3Gae,
    designAgent: Strings.Shared.dijainYeondongEijeonteu,
    designAgentCount: Strings.Shared._1Gae,
  },
} as const;
