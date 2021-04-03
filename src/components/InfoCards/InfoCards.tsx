import React from "react";
import { useState } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoCards.css";
import CountUp from "react-countup";

function InfoCards(props: {
  active: React.ReactNode;
  title: React.ReactNode;
  cases: number;
  total: number;
  onClick;
}) {
  const [shadow, SetShadow] = useState(false);

  const handleMouseOver = () => {
    SetShadow(true);
  };

  const handleMouseOut = () => {
    SetShadow(false);
  };

  return (
    <Card
      className={props.active ? "App__card App__card--selected" : "App__card"}
      onClick={props.onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      raised={shadow}
    >
      <CardContent>
        <Typography className="Box__title" color="textSecondary">
          {props.title}
        </Typography>
        <h2 className="Box__cases">
          <CountUp start={0} end={props.cases} duration={2} separator="." />
        </h2>
        <Typography className="Box__total" color="textSecondary">
          Total:{" "}
          <CountUp start={0} end={props.total} duration={2} separator="." />
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoCards;
