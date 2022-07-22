import AlphabetVPA from "../AlphabetVPA";
import { StateVPA } from "../state_vpa";
import VPA from "../VPA";

/**
 * @returns a VPA for the test
 */
let createVPA1 = (): VPA => {
  let alphabet = new AlphabetVPA({ CALL: ["A"], RET: ["B", "C"], INT: ["I"] })
  let stack_alphabet = ["0"]
  let state1 = new StateVPA({ name: "1", isAccepting: true, alphabet, stackAlphabet: stack_alphabet })
  let state2 = new StateVPA({ name: "2", isInitial: true, alphabet, stackAlphabet: stack_alphabet })
  state1.addTransition({ symbol: "I", successor: state1 })
  state2.addTransition({ symbol: "I", successor: state1 })
  state2.addTransition({ symbol: "B", topStack: "0", successor: state1 })
  state1.addTransition({ symbol: "B", topStack: "0", successor: state1 })
  state2.addTransition({ symbol: "A", topStack: "0", successor: state2 })
  let vpa = new VPA([state1, state2])
  return vpa
}

let createVPA2 = (): VPA => {
  let alphabet = new AlphabetVPA({ CALL: ["A"], RET: ["B", "C"], INT: ["I"] })
  let stack_alphabet = ["2"]
  let state1 = new StateVPA({ name: "1", isAccepting: true, isInitial: true, alphabet, stackAlphabet: stack_alphabet })
  state1.addTransition({ symbol: "I", successor: state1 })
  state1.addTransition({ symbol: "A", topStack: "2", successor: state1 })
  state1.addTransition({ symbol: "B", topStack: "2", successor: state1 })
  let vpa = new VPA([state1])
  return vpa
}

test("State VPA creation", () => {
  let alphabet = new AlphabetVPA({ CALL: ["A"], RET: ["B", "C"], INT: ["I"] })
  let stack_alphabet = ["0", "1"]
  let state1 = new StateVPA({ name: "1", alphabet, stackAlphabet: stack_alphabet })
  let state2 = new StateVPA({ name: "2", alphabet, stackAlphabet: stack_alphabet })
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
})

test("VPA to DOT", () => {
  console.log(createVPA1().toDot());
})

test("VPA complete test", () => {
  let vpa = createVPA1()
  console.log(vpa.toDot());

  vpa.complete()
  console.log(vpa.toDot());
})

test("Word membership VPA", () => {
  let vpa = createVPA1()
  expect(vpa.acceptWord("AAAIBIIII")).toBeFalsy()
  expect(vpa.acceptWord("AAAIBIIIIBB")).toBeTruthy()
  expect(vpa.acceptWord("AAAIBIIIIB")).toBeFalsy();
  expect(vpa.acceptWord("AAAIBIIIIBBB")).toBeFalsy();
  expect(vpa.acceptWord("I")).toBeTruthy()
  expect(vpa.acceptWord("AB")).toBeTruthy()
})

test("Deterministic VPA", () => {
  let vpa = createVPA1()
  expect(vpa.isDeterministic()).toBeTruthy();
})

test("Union VPA", () => {
  let vpa1 = createVPA1()
  let vpa2 = createVPA2()
  let union = vpa1.union(vpa2)
  console.log(union.toDot());
})

test("Intersection VPA", () => {
  let vpa1 = createVPA1()
  let vpa2 = createVPA2()
  let intersection = vpa1.intersection(vpa2)
  console.log(intersection.toDot());
})