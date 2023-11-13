import { IProduct } from '#/interfaces/IProduct';
import { DraggableProvided } from 'react-beautiful-dnd';

export interface ICardProps {
  provided: DraggableProvided;
  product: IProduct;
}
