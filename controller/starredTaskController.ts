import { Request, Response } from "express";
import taskModel from "../model/taskModel";
import authModel from "../model/authModel";
import { Types } from "mongoose";

export const starredTaskControl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id, task_id } = req.params;
    const findTaskion: any = await authModel.findById(_id);
    const findTask = await taskModel.findById(task_id);

    if (!findTaskion && !findTask) {
      return res.status(404).json({
        message: "This User or Task you want to star, does not exist",
      });
    } else {
      if (findTask?.starred === false) {
        await taskModel.findByIdAndUpdate(
          findTask?._id,
          {
            starred: true,
          },
          { new: true }
        );

        findTaskion?.starredHistory.push(new Types.ObjectId(findTask?._id));
        findTaskion?.save();

        return res.status(200).json({
          message: "Task is starred",
        });
      } else {
        await taskModel.findByIdAndUpdate(
          findTask?._id,
          {
            starred: false,
          },
          { new: true }
        );

        findTaskion?.starredHistory.pull(new Types.ObjectId(findTask?._id));
        findTaskion?.save();

        return res.status(200).json({
          message: "Task is unstarred",
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewStarredTaskControl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const findTaskion = await authModel.findById(_id).populate({
      path: "starredHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(200).json({
      message: `Taskion ${findTaskion?.userName}'s Starred Task`,
      data: findTaskion?.starredHistory,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
