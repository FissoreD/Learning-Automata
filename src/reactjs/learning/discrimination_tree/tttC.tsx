import { ReactElement } from "react";
import DiscriminationTree from "../../../lib/learning/learners/discrimination_tree/discrimination_tree";
import TTT from "../../../lib/learning/learners/discrimination_tree/TTT";
import LearningDataStructure from "../../../lib/learning/learners/learning_data_structure";
import { TeacherAutomaton } from "../../../lib/learning/teachers/teacher_automaton";
import { LearnerSection, MessageType, StateReact } from "../learner_sectionC";
import DiscriminationTreeC from "./discrimination_tree_c";

export default class TTTC extends LearnerSection<TTT> {
  createNewLearner(regex: string): TTT {
    return new TTT(new TeacherAutomaton({ type: "Regex", automaton: regex }))
  }

  dataStructureToNodeElement(ds: LearningDataStructure): ReactElement {
    return <DiscriminationTreeC dt={ds.clone() as DiscriminationTree} />
  }

  nextOpChild(state: StateReact<TTT>): StateReact<TTT> {
    let learner = this.state.learner
    if (learner.finish) return state;
    var message: { type: MessageType, val: string };
    if (state.doNext) {
      if (learner.toStabilizeHypothesis()) {
        message = { type: "HYP-STAB", val: "The hypothesis is not stable since " + learner.lastCe!.value + ` should ${!learner.lastCe!.accepted ? "not" : ""} be accepted.\n` + learner.splitToString() }
      } else {
        message = { type: "SEND-HYP", val: `${learner.lastCe?.value} is finally correctly placed in the automaton.\nThis automaton will be sent as a conjecture` }
      }
    } else {
      this.state.learner.makeNextQuery()
      let oldMsg = state.memory[state.position].message
      message = { ...oldMsg };
      if (learner.finish) {
        message = { type: "END", val: "The teacher has accepted the last conjecture" }
      } else
        switch (oldMsg.type) {
          case "HYP-STAB": {
            message.val = `The conjecture should be stabilized.\n Note: ${learner.lastCe?.value} is still ${!learner.lastCe?.accepted ? "" : "not"} accepted by the hypotheses.`
            break;
          }
          case "SEND-HYP":
            message.val = "The conjecture has been sent, but the teacher has provided the counter-example " + learner.lastCe?.value
            break;
          case "END":
            return state
          default: throw new Error("You should not be here")
        }
    }
    let memory = state.memory;

    memory.push({
      message, dataStructure: learner.dataStructure.clone(),
      automaton: learner.makeAutomaton()!.clone()
    })
    let position = state.position + 1
    state = { position, doNext: !state.doNext, memory, learner: state.learner, showRegexDialog: false }
    return state
  }
}