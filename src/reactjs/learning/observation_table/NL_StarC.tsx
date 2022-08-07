import DFA_NFA from "../../../lib/automaton/regular/DFA_NFA";
import DataStructure from "../../../lib/learning/learners/DataStructure.interface";
import NL_star from "../../../lib/learning/learners/observation_table/NL_Star";
import TeacherDFA from "../../../lib/learning/teachers/TeacherDFA";
import { toEps } from "../../../lib/tools";
import { PropReact } from "../LearnerFatherC";
import Learner_OT_FatherC from "./Learner_OT_FatherC";

export default class NL_StarC extends Learner_OT_FatherC {
  createNewLearner(regex: string | DFA_NFA): NL_star {
    return new NL_star(new TeacherDFA({ type: regex instanceof DFA_NFA ? "Automaton" : "Regex", automaton: regex }))
  }

  dataStructureToNodeElement(ds: DataStructure) {
    return super.dataStructureToNodeElement(ds, (this.state.learner as NL_star).primeLines)
  }

  constructor(prop: PropReact) {
    super(prop, "E")
  }
  closeMessage(closeRep: string) {
    return <span>The table is not <i>closed</i> since row(<i>{closeRep}</i>) is <i>Prime</i> and is not present in <i>S</i>. "{closeRep}" will be moved from <i>SA</i> to <i>S</i>.</span >;
  }

  consistentMessage(s1: string, s2: string, newCol: string) {
    let fstChar = newCol[0],
      sndChar = newCol.length === 1 ? "ε" : newCol.substring(1);
    return <span>The table is not <i>consistent</i> since :
      row({toEps(s1)}) ⊑ row({toEps(s2)}) but row({s1 + newCol[0]}) ⋢ row({s2 + newCol[0]});
      The column "{fstChar} ∘ {sndChar}" will be added in <i>E</i> since T({toEps(s1)} ∘ {newCol}) ⋢ T({toEps(s2)} ∘ {newCol})</span>
  }
}