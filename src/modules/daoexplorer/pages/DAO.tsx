import React, { useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  styled,
  Typography
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

import HouseIcon from "../../../assets/logos/house.svg";
import VotingIcon from "../../../assets/logos/voting.svg";
import VotingPeriodIcon from "../../../assets/logos/votingPeriod.svg";
import VoteTimeIcon from "../../../assets/logos/voteTime.svg";
import {
  mapProposalData,
  ProposalTableRow,
  ProposalTableRowData
} from "../components/ProposalTableRow";
import { useHistory, useParams } from "react-router-dom";
import { TokenHoldersDialog } from "../components/TokenHoldersDialog";
import { useDAO } from "../../../services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "../../../services/contracts/baseDAO/hooks/useProposals";
import { ProposalStatus } from "../../../services/bakingBad/proposals/types";
import Timer from "react-compound-timer";

const SideBar = styled(Grid)({
  width: 102,
  borderRight: "2px solid #3D3D3D"
});

const MainContainer = styled(Grid)({
  minHeight: 325,
  padding: "40px 112px",
  borderBottom: "2px solid #3D3D3D"
});

const SidebarButton = styled(IconButton)({
  paddingTop: 32,
  width: "100%"
});

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40
});

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)"
}));

const DAOInfoTitleAndDesc = styled(Grid)({
  maxWidth: 600,
  marginBottom: 40
});

const DAOInfoVotingPeriod = styled(Grid)({
  minWidth: 320
});

const BigIconContainer = styled(Box)({
  width: 112,

  "& > img": {
    display: "block",
    margin: "auto"
  }
});

const StatsContainer = styled(Grid)({
  height: 175,
  borderBottom: "2px solid #3D3D3D"
});

const StatsBox = styled(Grid)({
  borderRight: "2px solid #3D3D3D",
  width: "unset"
});

const TokensLocked = styled(StatsBox)({
  padding: "0 50px 0 112px"
});

const VotingAddresses = styled(StatsBox)({
  minWidth: 250
});

const ActiveProposals = styled(StatsBox)({
  paddingLeft: "42px"
});

const LockedTokensBar = styled(LinearProgress)({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: "#3D3D3D"
  }
});

const TableContainer = styled(Box)({
  width: "100%",
  padding: "72px 112px",
  boxSizing: "border-box",
  paddingBottom: "24px"
});

const TableHeader = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  paddingBottom: 20
});

const UnderlineText = styled(Typography)({
  textDecoration: "underline",
  cursor: "pointer",
  marginBottom: 28
});

const CustomH1 = styled(Typography)({
  fontSize: 55,
  lineHeight: "92px",
  textDecoration: "underline",
  fontWeight: 400
});

const ProposalTableHeadText: React.FC = ({ children }) => (
  <Typography variant="subtitle1" color="textSecondary">
    {children}
  </Typography>
);

const ProposalTableHeadTextRight: React.FC = ({ children }) => (
  <Typography variant="subtitle1" color="textSecondary" align="center">
    {children}
  </Typography>
);

export const DAO: React.FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data } = useDAO(id);

  const name = data && data.unfrozenToken.name;
  const description = data && data.description;
  const symbol = data && data.unfrozenToken.symbol.toUpperCase();
  const amountLocked = useMemo(() => {
    if (!data) {
      setIsLoading(true);
      return 0;
    }

    return data.ledger.reduce((acc, current) => {
      const frozenBalance = current.balances[1] || 0;
      setIsLoading(false);
      return acc + frozenBalance;
    }, 0);
  }, [data]);

  const addressesWithUnfrozenBalance = useMemo(() => {
    if (!data) {
      setIsLoading(true);
      return 0;
    }

    return data.ledger.reduce((acc, current) => {
      const frozenBalance = current.balances[0];
      if (frozenBalance) {
        return acc + 1;
      }
      setIsLoading(false);
      return acc;
    }, 0);
  }, [data]);

  const { data: proposalsData } = useProposals(data ? data.address : "");

  const activeProposals = useMemo<ProposalTableRowData[]>(() => {
    if (!proposalsData) {
      return [];
    }

    return proposalsData
      .filter(proposalData => proposalData.status === ProposalStatus.ACTIVE)
      .map(proposal => mapProposalData(proposal, data?.address));
  }, [data?.address, proposalsData]);

  return (
    <PageLayout container wrap="nowrap">
      <SideBar item>
        <SidebarButton>
          <img src={HouseIcon} />
        </SidebarButton>
        <SidebarButton>
          <img src={VotingIcon} />
        </SidebarButton>
      </SideBar>
      {!isLoading ? (
        <Grid item xs>
          <MainContainer container justify="space-between">
            <DAOInfoTitleAndDesc item>
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  {symbol}
                </Typography>
              </Box>
              <Box paddingBottom="10px">
                <CustomH1  color="textSecondary">
                  {name}
                </CustomH1>
              </Box>
              <Box>
                <Typography variant="body1" color="textSecondary">
                  {description}
                </Typography>
              </Box>
            </DAOInfoTitleAndDesc>
            <DAOInfoVotingPeriod item>
              <Box paddingBottom="32px">
                <Grid container>
                  <Grid item>
                    <BigIconContainer>
                      <img src={VotingPeriodIcon} />
                    </BigIconContainer>
                  </Grid>
                  <Grid item>
                    <Box paddingLeft="35px">
                      <Box>
                        <Typography variant="subtitle2" color="secondary">
                          PERIOD
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h3" color="textSecondary">
                          Voting
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box paddingBottom="32px">
                <Grid container>
                  <Grid item>
                    <BigIconContainer>
                      <img src={VoteTimeIcon} />
                    </BigIconContainer>
                  </Grid>
                  <Grid item>
                    <Box paddingLeft="35px">
                      <Box>
                        <Typography variant="subtitle2" color="secondary">
                          TIME LEFT TO VOTE
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h3" color="textSecondary">
                          <Timer initialTime={54555000} startImmediately={true}>
                            {() => (
                              <React.Fragment>
                                <Box>
                                  <Timer.Days />d <Timer.Hours />h{" "}
                                  <Timer.Minutes />m
                                </Box>
                              </React.Fragment>
                            )}
                          </Timer>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DAOInfoVotingPeriod>
          </MainContainer>
          <StatsContainer container>
            <TokensLocked
              item
              xs={6}
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Box>
                    <Typography variant="subtitle2" color="secondary">
                      {symbol} Locked
                    </Typography>
                  </Box>
                  <Box padding="12px 0">
                    <Typography variant="h3" color="textSecondary">
                      {amountLocked}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <TokenHoldersDialog address={id} />
                </Grid>
              </Grid>
              <LockedTokensBar
                variant="determinate"
                value={60}
                color="secondary"
              />
            </TokensLocked>
            <VotingAddresses
              item
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  VOTING ADDRESSES
                </Typography>
                <Typography variant="h3" color="textSecondary">
                  {addressesWithUnfrozenBalance}
                </Typography>
              </Box>
            </VotingAddresses>
            <ActiveProposals
              item
              xs
              container
              direction="column"
              justify="center"
            >
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  ACTIVE PROPOSALS
                </Typography>
                <Typography variant="h3" color="textSecondary">
                  {activeProposals.length}
                </Typography>
              </Box>
            </ActiveProposals>
          </StatsContainer>
          <TableContainer>
            <TableHeader container wrap="nowrap">
              <Grid item xs={5}>
                <ProposalTableHeadText>ACTIVE PROPOSALS</ProposalTableHeadText>
              </Grid>
              <Grid item xs={2}>
                <ProposalTableHeadText>CYCLE</ProposalTableHeadText>
              </Grid>
              <Grid item xs={5}>
                <ProposalTableHeadText>STATUS</ProposalTableHeadText>
              </Grid>
            </TableHeader>
            {activeProposals.map((proposal, i) => (
              <ProposalTableRow key={`proposal-${i}`} {...proposal} />
            ))}
          </TableContainer>
          <Grid container direction="row" justify="center">
            <UnderlineText
              variant="subtitle1"
              color="textSecondary"
              onClick={() => history.push(`/explorer/proposals/${id}`)}
            >
              VIEW ALL PROPOSALS
            </UnderlineText>
          </Grid>

          <TableContainer>
            <TableHeader container wrap="nowrap">
              <Grid item xs={5}>
                <ProposalTableHeadText>TOP TOKEN HOLDERS BY ADDRESS</ProposalTableHeadText>
              </Grid>
              <Grid item xs={3}>
                <ProposalTableHeadTextRight>VOTES</ProposalTableHeadTextRight>
              </Grid>
              <Grid item xs={3}>
                <ProposalTableHeadTextRight>WEIGHT</ProposalTableHeadTextRight>
              </Grid>
              <Grid item xs={3}>
                <ProposalTableHeadTextRight>WEIGHT</ProposalTableHeadTextRight>
              </Grid>
            </TableHeader>
            {activeProposals.map((proposal, i) => (
              <ProposalTableRow key={`proposal-${i}`} {...proposal} />
            ))}
          </TableContainer>
        </Grid>
      ) : (
        <LoaderContainer container direction="row" justify="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      )}
    </PageLayout>
  );
};
