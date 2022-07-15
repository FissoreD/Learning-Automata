import Automaton from "../../automaton/fsm/DFA_NFA";
import State from "../../automaton/fsm/state";
import Teacher from "./teacher";

/**
 * let A = teacher.automaton, B = automaton
 * res = (A union B) / (A inter B)
 * @param teacher 
 * @param automaton 
 * @returns undifined if res = empty else the shortes word in res
 */
export let equivalenceFunction = (teacher: Teacher, automaton: Automaton): string | undefined => {
  let counterExemple = (automatonDiff: Automaton): string | undefined => {
    let stateList = automatonDiff.all_states()
    if (automatonDiff.accepting_states().length === 0) return undefined;
    let toExplore = Array.from(automatonDiff.initialStates)
    let explored: State[] = []
    type parentChild = { parent: State | undefined, symbol: string }
    let parent: parentChild[] = new Array(stateList.length).fill({ parent: undefined, symbol: "" });
    while (toExplore.length > 0) {
      const current = toExplore.shift()!
      if (explored.includes(current)) continue;
      explored.push(current)
      for (const [symbol, states] of current.get_all_out_transitions()) {
        if (!explored.includes(states[0])) {
          parent[stateList.indexOf(states[0])] =
            { parent: current, symbol: symbol }
          if (!toExplore.includes(states[0])) toExplore.push(states[0])
        }
      }


      if (automatonDiff.accepting_states().includes(current)) {
        let id = stateList.indexOf(current);
        let res: string[] = [parent[id].symbol]
        while (parent[id].parent) {
          id = stateList.indexOf(parent[id].parent!)
          res.push(parent[id].symbol)
        }
        return res.reverse().join("");
      }
    }
    return "";
  }

  let autom_minimized = automaton.minimize();
  let diff1 = teacher.automaton!.difference(autom_minimized);
  let counterEx1 = counterExemple(diff1);

  let diff2 = autom_minimized.difference(teacher.automaton!);
  let counterEx2 = counterExemple(diff2);

  if (counterEx1 === undefined) return counterEx2;
  if (counterEx2 === undefined) return counterEx1;

  return counterEx1.length < counterEx2.length ? counterEx1 : counterEx2;
}