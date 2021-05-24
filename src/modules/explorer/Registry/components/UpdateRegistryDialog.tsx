import React, { useCallback } from "react";
import {
  Grid,
  styled,
  Switch,
  Typography,
  Paper,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { Form, Field, FieldArray, FormikProps, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import { fromRegistryListFile, validateRegistryListJSON } from "../pages/utils";
import { useNotification } from "modules/common/hooks/useNotification";
import {
  CustomTextarea,
  DescriptionContainer,
} from "modules/explorer/components/ProposalTextContainer";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";
import { Registry } from "services/contracts/baseDAO";

const UploadButtonContainer = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  padding: "0px 24px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const FileInput = styled("input")({
  display: "none",
});

const BatchBar = styled(Grid)(({ theme }) => ({
  height: 60,
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
  cursor: "pointer",
  overflowX: "auto",
}));

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const TransferActive = styled(Grid)({
  height: 53,
  minWidth: 51,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AddButton = styled(Paper)({
  marginLeft: 12,
  minHeight: 31,
  minWidth: 31,
  textAlign: "center",
  padding: 0,
  background: "#383939",
  color: "#fff",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
});

const styles = {
  visible: {
    display: "none",
  },
  active: {
    background: "#3866F9",
  },
  show: {
    visibility: "visible",
  },
  hide: {
    visibility: "hidden",
  },
};

const UploadFileLabel = styled("label")(({ theme }) => ({
  height: 53,
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
  cursor: "pointer",
  margin: "auto",
  display: "block",
}));

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

export const EMPTY_LIST_ITEM: Registry = { key: "", value: "" };

export const INITIAL_REGISTRY_FORM_VALUES: UpdateRegistryDialogValues = {
  list: [EMPTY_LIST_ITEM],
  agoraPostId: "0"
};

export const validateUpdateRegistryForm = (
  values: UpdateRegistryDialogValues
): FormikErrors<UpdateRegistryDialogValues> => {
  const errors: Record<string, any> = {
    list: values.list.map(() => ({})),
  };

  values.list.forEach((item, i) => {
    if (!item.key) {
      errors.list[i].key = "Required";
    }

    if (!item.value) {
      errors.list[i].value = "Required";
    }
  });

  return errors;
};

export interface UpdateRegistryDialogValues {
  list: Registry[];
  agoraPostId: string;
}

export const UpdateRegistryDialog: React.FC<
  FormikProps<UpdateRegistryDialogValues>
> = ({ values, setFieldValue, errors, touched, setTouched }) => {
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(1);
  const openNotification = useNotification();

  const keyError = (errors.list?.[activeItem - 1] as any)?.key;
  const valueError = (errors.list?.[activeItem - 1] as any)?.value;

  const importList = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files) {
        try {
          const file = event.currentTarget.files[0];
          const registryListParsed = await fromRegistryListFile(file);
          console.log(registryListParsed);
          const errors = validateRegistryListJSON(registryListParsed);
          console.log(errors);
          if (errors.length) {
            openNotification({
              message: "Error while parsing JSON",
              persist: true,
              variant: "error",
            });
            return;
          }
          setIsBatch(true);
          values.list = registryListParsed;
        } catch (e) {
          openNotification({
            message: "Error while parsing JSON",
            persist: true,
            variant: "error",
          });
        }
      }
    },
    [openNotification, values]
  );

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <ProposalFormListItem container direction="row">
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Add Batches?
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <SwitchContainer item xs={12} justify="flex-end">
                <Switch
                  checked={isBatch}
                  onChange={() => {
                    setIsBatch(!isBatch);
                    return;
                  }}
                  name="checkedA"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </SwitchContainer>
            </Grid>
          </ProposalFormListItem>

          <Form autoComplete="off">
            <>
              <FieldArray
                name="list"
                render={(arrayHelpers) => (
                  <>
                    {isBatch ? (
                      <BatchBar container direction="row" wrap="nowrap">
                        {values.list.map((_, index) => {
                          return (
                            <TransferActive
                              item
                              key={index}
                              onClick={() => setActiveItem(index + 1)}
                              style={
                                Number(index + 1) === activeItem
                                  ? styles.active
                                  : undefined
                              }
                            >
                              <Typography
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                #{index + 1}
                              </Typography>
                            </TransferActive>
                          );
                        })}

                        <AddButton
                          onClick={() => {
                            arrayHelpers.insert(
                              values.list.length + 1,
                              EMPTY_LIST_ITEM
                            );
                            setActiveItem(activeItem + 1);
                          }}
                        >
                          +
                        </AddButton>
                      </BatchBar>
                    ) : null}

                    <ProposalFormListItem container direction="row">
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Key
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <SwitchContainer item xs={12} justify="flex-end">
                          <Field
                            name={`list.${activeItem - 1}.key`}
                            type="string"
                            placeholder="Type a Key"
                            component={CustomTextField}
                          />
                          {keyError && touched.list?.[activeItem - 1]?.key ? (
                            <ErrorText>{keyError}</ErrorText>
                          ) : null}
                        </SwitchContainer>
                      </Grid>
                    </ProposalFormListItem>

                    <DescriptionContainer container direction="row">
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justify="space-between"
                        >
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Value
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name={`list.${activeItem - 1}.value`}
                          multiline
                          type="string"
                          rows={6}
                          placeholder="Type a value"
                          component={CustomTextarea}
                          onChange={(e: any) => {
                            setFieldValue(
                              `list.${activeItem - 1}.value`,
                              e.target.value
                            );

                            const listVals: any = touched.list;
                            listVals[activeItem - 1] = {
                              ...listVals[activeItem - 1],
                              value: true,
                            };

                            setTouched({
                              ...touched,
                              list: listVals,
                            });
                          }}
                        />
                        {valueError && touched.list?.[activeItem - 1]?.value ? (
                          <ErrorText>{valueError}</ErrorText>
                        ) : null}
                      </Grid>
                    </DescriptionContainer>
                  </>
                )}
              />

              <UploadButtonContainer container direction="row">
                <UploadFileLabel>
                  -OR- UPLOAD JSON FILE
                  <FileInput type="file" accept=".json" onChange={importList} />
                </UploadFileLabel>
              </UploadButtonContainer>
            </>
          </Form>
        </DialogContentText>
      </DialogContent>
    </>
  );
};
