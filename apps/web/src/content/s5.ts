import { Strings } from "@generated/Strings";
import { caseLabels, links } from "./common";

/** Screens.s5 — 06 시크릿 격리 (케이스 스터디 3). */
export const secretIsolation = {
  kicker: Strings.Shared.keiseuSeuteodi3,
  title: Strings.Shared.gonggaeBaepoJeonjeSikeuriteulPaipeuraineDeuliji,
  labels: caseLabels,

  problem: Strings.Shared.aPiKiMingamJeongbogaKeulraudeuSesyeongwa,

  implementation: {
    lead: Strings.Shared.mingamGaleul,
    envOnly: Strings.Shared.hwangyeongbyeonsuroman,
    middle: Strings.Shared.gwanrihayeoJikjeopGaliNochuldoejiAndorokHago,
    hook: Strings.Shared.hukeuroMakneunda,
    /** The full stop that closes the line. Punctuation only — no Strings key. */
    fullStop: ".",
  },

  result: {
    lead: Strings.Shared.saengseongdoenPeurojekteuuiGonggaeJeojangsoGaebalDojung,
    count: Strings.Shared._0Gae2,
    tail: Strings.Shared.hwangyeongbyeonsumanNochulBildeoEijeonteudeuliGyeolgwamuleulNaemyeon,
    nudgeTitle: Strings.Shared.eijeonteuuiYudoYesi,
  },

  cta: {
    kicker: Strings.Shared.iDoguroMandeulgoItneunSeobiseu,
    title: Strings.Shared.forestSaundeuMiksingJipjungMyeongsangAep,
    action: Strings.Shared.daeumPeurojekteu,
    href: links.profile,
  },
} as const;
