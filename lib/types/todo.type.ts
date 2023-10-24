export default interface TodoInterface {
  _id?: string;
  type: string;
  category: string;
  name: string;
  owner?: {
    _id: string;
    email: string;
  };
}
