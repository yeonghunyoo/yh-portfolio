/**
 * Behaviour of the `resume` screen, one for one with the design export's component
 * script: state { theme, tab, node, skill, progress } and the handlers
 * pickHandoff · pickForest · onTabKey · enter0..4 · leaveNode · s.enter · leaveSkill ·
 * toggleTheme.
 */
import { Screens } from "@generated/Screens";
import { CareerSkills, type CareerKey } from "../content/skills";
import { bindHandlers, scrollRatio, setBound, setVar, type Handlers } from "./dom";
import { initTheme, toggleTheme } from "./theme";
import { countVisit } from "./pageViews";

interface State {
  tab: 0 | 1;
  node: number;
  skill: string | null;
}

export function initResumeScreen(): void {
  const state: State = { tab: 0, node: -1, skill: null };

  const renderTabs = (): void => {
    setBound("active", (key) => (key === `tab${state.tab}` ? "1" : "0"));
    for (const button of document.querySelectorAll<HTMLElement>('[role="tab"]')) {
      const panel = button.getAttribute("aria-controls");
      button.setAttribute("aria-selected", String(panel === `panel-${state.tab === 0 ? "handoff" : "forest"}`));
    }
    for (const panel of document.querySelectorAll<HTMLElement>("[data-panel]")) {
      panel.hidden = panel.dataset["panel"] !== (state.tab === 0 ? "handoff" : "forest");
    }
  };

  const renderNodes = (): void => setBound("hl", (key) => (key === `hl${state.node}` ? "1" : "0"));

  const renderSkill = (): void => {
    const skill = state.skill;
    setBound("dim", (key) => {
      const set = CareerSkills[key as CareerKey];
      return skill !== null && set !== undefined && !set.includes(skill) ? "1" : "0";
    });
  };

  const setTab = (tab: 0 | 1): void => {
    state.tab = tab;
    state.node = -1;
    renderTabs();
    renderNodes();
  };

  const handlers: Handlers = {
    toggleTheme,
    pickHandoff: () => setTab(0),
    pickForest: () => setTab(1),
    onTabKey: (event) => {
      const key = (event as KeyboardEvent).key;
      if (key === "ArrowRight") setTab(1);
      if (key === "ArrowLeft") setTab(0);
    },
    leaveNode: () => {
      state.node = -1;
      renderNodes();
    },
    leaveSkill: () => {
      state.skill = null;
      renderSkill();
    },
  };
  for (let i = 0; i < 5; i += 1) {
    handlers[`enter${i}`] = () => {
      state.node = i;
      renderNodes();
    };
  }

  initTheme();
  bindHandlers(handlers);

  // `<sc-for list="{{ skills }}" as="s">` bound `s.enter` per item; the item carries
  // its own name instead, so one listener covers the whole list.
  for (const chip of document.querySelectorAll<HTMLElement>("[data-skill]")) {
    chip.addEventListener("mouseenter", () => {
      state.skill = chip.dataset["skill"] ?? null;
      renderSkill();
    });
  }

  const onScroll = (): void => setVar("progressPct", "--progress-pct", `${(scrollRatio() * 100).toFixed(1)}%`);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  renderTabs();
  renderNodes();
  renderSkill();
  countVisit(Screens.resume);
}
