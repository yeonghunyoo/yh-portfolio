import { Strings } from "@generated/Strings";
import { caseLabels } from "./common";

/** The date the prices were re-read. Printed as-is by the design; no Strings key. */
const CHECKED_ON = "2026-09-04";

/** Screens.s4 — 05 백엔드 스펙 (케이스 스터디 2). */
export const backendSpec = {
  kicker: Strings.Shared.keiseuSeuteodi2,
  title: Strings.Shared.baekendeuInpeuraSeupekMunseoMandeulgi,
  labels: caseLabels,

  problem: Strings.Shared.baekendeuInpeuraGuseongeunJuyoGineungYecheuk,

  approach: {
    lead: Strings.Shared.eijeonteugaGineunggwaInteobyuGibanJeokjeongSujunui,
    emphasis: Strings.Shared.bogiSwipgePyoroJean,
    tail: Strings.Shared.hagoYujeoneunJeonghaejunJohapeulSeontaekhageonaJayuropge,
  },

  interview: {
    title: Strings.Shared.inpeuraGyeoljeong4DangyeInteobyuGak,
    steps: [
      {
        name: Strings.Shared._1Seutaek,
        note: Strings.Shared.peulraetpomgwaBaekendeuEoneoreulHubo23,
      },
      { name: Strings.Shared._2Gyumo, note: Strings.Shared.yesangMaudauReulSayongjagaDaeryak },
      { name: Strings.Shared._3HuboChurigi, note: Strings.Shared._12GaeJohapJungGeuGyumoe },
      {
        name: Strings.Shared._4YogeumJohoe,
        note: Strings.Shared.gongsikYogeumPeijimanIkeumKaesiEoli,
      },
    ],
  },

  apiSpec: {
    title: Strings.Shared.aPiMyeongse,
    note: {
      lead: Strings.Shared.inpeuragaJeonghaejimyeonHwamyeonHtmlGwaGaebal,
      emphasis: Strings.Shared.gakHwamyeoniPilyoroHaneunDeiteo,
      middle: Strings.Shared.eseoEndeupointeureulPpopa,
      file: Strings.Shared.openapiYaml,
      tail: Strings.Shared.choaneulSaengseonghapnidaDijainHandoffPaekijigaSeolgye,
    },
  },

  result: {
    lead: Strings.Shared.wolBiyongHwakinilJongsokseongJangdanjeomeulSsan,
    scale: {
      label: Strings.Shared.gyumo,
      emphasis: Strings.Shared.sogyumo,
      tail: Strings.Shared.mAu10000Dau1000,
    },
    headers: {
      id: Strings.Shared.id,
      db: Strings.Shared.db,
      auth: Strings.Shared.auth,
      hosting: Strings.Shared.hosting,
      cost: Strings.Shared.wolBiyong,
      checkedOn: Strings.Shared.hwakinil,
      lockIn: Strings.Shared.jongsokseong,
    },
    /** The five candidate combinations, cheapest first — the design's own order. */
    combos: [
      {
        id: Strings.Shared.awsServerless,
        db: Strings.Shared.dynamoDb,
        auth: Strings.Shared.cognito,
        hosting: Strings.Shared.lambdaApigw,
        cost: Strings.Shared._05,
        checkedOn: CHECKED_ON,
        lockIn: Strings.Shared.nopeum,
      },
      {
        id: Strings.Shared.vpsDocker,
        db: Strings.Shared.postgreSqlJache,
        auth: Strings.Shared.jacheJwt,
        hosting: Strings.Shared.vPsHetzner,
        cost: Strings.Shared._410,
        checkedOn: CHECKED_ON,
        lockIn: Strings.Shared.nateum,
      },
      {
        id: Strings.Shared.firebase,
        db: Strings.Shared.firestore,
        auth: Strings.Shared.firebaseAuth,
        hosting: Strings.Shared.cloudRun,
        cost: Strings.Shared._010,
        checkedOn: CHECKED_ON,
        lockIn: Strings.Shared.nopeum,
      },
      {
        id: Strings.Shared.railway,
        db: Strings.Shared.postgreSqlRailway,
        auth: Strings.Shared.jacheJwt,
        hosting: Strings.Shared.railway2,
        cost: Strings.Shared._525,
        checkedOn: CHECKED_ON,
        lockIn: Strings.Shared.nateum,
      },
      {
        id: Strings.Shared.supabaseFly,
        db: Strings.Shared.postgreSqlSupabase,
        auth: Strings.Shared.supabaseAuth,
        hosting: Strings.Shared.flyIo,
        cost: Strings.Shared._030,
        checkedOn: CHECKED_ON,
        lockIn: Strings.Shared.jung,
      },
    ],
    notes: {
      summary: Strings.Shared.inteobyugaKkeutnamyeonYoyakpyoroJeongridoeeoDaeumDangyero,
      report: {
        lead: Strings.Shared.guhyeonWanryoHuBaekendeuSujeongiPilyohan,
        emphasis: Strings.Shared.sayongjaegeBogoseoroJechul,
        tail: Strings.Shared.haneunPeuroseseuEijeonteugaImuiroPandanhaeSucharye,
      },
      why: Strings.Shared.bogoseogaPilyohanIyuEijeonteuuiJayulseongiChaireul,
    },
  },
} as const;
