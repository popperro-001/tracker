export default interface PlanInterface {
  _id?: string;
  title: string;
  actual: boolean;
  date: string;
  bodyweight: number;
  weekdays: Array<string>;
  tasks: Array<{
    _id?:string;
    todo: { category: string; name: string; _id: string };
    sets: Array<{ reps: number; weight: number }>;
    actual: boolean;
  }>;
}
