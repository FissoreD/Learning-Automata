import { StateVPA } from "../../../lib/automaton/fsm/state_vpa";
import { VPA } from "../../../lib/automaton/fsm/VPA";

/**
 * Return a VPA where :  
 * 
 */
let make_vpa = (): VPA => {
  let alphabet = { CALL: ["A"], RET: ["B", "C"], INT: ["I"] }
  let stack_alphabet = ["0"]
  let state1 = new StateVPA({ name: "state1", isAccepting: true, alphabet, stackAlphabet: stack_alphabet })
  let state2 = new StateVPA({ name: "state2", isInitial: true, alphabet, stackAlphabet: stack_alphabet })
  state1.addTransition({ symbol: "I", successor: state1 })
  state2.addTransition({ symbol: "I", successor: state1 })
  state2.addTransition({ symbol: "B", topStack: "0", successor: state1 })
  state1.addTransition({ symbol: "B", topStack: "0", successor: state1 })
  state2.addTransition({ symbol: "A", topStack: "0", successor: state2 })
  let vpa = new VPA([state1, state2])
  return vpa
}

test("State VPA creation", () => {
  let alphabet = { CALL: ["A"], RET: ["B", "C"], INT: ["I"] }
  let stack_alphabet = ["0", "1"]
  let state1 = new StateVPA({ name: "state1", alphabet, stackAlphabet: stack_alphabet })
  let state2 = new StateVPA({ name: "state2", alphabet, stackAlphabet: stack_alphabet })
  state1.addTransition({ symbol: "I", successor: state1 })
  state2.addTransition({ symbol: "I", successor: state1 })
  state2.addTransition({ symbol: "B", topStack: "0", successor: state1 })
  state2.addTransition({ symbol: "A", topStack: "0", successor: state1 })
  state2.addTransition({ symbol: "A", topStack: "0", successor: state1 })

  // TESTING INT
  expect(state1.getSuccessor({ symbol: "I" })[0]).toBe(state1)
  expect(state2.getSuccessor({ symbol: "I" })[0]).toBe(state1)
  expect(state1.getPredecessor({ symbol: "I" }).includes(state1)).toBeTruthy()
  expect(state1.getPredecessor({ symbol: "I" }).includes(state2)).toBeTruthy()

  // TESTING RET
  expect(state2.getSuccessor({ symbol: "B", topStack: "0" })[0]).toBe(state1)
  expect(state1.getPredecessor({ symbol: "B", topStack: "0" })[0]).toBe(state2)

  // Not existing transition (should return an empty list)
  expect(state1.getSuccessor({ symbol: "C", topStack: "0" }).length === 0).toBeTruthy()
})

test("VPA to DOT", () => {
  console.log(make_vpa().toDot());
})

test("VPA to DOT", () => {
  let vpa = make_vpa()
  vpa.complete()
  console.log(vpa.toDot());
})

test("Word membership VPA", () => {
  let vpa = make_vpa()
  expect(vpa.acceptWord("AAAIBIIII")).toBeFalsy()
  expect(vpa.acceptWord("AAAIBIIIIBB")).toBeTruthy()
  expect(vpa.acceptWord("AAAIBIIIIB")).toBeFalsy();
  expect(vpa.acceptWord("AAAIBIIIIBBB")).toBeFalsy();
  expect(vpa.acceptWord("I")).toBeTruthy()
  expect(vpa.acceptWord("AB")).toBeTruthy()
})