import React from "react";
import { Table } from "react-bootstrap";
import ObservationTable from "../../../lib/learning/learners/observation_table/ObservationTable";
import { toEps } from "../../../lib/tools";

interface Prop { dataStructure: ObservationTable; }

export class ObservationTableC extends React.Component<Prop>{
  createTable(name: string, cnt: string[]) {
    return cnt.map((S, pos) => <tr key={S + "trs"}>
      {pos === 0 ?
        <React.Fragment key={pos}>
          <th rowSpan={cnt.length} style={{ width: "3pt" }}>{name}</th>
          <th>{toEps(S)}</th>
        </React.Fragment> :
        <th key={pos}>{toEps(S)}</th>}
      {[...this.props.dataStructure.assoc[S]].map((char, pos) => <td key={pos}>{char}</td>)}</tr>)
  }


  render(): React.ReactElement {
    return <Table responsive striped className="align-middle text-center">
      <thead>
        <tr>
          <th></th>
          <th>Table</th>
          {this.props.dataStructure.E.map((e, pos) => <th key={"Header" + pos}>{toEps(e)}</th>)}
        </tr>
      </thead>
      <tbody>
        {this.createTable("S", this.props.dataStructure.S)}
        {this.createTable("SA", this.props.dataStructure.SA)}
      </tbody>
    </Table>
  }
}