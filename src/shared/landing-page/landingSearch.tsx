import React from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  Box,
  TextField,
  Grid,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';

//--------------------------
//CSS
//--------------------------
const searchStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      '& label.MuiInputLabel-root': {
        color: theme.palette.primary.dark,
      },
      '& label.Mui-focused': {
        color: theme.palette.secondary.light,
      },
      '& .MuiInputBase-input': {
        color: theme.palette.primary.dark, // Text color
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: theme.palette.secondary.light,
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: theme.palette.secondary.light,
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.secondary.light,
      },
    },
    select: {
      color: theme.palette.secondary.light,
    },
    rightBorder: {
      '& .MuiTabs-indicator': {
        color: theme.palette.primary.dark,
      },
    },
  }),
);

//--------------------------
//Tab Search bar
//--------------------------
const filter = createFilterOptions<salonOption>();

function LandingPageSearch() {
  const classes = searchStyles();

  const [value, setValue] = React.useState<salonOption | null>(null);
  const [open, toggleOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      salon: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    salon: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue({
      salon: dialogValue.salon,
    });
    handleClose();
  };

  return (
    <Box m={1}>
      <Autocomplete
        /**********************************/
        /*             SEARCH             */
        /**********************************/
        value={value}
        //NEEDS ADJUSTMENTS
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                salon: newValue,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              salon: newValue.inputValue,
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params) as salonOption[];

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              salon: `Not Found`,
            });
          }

          return filtered;
        }}
        id="salonSearchOption"
        options={demoSalons}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.salon;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(option) => option.salon}
        freeSolo
        renderInput={(params) => (
          <Grid container alignItems="flex-end">
            <Grid item>
              <SearchIcon />
            </Grid>
            <Grid item xs={10} sm={5}>
              <TextField
                className={classes.textField}
                {...params}
                label="Search"
              />
            </Grid>
          </Grid>
        )}
      />
    </Box>
  );
}

interface salonOption {
  inputValue?: string;
  salon: string;
}

const demoSalons: salonOption[] = [
  { salon: 'SALON 1' },
  { salon: 'SALON 2' },
  { salon: 'SALON 3' },
  { salon: 'SALON 4' },
  { salon: 'SALON 5' },
];

export default LandingPageSearch;
