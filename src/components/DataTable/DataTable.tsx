import React from "react";
import { numberToCommas } from "../../utilities/util";
import "./DataTable.css";
import CountUp from "react-countup";

function DataTable(props: any) {
  return (
    <div className="table">
      {props.data.map((element: { country: any; cases: any }) => (
        <tr>
          <td>{element.country}</td>
          <td>
            <strong>
              <CountUp
                start={0}
                end={element.cases}
                duration={2}
                separator="."
              />
            </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default DataTable;
