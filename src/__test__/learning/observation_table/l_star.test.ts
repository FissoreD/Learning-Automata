import aut from "../../../json/automata.json";
import Automaton from "../../../lib/automaton/fsm/DFA_NFA";
import L_star from "../../../lib/learning/learners/observation_table/l_star";
import { TeacherAutomaton } from "../../../lib/learning/teachers/teacher_automaton";

test("Learner L-Star Angluin", () => {
  let automaton = Automaton.strToAutomaton(`[0]
    a,[0]->[1]
    b,[1]->[2]
    a,[2]->[1]
    [1]`) // a(ab)*
  let teacher = new TeacherAutomaton({ type: "Automaton", automaton })
  let learner = new L_star(teacher)
  learner.makeAllQueries()
  expect(automaton.sameLanguage(learner.automaton!));
})

test("Learner NL-Star Bollig et al", () => {
  let automaton = Automaton.strToAutomaton(`[0]
    a,[0]->[1]
    b,[1]->[2]
    a,[2]->[1]
    [1]`) // a(ab)*
  let teacher = new TeacherAutomaton({ type: "Automaton", automaton })
  let learner = new L_star(teacher)
  learner.makeAllQueries()
  expect(automaton.sameLanguage(learner.automaton!));
})

test("Learner L-Star Angluin", () => {
  let automaton = Automaton.strToAutomaton(aut["(a+b)*a(a+b)^4"])
  let teacher = new TeacherAutomaton({ type: "Automaton", automaton })
  let learner = new L_star(teacher)
  for (let _a = 0; _a < 10; _a++) {
    learner.makeNextQuery()
  }
})