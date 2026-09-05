import { Strings } from "@generated/Strings";
import { caseLabels } from "./common";

/** Screens.s3 — 04 UI/UX 정합성 (케이스 스터디 1). */
export const uiParity = {
  kicker: Strings.Shared.keiseuSeuteodi1,
  title: Strings.Shared.uIuxGuhyeonJeonghapseongeulWihanGyuchik,
  labels: caseLabels,

  problem: {
    lead: Strings.Shared.claudeDesignINaebonaeneunHtmlEun,
    bullets: [
      Strings.Shared.hwamyeon5Gaega917JulPail,
      Strings.Shared.seosikiJeonbuInrainStyle166Gae,
      Strings.Shared.aepeEolneunPeurototaipJangsikiSeokyeoIteum,
    ],
  },

  approach: {
    lead: Strings.Shared.makeudaunGibanSanmunEuroIrueojinSoft,
    emphasis: Strings.Shared.suchihwadoenMunseoSanchulmuleulKodeuGibanPaipeuraineuro,
    tail: Strings.Shared.hagoIreulGibaneuroEijeonteugaJayulseongeulGajigo,
  },

  refinement: {
    title: Strings.Shared._1ClaudeDesignUiHandoffPaekijireul,
    note: {
      lead: Strings.Shared.gateunYosoGap20MunguSaek,
      legend: Strings.Shared.jeomseonMitjul,
      tail: Strings.Shared.bubuneMauseureulOlrimyeonNameojiKodeueseoGateun,
    },
    numbersTitle: Strings.Shared.jeongjeJeonhuuiIpryeokeulSutjaroBomyeon,
    /** before → after, one row each */
    rows: [
      { label: Strings.Shared._917JulHanPail, value: Strings.Shared.hwamyeondangTeuri4Gae321243 },
      { label: Strings.Shared.saekRiteoreol119Gae, value: Strings.Shared._0Gae },
      {
        label: Strings.Shared.ireumEoldeonMunguAikonDongjak,
        value: Strings.Shared.mungu80Aikon10Haendeulreo25,
      },
      { label: Strings.Shared.peurototaipJangsik, value: Strings.Shared.jeondalAnHam },
    ],
  },

  generated: {
    title: Strings.Shared._2SeobeogaGongtongRisoseureulGakPeulraetpome,
    note: {
      path: Strings.Shared.sharedGenerated,
      lead: Strings.Shared.eGateunNaeyongiSwiftKotlinEuro,
      constants: Strings.Shared.apiRoutesScreensDesignTokensIcons,
      tail: Strings.Shared.doDuEoneoroSaengseongdoepnida,
    },
    swiftTitle: Strings.Shared.stringsSwift,
    kotlinTitle: Strings.Shared.stringsKt,
  },

  result: {
    lead: Strings.Shared.gateunHwamyeoneulMandeuneunDeEijeonteugaSseuneun,
    panel: {
      title: Strings.Shared.seongneungGeomjeungHandoffPackageJeongjeJeonhu,
      meta: Strings.Shared.homeStatsIosAndroid2Hoe,
      /** The first header cell is empty in the design. */
      headers: [Strings.Shared.aWonbonHtml57Kb, Strings.Shared.bJeongjehanReiautTeuri],
      tokens: {
        label: Strings.Shared.tokeunPyeonggyun,
        before: Strings.Shared._905K,
        after: Strings.Shared._551K,
        delta: Strings.Shared._39,
      },
      parity: {
        label: Strings.Shared.hwamyeonJeonghapseong,
        before: Strings.Shared._8BeonJung7BeonHwamyeoneul,
        after: Strings.Shared.ppatteurinGeonChuchulgigaTeurieAnDameun,
      },
      foot: {
        lead: Strings.Shared.gateunHwamyeoneulGateunModelroGuhyeonhageHago,
        emphasis: Strings.Shared.ipryeokman,
        tail: Strings.Shared.bakkwoBigyoDijainiHwakjeongdoenSanghwangeseonJeonghapseongi,
      },
    },
    compare: {
      title: Strings.Shared.uIuxGuhyeonJeonghapseongBigyo,
      hint: Strings.Shared.oenjjokbuteoBReiautTeuriAhtml,
      /**
       * One entry per comparison shot. `alt` is a plain attribute in the prototype
       * and has no Strings key in the contract — kept verbatim.
       */
      onboarding: { alt: "온보딩 화면 비교", caption: Strings.Shared.onbodingBeoteunWichiYeobaekiAEseo },
      home: { alt: "홈 화면 비교", caption: Strings.Shared.homHadanChucheonMiksingBaechiwaImiji },
      sound: { alt: "사운드 화면 비교", caption: Strings.Shared.saundeuTaimeoDeuropdaunSiUiKkaejim },
      stats: { alt: "기록 화면 비교", caption: Strings.Shared.girokHadanSafeAreaMitJeongryeoliUidowa },
      extra: { alt: "추가 비교", caption: Strings.Shared.geuOeBeoteunTeochiyeongyeokBateomsiteuHaendeul },
    },
  },
} as const;
