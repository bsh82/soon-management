import React, {ChangeEvent, useState, useRef, forwardRef} from "react";
import {Box, TextField, Select, MenuItem, Button, Checkbox, ListItemText, AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {useForm, SubmitHandler} from "react-hook-form";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {styles} from "@layout/styles";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "react-loading";
import Error from "components/Error/Error";
import {getTitle} from "@layout/header/HeaderConstants";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {selectedCampusState} from "@recoils/campus/state";
import CampusDialog from "@pages/MyProfile/modal/CampusDialog";
import {categoryState} from "@recoils/history/state";
import {HistoryForm, Prayer, User} from "@recoils/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {getSoonHistoryQuery} from "@recoils/soon/query";
import {deleteSoonPray, postSoonPrays, putSoonHistory} from "@recoils/history/axios";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import {FormControlLabel} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {List, ListItem, ListItemButton} from "@mui/material";
import NoData from "@common/NoData";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryEditDialog({historyid, editMode, handleEditMode, data}: any) {
  const ref = useRef(null);
  const campusRef = useRef(null);
  const loginUser: any = useRecoilValue(userState);
  const [campusid, setCampusid] = useState(loginUser?.campus[0]?.campusid);
  const [campusList, setCampusList] = useState([]);
  const [campus, setCampus]: any = useRecoilState(selectedCampusState);
  const [open, setOpen] = useState(false);

  //forwarRef??? ????????? ????????? ????????????, ????????? ????????? ????????? ?????????, ?????? ???????????? initRef/fowardRef  , init ????????? ????????? ??????
  const SubmitButton = forwardRef((props: any, ref: any) => {
    return (
      <Button ref={ref} variant="outlined" type="submit" sx={{display: "none"}}>
        submit ??????
      </Button>
    );
  });
  // useEffect(() => {
  //   const list = loginUser?.campus?.map(({campus}: any) => campus);
  //   setCampusList(list);
  //   if (campus == null && list?.length > 0) {
  //     setCampus(list[0]);
  //   }
  // }, [loginUser, campus]);

  // if (isLoading) return <Loading />;
  // if (isError) return <Error error={error} />;

  const handleCampus = (campus: any) => {
    initHistoryForm(campus);
    setCampus(campus);
    setCampusid(campus?.campusid);
  };

  const onConfirm = () => {
    const target: any = ref.current;
    target?.click();
  };

  const initHistoryForm = (campus: any) => {
    console.log("???????????? ?????????????????? ?????? ????????? ?????????", campus, campus?.campusid);
    const target: any = campusRef.current;
    target?.click();
  };

  const handleClose = () => {
    handleEditMode(false);
  };
  return (
    <>
      <Dialog fullScreen open={editMode} onClose={handleClose} TransitionComponent={Transition}>
        <MyHeader onConfirm={onConfirm} handleClose={handleClose} />
        <Box sx={{textAlign: "center", fontSize: "20px", padding: "20px 0", borderBottom: "1px solid gray"}}>
          <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Box>{campus?.name}</Box>
          </Box>
        </Box>

        <HistoryContents historyid={historyid} SubmitButton={<SubmitButton ref={ref} />} campus={campus} data={data} handleClose={handleClose} />
        {/* <CampusDialog open={open} setOpen={setOpen} items={campusList} campusSelected={campus} handleCampus={handleCampus} /> */}
      </Dialog>
    </>
  );
}

function HistoryContents({historyid, SubmitButton, campus, data, handleClose}: any) {
  const categoryList = useRecoilValue(categoryState);
  // const {historyid} = useParams();
  // console.log("historyid >", historyid);
  const navigate = useNavigate();
  // const {isLoading, isError, data, error} = getSoonHistoryQuery(Number(historyid));

  const {register, handleSubmit, setValue} = useForm<HistoryForm>(); // user

  //FIXME: ????????? ????????? ?????? ????????? ?????? ???????????????, ??????????????? ??????, ?????? ?????? ????????? ?????? ??????
  // {userid: loginUser?.userid, nickname: loginUser?.nickname}
  const [soonjang]: any = useState(data?.soonjang);
  const [soonwon]: any = useState(data?.users);
  const [progress, setProgress]: any = useState(data?.progress);
  const [contents, setContents]: any = useState(data?.contents);
  const [date, setDate]: any = useState(dayjs(data?.historydate).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"));
  const category = categoryList?.find((c: any) => c?.id == data?.kind) || {id: "soon", name: "?????????"};
  const [categorySelected, setCategorySelected]: any = useState(category);

  const [prayList, setPrayLIst] = useState<Prayer[]>(data?.prays);
  const [prayers, setPrayers] = useState<Prayer[]>([]);

  const handleDateChange = (newValue: Dayjs | null) => setDate(newValue);

  const handleCategoryReceive = (event: any) => {
    const value = event.target.value;
    setCategorySelected(value);
  };
  //error ??????....
  const sendHistory: SubmitHandler<HistoryForm> = async (params: HistoryForm) => {
    params.kind = categorySelected?.id;
    params.historydate = new Date(dayjs(date).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"));

    // console.log("params >>", params);

    //*
    const result = await putSoonHistory(historyid, params);
    if (result) {
      alert("??? ???????????? ?????? ??????!");
      handleClose();
      // navigate("/");
    } else {
      console.log("SERVER?????? ???????????? ????????????");
    }
    // */
  };

  const handleAddPrayerField = () => {
    // console.log("handleAddPrayerField >");
    setPrayers([...prayers, {pray: "", publicyn: "Y"}]);
  };
  const handlePraysSave = async () => {
    // console.log("handlePraysSave >", historyid, prayers);
    const {data} = await postSoonPrays(historyid, prayers);
    // console.log("result >>", data);
    if (data?.length > 0) {
      alert("??????????????? ?????????????????????.");
      // console.log(">>>>>>>>>>", [...prayList, ...data]);
      setPrayLIst([...prayList, ...data]);
      setPrayers([]);
    }
  };

  const handlePrayerFieldChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...prayers];
    newValues[index].pray = event.target.value;
    setPrayers(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };
  const handlPublicynChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValues = [...prayers];
    newValues[index].publicyn = event.target.checked ? "Y" : "N"; // Set value to "true" or "false" as a string
    setPrayers(newValues);
    setValue("prays", newValues); // Update the value of the 'prays' field in the form data object
  };
  const handleDeletePrayerField = (index: number) => {
    const newValues = [...prayers];
    newValues.splice(index, 1);
    setPrayers(newValues);
    setValue("prays", newValues);
  };
  const handlePrayRemove = async (prayid: number) => {
    const {data} = await deleteSoonPray(prayid);
    if (data?.affected > 0) {
      alert(" ????????? ?????? ???????????????!");
      const idx = prayList?.findIndex((item: any) => item?.prayid == prayid);
      if (idx > -1) {
        setPrayLIst([...prayList.slice(0, idx), ...prayList.slice(idx + 1, prayList?.length)]);
      }
    }
  };

  const prayView = prayList?.map(({prayid, pray, publicyn}: any) => (
    <ListItemButton dense={true} key={prayid} sx={{display: "flex"}}>
      <ListItem>
        <ListItemText>
          {publicyn == "N" && "[?????????] "}
          {pray}
        </ListItemText>
        {
          <IconButton onClick={() => handlePrayRemove(prayid)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        }
      </ListItem>
    </ListItemButton>
  ));

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(sendHistory)}
        sx={[
          styles.web.container,
          styles.web.writeform,
          {
            ".row": {display: "flex", alignItems: "center", marginTop: "5px"},
            ".header": {minWidth: "95px", textAlign: "right", paddingRight: "10px", fontSize: "16px"},
            ".value": {width: "100%"},
          },
        ]}>
        <Box className="row">
          <Box className="header">??????</Box>
          <Box className="value">
            <TextField size="small" fullWidth value={soonjang?.nickname} InputProps={{readOnly: true}} />
          </Box>
        </Box>
        <Box className="row">
          {/* ????????????.. ?????? ?????? */}
          <Box className="header">??????</Box>
          <Box className="value">
            <Select size="small" value={categorySelected} fullWidth onChange={handleCategoryReceive} renderValue={(selected: any) => selected?.name}>
              {categoryList.map((soonType: any, index: number) => (
                <MenuItem key={index} value={soonType}>
                  <Checkbox checked={categorySelected?.id == soonType.id}></Checkbox>
                  <ListItemText primary={soonType.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">??????</Box>
          <Box className="value">
            <TextField
              size="small"
              fullWidth
              {...register("progress")}
              value={progress}
              onChange={(e: any) => {
                setProgress(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box className="row">
          {/* ????????????.. ????????? ?????? */}
          <Box className="header">?????? ??????</Box>
          <Box className="value">
            <TextField fullWidth size="small" value={soonwon?.map(({nickname}: any) => nickname).join(", ")} InputProps={{readOnly: true}} />
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">??????</Box>
          <Box sx={{width: "100%"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                inputFormat="MM/DD/YYYY"
                value={date}
                onChange={handleDateChange}
                renderInput={params => <TextField fullWidth size="small" {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box className="row">
          <Box className="header">??????</Box>
          <Box className="value">
            <TextField
              size="small"
              fullWidth
              multiline
              rows={4}
              {...register("contents")}
              value={contents}
              onChange={(e: any) => {
                setContents(e.target.value);
              }}
            />
          </Box>
        </Box>
        {/* ?????? ???????! */}
        <Box className="row" sx={{flexDirection: "column", marginTop: "0!important"}}>
          <Box sx={{background: "#F7F9FA", fontWeight: "700", width: "100%!important"}}>
            <Box sx={{padding: "10px 20px"}}>????????????</Box>
          </Box>
          {prayList?.length > 0 && (
            <Box sx={{width: "100%"}}>
              <List>{prayView}</List>
            </Box>
          )}
          {prayList?.length == 0 && <NoData />}
        </Box>
        <Box className="row">
          <Box className="value">
            {prayers.map((value, index) => (
              <Box key={index} sx={{display: "flex", alignItems: "center", padding: "2px 0"}}>
                <TextField
                  size="small"
                  fullWidth
                  value={value.pray}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handlePrayerFieldChange(event, index)}
                  required={true}
                />
                <Box sx={{display: "flex", alignItems: "center", minWidth: "105px", marginLeft: "10px"}}>
                  <FormControlLabel
                    sx={{minWidth: "75px"}}
                    control={
                      <Checkbox
                        checked={value.publicyn == "Y" ? true : false}
                        onChange={event => handlPublicynChange(event, index)}
                        name={`publicyn-${index}`}
                      />
                    }
                    label="??????"
                  />
                  <RemoveCircleOutlineIcon onClick={() => handleDeletePrayerField(index)} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>{" "}
        {/* ?????? ?????? ?????????,  */}
        <Box sx={{gap: 1}}>
          <Button variant="outlined" fullWidth onClick={handleAddPrayerField}>
            ???????????? ??????
          </Button>
          <Button variant="contained" fullWidth onClick={handlePraysSave}>
            ???????????? ??????
          </Button>
        </Box>
        {SubmitButton}
      </Box>
    </>
  );
}

function MyHeader({onConfirm, handleClose}: any) {
  const {pathname} = useLocation();

  const navigate = useNavigate();
  const handlePrev = () => {
    navigate(-1);
  };
  return (
    <>
      <AppBar sx={{position: "relative", backgroundColor: "#000000!important", color: "white!important"}}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon color="secondary" />
          </IconButton>
          <Typography sx={{flex: 1}} variant="h6" component="div">
            {getTitle(pathname)}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onConfirm} aria-label="close">
            <CheckIcon color="secondary" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
