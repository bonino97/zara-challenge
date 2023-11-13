import React from 'react';
import { ICardProps } from './types';

const Card: React.FC<ICardProps> = ({ provided, product }: ICardProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="p-4 w-52 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover rounded-md"
      />
      <div className="mt-3">
        <h3 className="text-md font-semibold">{product.name}</h3>
        <p className="text-md">€ {product.price}</p>
      </div>
    </div>
  );
};

export default Card;
