import { Request, Response } from "express";
import authModel from "../model/authModel";
import { Types } from "mongoose";
import taskModel from "../model/taskModel";

export const moveTaskToCompleted = async (
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

    if (findTaskion && findTask) {
      await taskModel.findByIdAndUpdate(
        findTask._id,
        {
          status: "Completed",
        },
        { new: true }
      );
      findTaskion.progressHistory.pull(new Types.ObjectId(task_id));
      findTaskion.doneHistory.push(new Types.ObjectId(task_id));
      findTaskion.save();

      return res.status(200).json({
        message: "Task Completed",
      });
    } else {
      return res.status(404).json({
        message: "This User or Task you intend to complete, does not exist",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewCompletedTask = async (
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
      path: "doneHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(200).json({
      message: `Taskion ${findTaskion?.userName}'s Completed Task`,
      data: findTaskion?.doneHistory,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
