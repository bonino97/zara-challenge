import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { Button } from '@mui/material';
import { PlusIcon, ZoomInIcon, ZoomOutIcon } from '@radix-ui/react-icons';
import useAxios from '#/hooks/useAxios';
import Card from '#/components/Card';
import { IDragDropProps } from './types';

const DragDrop: React.FC<IDragDropProps> = ({
  rows,
  setRows,
}: IDragDropProps) => {
  const axios = useAxios();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(true);
  const handleOnDragStart = () => {
    setIsDragging(true);
  };

  const handleOnDragEnd: OnDragEndResponder = async (result) => {
    setIsDragging(false);
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    let newRows = [...rows];

    const sourceRow = parseInt(source.droppableId.replace('droppable-', ''));
    const [removed] = newRows[sourceRow].splice(source.index, 1);

    const destinationRow = parseInt(
      destination.droppableId.replace('droppable-', ''),
    );

    if (newRows[destinationRow].length < 3) {
      newRows[destinationRow].splice(destination.index, 0, removed);
    } else {
      newRows[sourceRow].splice(source.index, 0, removed);
      alert('No puedes añadir más de 3 ítems en una fila.');
    }

    setRows(newRows);

    await axios.post(`/grids`, newRows);
  };

  const addRow = () => {
    const newRows = [...rows];
    newRows.push([]);
    setRows(newRows);
  };

  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  return (
    <>
      <div className="flex justify-end py-4">
        <Button variant="outlined" onClick={zoomOut} size="large">
          <ZoomOutIcon className="w-4 h-4" />
        </Button>
        <Button variant="outlined" onClick={zoomIn} size="large">
          <ZoomInIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outlined"
          onClick={addRow}
          size="large"
          startIcon={<PlusIcon className="w-4 h-4" />}
        >
          Add Row
        </Button>
      </div>
      <div
        style={{
          transform: isDragging ? 'none' : `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s',
        }}
      >
        <DragDropContext
          onDragStart={handleOnDragStart}
          onDragEnd={handleOnDragEnd}
        >
          {rows.map((row, rowIndex) => (
            <Droppable
              droppableId={`droppable-${rowIndex}`}
              direction="horizontal"
              key={rowIndex}
              isCombineEnabled={false}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex justify-center space-x-4 mb-4 border-2 border-gray-300 rounded-md p-4"
                  style={{
                    backgroundColor: snapshot.isDraggingOver
                      ? '#dfe6e9'
                      : 'transparent',
                    borderStyle: row.length === 0 ? 'dashed' : 'solid',
                    minHeight: '200px',
                  }}
                >
                  {row.map((product, productIndex) => (
                    <Draggable
                      key={product.id}
                      draggableId={product.id}
                      index={productIndex}
                    >
                      {(provided, snapshot) => (
                        <Card provided={provided} product={product} />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </>
  );
};

export default DragDrop;
