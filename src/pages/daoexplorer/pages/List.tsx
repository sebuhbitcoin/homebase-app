import {
  Box,
  Button,
  Grid,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchInput } from "../components/SearchInput";
import { MockDAOs } from "../../../store/mock/mock";

const GridContainer = styled(Grid)({
  paddingRight: "6%",
  paddingLeft: "6%",
  paddingTop: "4%",
  marginBottom: 60,
  background: "inherit",
});

const StyledButton = styled(Button)({
  height: 69,
});

const TotalDao = styled(Typography)({
  marginRight: 37,
  lineHeight: "124.3%",
  letterSpacing: "-0.01em",
});

const DaoContainer = styled(withTheme(Grid))((props) => ({
  height: 179,
  border: "2px solid #3D3D3D",
  boxSizing: "border-box",
  background: props.theme.palette.primary.main,
  boxShadow: "none",
  borderRadius: 0,
  paddingTop: 42,
  borderTop: "none",
  "&:nth-child(odd)": {
    borderLeft: "none",
    paddingLeft: "6%",
  },
  "&:nth-child(even)": {
    borderRight: "none",
    borderLeft: "none",
    paddingLeft: "3%",
    paddingRight: "6%",
  },
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
    cursor: "pointer",
  },
}));

const GridBackground = styled(Grid)({
  background: "inherit",
  borderTop: "2px solid #3D3D3D",
});

export const DAOsList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [currentDAOs, setCurrentDAOs] = useState(MockDAOs);

  const history = useHistory();

  const filterDAOs = (filter: string) => {
    setSearchText(filter);
    const filtered = MockDAOs.filter((dao: any) => {
      return dao.name.toLowerCase().includes(searchText);
    });
    if (filtered.length > 0 && filter !== "") {
      setCurrentDAOs(filtered);
    } else {
      setCurrentDAOs(MockDAOs);
    }
    return;
  };

  return (
    <Box bgcolor="primary.main" width="100%" height="100%">
      <GridContainer container direction="row" alignItems="center">
        <Grid item xs={6}>
          <SearchInput search={filterDAOs} />
        </Grid>
        <Grid
          container
          item
          direction="row"
          justify="flex-end"
          alignItems="center"
          alignContent="center"
          xs={6}
        >
          <TotalDao color="textSecondary" variant="subtitle1">
            {currentDAOs.length} DAOs
          </TotalDao>
          <StyledButton
            color="secondary"
            variant="outlined"
            onClick={() => history.push("/creator")}
          >
            Create DAO
          </StyledButton>
        </Grid>
      </GridContainer>
      <GridBackground container direction="row">
        {currentDAOs.map((dao: any) => {
          return (
            <DaoContainer
              item
              xs={12}
              sm={6}
              key={dao.symbol}
              onClick={() =>
                history.push("/explorer/dao/" + dao.id, { dao: dao })
              }
            >
              <Typography variant="subtitle1" color="secondary">
                {dao.symbol}
              </Typography>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5" color="textSecondary">
                    {dao.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {dao.voting_addresses} VOTING ADDRESSES
                  </Typography>
                </Grid>
              </Grid>
            </DaoContainer>
          );
        })}
      </GridBackground>
    </Box>
  );
};
