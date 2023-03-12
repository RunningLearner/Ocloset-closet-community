import { Router } from "express";
import {
  createData,
  deleteData,
  getList,
  updateData,
} from "../controller/closet";

export const path = "/closet";
export const router = Router();

router.post("/create", createData);

// 옷 정보 불러오기
router.get("/list", getList);

//옷정보 삭제
router.delete("/delete/:shortId", deleteData);

router.put("/list/update", updateData);
