import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "./userModel";
import { ILanguage } from "../Admin/languageModel";
import { ILesson } from "../Admin/lessonModel";

interface IProgress {
  userId: Types.ObjectId;
  languages: {
    language: Types.ObjectId;
    streak: number;
    quizAttempted:number
    quizFailed:number
    quizWin:number
    lastActiveDate: Date | null; 
    lessons: {
      lesson: Types.ObjectId;
      isCompleted: boolean;
      progress: number;
    }[];
  }[];
}


const ProgressSchema = new Schema<IProgress>({
  userId : {type : Schema.Types.ObjectId, ref:'User'},
  languages : [{
    language : {type : Schema.Types.ObjectId, ref:'Language'},
    quizAttempted:{type:Number, default:0},
    quizFailed:{type:Number, default:0},
    quizWin:{type:Number, default:0},
    streak : {type : Number, default:0},
    lastActiveDate : {type : Date},
    lessons : [{
      lesson : {type : Schema.Types.ObjectId, ref : 'Lesson'},
      isCompleted : {type : Boolean, default : false},
      progress : {type : Number, default : 0}
    }]
  }]
})

const Progress = model<IProgress>('Progress',ProgressSchema)

export {Progress, IProgress}