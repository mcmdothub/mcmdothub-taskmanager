import { Task } from "./task.model";

export interface Project {
    id: number;
    name: string;
    description: string;
    // List of Tasks: can be declared in 2 ways
    //tasks: Array<Task>;
    tasks: Task[];
}
