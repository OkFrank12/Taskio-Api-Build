import { Types } from "mongoose";
import authModel from "../model/authModel";
import { Request, Response } from "express";
import taskModel from "../model/taskModel";

export const moveTaskToProgress = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id, task_id } = req.params;
    if (!Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "This user does not have a Taskion account",
      });
    }
    if (!Types.ObjectId.isValid(task_id)) {
      return res.status(404).json({
        message: "This task does not exist",
      });
    }
    const findTaskion: any = await authModel.findById(_id);
    const findTask = await taskModel.findById(task_id);

    if (findTask && findTaskion) {
      await taskModel.findByIdAndUpdate(
        findTask._id,
        {
          status: "InProgress",
        },
        { new: true }
      );

      findTaskion.progressHistory.push(new Types.ObjectId(task_id));
      findTaskion.doneHistory.pull(new Types.ObjectId(task_id));
      findTaskion.save();

      return res.status(200).json({
        message: "Moved To Progress",
      });
    } else {
      return res.status(404).json({
        message:
          "This User or Task you want to move to progress, does not exist",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewTaskInProgress = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    if (!Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "This user does not have a Taskion account",
      });
    }

    const findTaskion = await authModel.findById(_id).populate({
      path: "progressHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(200).json({
      message: `Taskion ${findTaskion?.userName}'s Task in Progress`,
      data: findTaskion?.progressHistory,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
