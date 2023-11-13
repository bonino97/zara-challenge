import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { Button } from '@mui/material';
import { PlusIcon, ZoomInIcon, ZoomOutIcon } from '@radix-ui/react-icons';

import useAxios from '#/hooks/useAxios';
import { IProduct } from '#/interfaces/IProduct';
import Header from '#/components/Header';
import Card from '#/components/Card';

const HomePage: React.FC = () => {
  const axios = useAxios();
  const [rows, setRows] = useState<IProduct[][]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(true);

  const getProducts = async () => {
    try {
      const { data, error } = await axios.get('/products');

      if (error) return alert(`Error: ${error}`);

      const newRows: IProduct[][] = [[], [], []];

      for (let i = 0; i < data.length; i++) {
        const rowIndex = i % 3; // Esto distribuirá los productos en tres filas
        if (newRows[rowIndex].length < 3) {
          // Asegúrate de no agregar más de 3 productos por fila
          newRows[rowIndex].push(data[i]);
        }
      }
      setRows(newRows);
    } catch (error) {
      return alert(`Error: ${error}`);
    }
  };

  const handleOnDragStart = () => {
    setIsDragging(true); // Se inicia el arrastre
  };

  const handleOnDragEnd: OnDragEndResponder = async (result) => {
    setIsDragging(false); // Se termina el arrastre
    const { source, destination } = result;
    // No hacer nada si no hay un destino o si el ítem se soltó en el mismo lugar
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Crear una copia del estado actual de las filas
    let newRows = [...rows];

    // Extraer el elemento arrastrado de su posición original
    const sourceRow = parseInt(source.droppableId.replace('droppable-', ''));
    const [removed] = newRows[sourceRow].splice(source.index, 1);

    // Si el elemento se mueve a otra fila existente, verifica si el destino permite otro ítem
    const destinationRow = parseInt(
      destination.droppableId.replace('droppable-', ''),
    );

    if (newRows[destinationRow].length < 3) {
      newRows[destinationRow].splice(destination.index, 0, removed);
    } else {
      // Si la fila de destino ya tiene 3 ítems, coloca el ítem removido de vuelta en su origen
      newRows[sourceRow].splice(source.index, 0, removed);
      alert('No puedes añadir más de 3 ítems en una fila.');
    }

    setRows(newRows);
  };

  const addRow = () => {
    const newRows = [...rows];
    newRows.push([]);
    setRows(newRows);
  };

  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Límite máximo de 2x zoom
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Límite mínimo de 0.5x zoom
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-5">
      <div className="container mx-auto">
        <Header />
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
            transition: 'transform 0.2s', // Agrega una transición suave al cambiar el zoom
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
      </div>
    </div>
  );
};

export default HomePage;
