import { Request, Response } from "express";
import taskModel from "../model/taskModel";
import { Types } from "mongoose";
import authModel from "../model/authModel";

export const createTaskControl = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { title, description, targetDate, category, priority } = req.body;
    if (!Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "This user does not have a Taskion account",
      });
    }
    const findTaskion: any = await authModel.findById(_id);
    if (!findTaskion) {
      return res.status(404).json({
        message: "This user is not a Taskion",
      });
    } else {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Input your task details",
        });
      } else {
        const createTask = await taskModel.create({
          title,
          description,
          targetDate,
          category,
          priority,
        });

        findTaskion?.taskHistory.push(new Types.ObjectId(createTask._id));
        findTaskion?.save();

        return res.status(201).json({
          message: "Task Created Successfully",
          data: createTask,
        });
      }
    }
  } catch (error: any) {
    console.error(error);
  }
};

export const viewTaskionsTaskControl = async (
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
      path: "taskHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(200).json({
      message: `Taskion ${findTaskion?.userName}'s Task`,
      data: findTaskion?.taskHistory,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const editTaskControl = async (req: Request, res: Response) => {
  try {
    const { _id, task_id } = req.params;
    const { title, description, category, priority, targetDate } = req.body;
    if (!Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "This user does not have a Taskion account",
      });
    }

    if (!Types.ObjectId.isValid(task_id)) {
      return res.status(404).json({
        message: "This task does not exit",
      });
    }

    const findTaskion = await authModel.findById(_id);
    const findTask = await taskModel.findById(task_id);
    if (!findTaskion && !findTask) {
      return res.status(404).json({
        message: "This User or Task you want to edit, does not exist",
      });
    } else {
      const editTask = await taskModel.findByIdAndUpdate(
        task_id,
        {
          title,
          description,
          category,
          priority,
          targetDate,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Task Edited Successfully",
        data: editTask,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const moveTaskToTrash = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id, task_id } = req.params;
    const findTaskion: any = await authModel.findById(_id);
    const findTask = await taskModel.findById(task_id);

    if (!findTaskion && !findTask) {
      return res.status(404).json({
        message: "This User or Task you want to move to trash, does not exist",
      });
    } else {
      await taskModel.findByIdAndUpdate(
        findTask?._id,
        {
          status: "Trash",
        },
        { new: true }
      );

      findTaskion?.trash.push(new Types.ObjectId(findTask?._id));
      findTaskion?.progressHistory.pull(new Types.ObjectId(findTask?._id));
      findTaskion?.save();

      setTimeout(async () => {
        await taskModel.findByIdAndDelete(task_id);
      }, 432000000);

      return res.status(200).json({
        message: "Moved To Trash",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const moveToAllTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id, task_id } = req.params;
    const findTaskion: any = await authModel.findById(_id);
    const findTask = await taskModel.findById(task_id);
    if (!findTaskion && !findTask) {
      return res.status(404).json({
        message:
          "This User or Task you want to move to all task, does not exist",
      });
    } else {
      await taskModel.findByIdAndUpdate(
        findTask?._id,
        {
          status: "Task",
        },
        { new: true }
      );

      findTaskion?.taskHistory.push(new Types.ObjectId(findTask?._id));
      findTaskion?.progressHistory.pull(new Types.ObjectId(findTask?._id));
      findTaskion.starredHistory.pull(new Types.ObjectId(findTask?._id));
      findTaskion?.trash.pull(new Types.ObjectId(findTask?._id));
      findTaskion.save();

      return res.status(200).json({
        message: "Moved To All Tasks",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewTrashedTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const findTaskion = await authModel.findById(_id).populate({
      path: "trash",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(200).json({
      message: `Taskion ${findTaskion?.userName}'s Trashed Task`,
      data: findTaskion?.trash,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTrashedTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id, task_id } = req.params;
    const findTaskion: any = await authModel.findById(_id);
    const findTask = await taskModel.findById(task_id);
    if (!findTaskion && !findTask) {
      return res.status(404).json({
        message:
          "This User or Task you want to delete permanently, does not exist",
      });
    } else {
      await taskModel.findByIdAndDelete(task_id);
      findTaskion.progressHistory.pull(new Types.ObjectId(task_id));
      findTaskion.starredHistory.pull(new Types.ObjectId(task_id));
      findTaskion.doneHistory.pull(new Types.ObjectId(task_id));
      findTaskion.save();

      return res.status(200).json({
        message: "Task Deleted",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
