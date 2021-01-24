import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useOriginate } from "../../hooks/useOriginate";
import { AppState } from "../../store";

const Circle = styled(withTheme(Paper))((props) => ({
  background: props.theme.palette.secondary.main,
  height: 186,
  width: 186,
  borderRadius: "50%",
  boxShadow: "none",
  marginBottom: 49,
}));

const WaitingText = styled(Typography)({
  marginTop: 9,
});

export const Review: React.FC = () => {
  const test = useSelector<AppState, AppState["saveDaoInformationReducer"]>(
    (state) => state.saveDaoInformationReducer
  );

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <Circle />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" color="textSecondary">
            Deploying <strong> My Great Token </strong> to the Tezos Network
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <WaitingText variant="subtitle1" color="textSecondary">
            Waiting for confirmation...
          </WaitingText>
        </Grid>
      </Grid>
    </>
  );
};
