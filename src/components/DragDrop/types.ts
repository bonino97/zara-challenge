import { IProduct } from '#/interfaces/IProduct';

export interface IDragDropProps {
  rows: IProduct[][];
  setRows: React.Dispatch<React.SetStateAction<IProduct[][]>>;
}
