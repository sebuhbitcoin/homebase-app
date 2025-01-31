import { Button, styled } from "@material-ui/core";

export const PrimaryButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
  [theme.breakpoints.down("sm")]: {
    borderWidth: 3,
    borderRadius: 6,
    minWidth: 113,
  },
}));
